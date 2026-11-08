# FZZL 本地服一键启动（由 start.bat 调用，也可直接 powershell -File start.ps1）
#
# -Elevated：由本脚本自己用 UAC 重新拉起时传入，用来防止无限自我重启。正常调用不要传。
param(
  [switch]$Elevated
)

$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot

$ADB  = 'C:\Program Files\Netease\MuMu\nx_main\adb.exe'
$DEV  = '127.0.0.1:16480'
$PKG  = 'com.bilibili.fzzl.guopan'
$EXTCFG = Join-Path $PSScriptRoot '..\tools\bc_cmp\extcfg_dev.json'
# 「本脚本临时停过 IIS」的标记文件：stop.ps1 只在这个文件存在时才恢复 W3SVC，
# 避免把用户本来手动停掉的 IIS 又启动起来。放在 server/ 下（已被 .gitignore 覆盖运行期产物）。
$IIS_MARK = Join-Path $PSScriptRoot '.iis-stopped-by-start.json'

# ---- 管理员提权（仅当 80 被 HTTP.sys/IIS 代持时才需要）----
# 背景：Windows 上 80 被 IIS 注册成 HTTP://*:80/ 后，Node listen() 得到的是 EACCES，
# netstat 持有者是 PID 4（内核 HTTP.sys），按 PID 杀进程无效；只有管理员能 Stop-Service。
# start.bat 默认不提权；这里在检测到"确实需要提权"时用 UAC 重新拉起自己。
function Test-Admin {
  $id = [Security.Principal.WindowsIdentity]::GetCurrent()
  return (New-Object Security.Principal.WindowsPrincipal($id)).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator)
}
function Test-Port80BlockedByHttpSys {
  # 只看监听者是不是 PID 4（System / HTTP.sys）。false = 没被内核占（可能是别的程序或空闲）
  $l = Get-NetTCPConnection -LocalPort 80 -State Listen -ErrorAction SilentlyContinue
  return ($l | Where-Object { $_.OwningProcess -eq 4 } | Measure-Object).Count -gt 0
}
function Get-IisServiceState {
  $svc = Get-Service W3SVC -ErrorAction SilentlyContinue
  if ($null -eq $svc) { return $null }
  return $svc.Status
}

