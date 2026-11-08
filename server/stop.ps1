# FZZL 本地服一键停止（由 stop.bat 调用）
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot

Write-Host 'Stopping private server node processes (start.js / lua_remote.js)...'
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object {
  $_.CommandLine -match '(lua_remote|start)\.js' -and $_.CommandLine -notmatch 'index\.js'
} | ForEach-Object {
  Write-Host ("  killed PID {0}: {1}" -f $_.ProcessId, $_.CommandLine)
  Stop-Process -Id $_.ProcessId -Force
}

# 恢复 start.ps1 临时停掉的 IIS。
# 只认标记文件：start.ps1 停服务前写入、这里恢复成功后删除。
# 不给 start.ps1 加"无脑启动 W3SVC"，否则会把用户自己手动停掉的 IIS 又拉起来。
$mark = Join-Path $PSScriptRoot '.iis-stopped-by-start.json'
if (Test-Path $mark) {
  Write-Host ''
  Write-Host 'Restoring IIS (W3SVC/WAS) that start.ps1 stopped for port 80...'
  $id = [Security.Principal.WindowsIdentity]::GetCurrent()
  $isAdmin = (New-Object Security.Principal.WindowsPrincipal($id)).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) {
    Write-Host '  [WARN] 需要管理员权限才能恢复 IIS —— 请以管理员身份运行 stop.bat。' -ForegroundColor Yellow
    Write-Host '         （标记文件保留，下次以管理员运行 stop.bat 会继续尝试）' -ForegroundColor Yellow
  } else {
    $ok = $true
    foreach ($svcName in 'W3SVC', 'WAS') {
      $svc = Get-Service $svcName -ErrorAction SilentlyContinue
      if ($null -eq $svc) { continue }
      if ($svc.Status -ne 'Running') {
        try {
          Start-Service $svcName -ErrorAction Stop
          Write-Host ("  OK {0} started" -f $svcName)
        } catch {
          $ok = $false
          Write-Host ("  [WARN] {0} 启动失败：{1}" -f $svcName, $_.Exception.Message) -ForegroundColor Yellow
          Write-Host ("         手工恢复：Start-Service {0}" -f $svcName) -ForegroundColor Yellow
        }
      } else {
        Write-Host ("  OK {0} already running" -f $svcName)
      }
    }
    if ($ok) { Remove-Item $mark -Force -ErrorAction SilentlyContinue }
  }
}

Write-Host ''
Write-Host 'Done. Game client untouched (it will fail reconnects, that is normal).'
Write-Host 'To start again: run start.bat'
Start-Sleep -Seconds 4