$needsElevation = (-not (Test-Admin)) -and (Test-Port80BlockedByHttpSys)
if ($needsElevation -and -not $Elevated) {
  Write-Host ''
  Write-Host '[0/6] 端口 80 被 IIS/HTTP.sys 代持，需要管理员权限停掉 W3SVC。' -ForegroundColor Yellow
  Write-Host '      正在请求提权（UAC 弹窗请点"是"）……' -ForegroundColor Yellow
  $argsList = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$PSCommandPath`"", '-Elevated')
  try {
    # -Verb RunAs 触发 UAC；-Wait 让本窗口等提权实例跑完再退出（保持"一个窗口一个流程"）
    Start-Process powershell -Verb RunAs -Wait -ArgumentList $argsList
    exit 0
  } catch {
    Write-Host '  [ERROR] 提权被取消或失败。' -ForegroundColor Red
    Write-Host '          你可以手动以管理员身份运行 start.bat，或执行：' -ForegroundColor Yellow
    Write-Host '          Stop-Service W3SVC -Force; Stop-Service WAS -Force' -ForegroundColor Yellow
    Start-Sleep -Seconds 8
    exit 1
  }
}
if ($Elevated) {
  Write-Host '[0/6] 已以管理员身份运行（提权实例）。' -ForegroundColor DarkGray
}

$Host.UI.RawUI.WindowTitle = 'Ark Order JS - launcher'

Write-Host ''
Write-Host '    _    ____  _  __' -ForegroundColor Cyan
Write-Host '   / \  |  _ \| |/ /' -ForegroundColor Cyan
Write-Host '  / _ \ | |_) | '' / ' -ForegroundColor Cyan
Write-Host ' / ___ \|  _ <| . \ ' -ForegroundColor Cyan
Write-Host '/_/   \_\_| \_\_|\_\' -ForegroundColor Cyan
Write-Host '  ___  ____  ____  _____ ____        _ ____  ' -ForegroundColor White
Write-Host ' / _ \|  _ \|  _ \| ____|  _ \      | / ___| ' -ForegroundColor White
Write-Host '| | | | |_) | | | |  _| | |_) |  _  | \___ \ ' -ForegroundColor White
Write-Host '| |_| |  _ <| |_| | |___|  _ <  | |_| |___) |' -ForegroundColor White
Write-Host ' \___/|_| \_\____/|_____|_| \_\  \___/|____/ ' -ForegroundColor White
Write-Host ''
Write-Host '  Ark Order JS  ·  方舟指令本地服 bootstrap' -ForegroundColor DarkGray
Write-Host '============================================' -ForegroundColor DarkGray
Write-Host ''

# 1) 连接模拟器（MuMu 重启后 adb 会掉 root，adb root 幂等恢复）
Write-Host '[1/6] Connecting emulator...'
& $ADB connect $DEV 2>$null | Out-Null
& $ADB -s $DEV root 2>$null | Out-Null
Start-Sleep -Milliseconds 1500
& $ADB connect $DEV 2>$null | Out-Null
$state = (& $ADB -s $DEV get-state 2>$null) -join ''
$emuOk = $state.Trim() -eq 'device'
if (-not $emuOk) {
  Write-Host '  [WARN] emulator not connected, skip hijack/push. Server still starts.'
} else {
  Write-Host '  OK'

  # 2) hosts 劫持：MuMu /system 为设备级只读（remount/blockdev 均被拒），
  #    用 /data + bind mount 覆盖（非持久，重启模拟器后由本脚本重新挂上，幂等）
  Write-Host '[2/6] Hijacking hosts (bind mount)...'
  $hostsSrc = Join-Path $PSScriptRoot '..\tools\bc_cmp\hosts_device'
  & $ADB -s $DEV push $hostsSrc /data/local/tmp/hosts 2>$null | Out-Null
  & $ADB -s $DEV shell "umount /system/etc/hosts 2>/dev/null; mount --bind /data/local/tmp/hosts /system/etc/hosts" 2>$null
  $hostsTxt = (& $ADB -s $DEV shell "cat /system/etc/hosts" 2>$null) -join "`n"
  if ($hostsTxt -match 'web-fzzly\.mingchaoyouxi\.com') { Write-Host '  OK hijacked' }
  else { Write-Host '  [WARN] hosts hijack failed - fix manually' }

  # 3) 重启游戏前：数据包自动注入（缺 files/res 时从数据包 APK 解包，就绪则秒过）+ 推 extcfg
  Write-Host '[3/6] Restart game: ensure data package + push extcfg...'
  & $ADB -s $DEV shell "am force-stop $PKG" 2>$null | Out-Null
  Start-Sleep -Milliseconds 800
  #   数据包注入（对齐安卓单机管线 DataPackage.Ensure）：同设备装了 <pkg>.data 数据包 APK
  #   或本地有 fzzl_data.apk 时，首轮自动把 3.2GB res 解包进 files/res；就绪则秒过。
  #   需 adb root（上面第 1 步已做）。python 不在 PATH 或注入失败都不阻塞启动，只 WARN。
  $py = Get-Command python -ErrorAction SilentlyContinue
  if ($py) {
    python (Join-Path $PSScriptRoot 'ensure_res.py') --adb $ADB --serial $DEV
    if ($LASTEXITCODE -ne 0) {
      Write-Host '  [WARN] 数据包注入未完成（退出码 '$LASTEXITCODE'，见上方输出）—— 游戏可能缺资源进不去' -ForegroundColor Yellow
    }
  } else {
    Write-Host '  [WARN] 未找到 python，跳过数据包自动注入检查' -ForegroundColor Yellow
  }
  & $ADB -s $DEV push $EXTCFG "/sdcard/Android/data/$PKG/files/extcfg.json" 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { Write-Host '  OK pushed' } else { Write-Host '  [WARN] extcfg push failed' }
}

# 4) 端口 80 预检 + 必要时临时停 IIS
#      80 常被 Windows 内核 HTTP.sys / IIS 代持 → Node listen 报 EACCES，
#      且 netstat 上持有者是 PID 4（System），按 PID 杀进程无效。
#      本脚本只在"确有 W3SVC 在占 80"时才停它，并把"我停过"写进标记文件，
#      由 stop.ps1 负责恢复（不擅自改服务的启动类型）。
Write-Host '[4/6] Checking port 80 availability...'
$blockedByKernel = Test-Port80BlockedByHttpSys
if (-not $blockedByKernel) {
  $port80 = Get-NetTCPConnection -LocalPort 80 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($port80) {
    $owner = $port80.OwningProcess
    $procName = (Get-Process -Id $owner -ErrorAction SilentlyContinue).ProcessName
    if ($procName -eq 'node') {
      Write-Host "  [WARN] 80 已被另一个 node 进程 (PID $owner) 监听 —— 可能是上次没退干净的服务。" -ForegroundColor Yellow
      Write-Host '         先跑 stop.bat 再启动，否则会报 EADDRINUSE。' -ForegroundColor Yellow
    } else {
      Write-Host "  [WARN] 80 已被 $procName (PID $owner) 占用。" -ForegroundColor Yellow
    }
  } else {
    Write-Host '  OK (80 free)'
  }
} else {
  # 只有在 W3SVC 确实存在且正在运行时才动手；SERVICE_DISABLED 之类的状态不去碰
  $iisStatus = Get-IisServiceState
  if ($null -eq $iisStatus) {
    Write-Host '  [WARN] 80 被 PID 4（内核 HTTP.sys）占用，但本机没有 W3SVC 服务。' -ForegroundColor Yellow
    Write-Host '         可能是其他 HTTP.sys 客户端（Go/http.sys、代理、加速器等），需手工排查。' -ForegroundColor Yellow
  } elseif ($iisStatus -ne 'Running') {
    Write-Host ("  [WARN] 80 被 PID 4 占用，但 W3SVC 当前状态是 {0}（不是 Running）。" -f $iisStatus) -ForegroundColor Yellow
    Write-Host '         不是 IIS 在占用，请手工排查其他 HTTP.sys 客户端。' -ForegroundColor Yellow
  } elseif (-not (Test-Admin)) {
    # 理论上走不到这里（上面已提权）；留作兜底，别静默失败
    Write-Host '  [ERROR] 需要管理员权限才能临时停 W3SVC，请以管理员身份运行 start.bat。' -ForegroundColor Red
    Start-Sleep -Seconds 8
    exit 1
  } else {
    Write-Host '  IIS (W3SVC) 正在占用 80，临时停止（stop.bat 会恢复）...'
    # 先记标记再停服务：若停在半路失败，stop.ps1 仍会尝试恢复，不会把 IIS 留在停止状态
    @{
      stoppedAt = (Get-Date).ToString('o')
      services  = @('W3SVC', 'WAS')
      pid       = $PID
    } | ConvertTo-Json | Set-Content -Path $IIS_MARK -Encoding UTF8

    $was = @{}
    foreach ($svcName in 'W3SVC', 'WAS') {
      $svc = Get-Service $svcName -ErrorAction SilentlyContinue
      if ($svc) { $was[$svcName] = $svc.Status }
    }
    # WAS 是 W3SVC 的依赖宿主，先停 W3SVC（会连带停 WAS），再兜底停一次 WAS
    Stop-Service W3SVC -Force -ErrorAction SilentlyContinue
    Stop-Service WAS -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    if (Test-Port80BlockedByHttpSys) {
      Write-Host '  [ERROR] 停了 W3SVC 但 80 仍被 PID 4 占用。' -ForegroundColor Red
      Write-Host '         还有别的 HTTP.sys 客户端注册了 :80，请执行 netsh http show servicestate 排查。' -ForegroundColor Yellow
      Start-Sleep -Seconds 8
      exit 1
    }
    Write-Host ("  OK (80 released; W3SVC was {0}, WAS was {1})" -f $was['W3SVC'], $was['WAS'])
  }
}

# 4) 启动两个服务窗口（日志同时写 server\logs\）
Write-Host '[5/6] Starting service windows (logs also in server\logs\)...'
Start-Process cmd -WorkingDirectory $PSScriptRoot -ArgumentList '/k', 'title FZZL-GameServer :80+:9021 && node start.js --port=80 --host=10.0.2.2'
Start-Process cmd -WorkingDirectory $PSScriptRoot -ArgumentList '/k', 'title FZZL-LuaRemote :44587 && node lua_remote.js'
Start-Sleep -Seconds 2

# 5) 启动游戏
if ($emuOk) {
  Write-Host '[6/6] Launching game...'
  & $ADB -s $DEV shell "monkey -p $PKG -c android.intent.category.LAUNCHER 1" 2>$null | Out-Null
} else {
  Write-Host '[6/6] Skipped (no emulator)'
}

$hostColor = if ($emuOk) { 'Green' } else { 'Yellow' }
Write-Host ''
Write-Host '============================================' -ForegroundColor DarkGray
Write-Host '  Done.' -ForegroundColor $hostColor
Write-Host '  - Two service windows opened (close window = stop that service)'
Write-Host '  - Or run stop.bat to stop all'
Write-Host '  - Log files: server\logs\server.log and lua_remote.log'
Write-Host '============================================' -ForegroundColor DarkGray
Start-Sleep -Seconds 4
