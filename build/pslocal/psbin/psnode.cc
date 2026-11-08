// psnode —— B-I 形态的 node 启动器（arm64）
//
// 它只做三件 node 自己做不了的事，然后把控制权交给 node::Start：
//   1) 绑核（工作计划 §6.2 B5）：本机不绑核时 V8 线程会被调度到小核，handler 耗时抖动 2~7 ms；
//   2) 父进程存活看门狗（§6.2 B6 / R6b）：游戏被 LMK SIGKILL 时托管层没有任何机会，
//      psnode 会变成孤儿并继续占着 8081/9021/44587，下次启动直接 EADDRINUSE；
//      Android 上孤儿会被 reparent 到 init(1) —— 所以每 2 s 查一次 getppid() 即可判定；
//   3) 把 argc/argv 原样交给 node（start.js 自己解析 --port/--game-port）。
//
// 为什么不 fork/exec 一个真 node：nodejs-mobile 发布物只有 libnode.so，没有 node 可执行文件；
// 进程内 node::Start 就是它的既定用法（_diag/perf1018/nodeprobe/node64 也是这么编的）。
//
// 编译（见 build_psbin.py）：
//   aarch64-linux-android26-clang++ psnode.cc -Iinclude/node -L. -lnode -lc++_shared \
//       -Wl,-rpath,'$ORIGIN' -o psnode

#include <node.h>

#include <pthread.h>
#include <sched.h>
#include <unistd.h>

#include <cstdio>
#include <cstdlib>
#include <cstring>

namespace {

// 绑核：默认 4..7（8 核 1+3+4 布局里的大/中核）。可用 PSNODE_CPUS="6-7" 覆盖；
// 设 PSNODE_CPUS=off 关闭（对照实验用）。核数不足时自动跳过，绝不因绑核失败而不启动。
void PinCores() {
  const char* spec = getenv("PSNODE_CPUS");
  if (spec && strcmp(spec, "off") == 0) {
    fprintf(stderr, "[psnode] affinity: disabled by PSNODE_CPUS=off\n");
    return;
  }
  long ncpu = sysconf(_SC_NPROCESSORS_ONLN);
  int lo = 4, hi = 7;
  if (spec && *spec) {
    int a = 0, b = 0;
    if (sscanf(spec, "%d-%d", &a, &b) == 2) { lo = a; hi = b; }
    else if (sscanf(spec, "%d", &a) == 1) { lo = hi = a; }
  }
  if (ncpu <= 0 || lo >= ncpu) {
    fprintf(stderr, "[psnode] affinity: skip (ncpu=%ld, want %d-%d)\n", ncpu, lo, hi);
    return;
  }
  if (hi >= ncpu) hi = (int)ncpu - 1;

  cpu_set_t set;
  CPU_ZERO(&set);
  for (int c = lo; c <= hi; ++c) CPU_SET(c, &set);
  int rc = sched_setaffinity(0, sizeof(set), &set);
  fprintf(stderr, "[psnode] affinity: cpus %d-%d rc=%d\n", lo, hi, rc);
}

// 孤儿看门狗：父进程死后 reparent 到 init（pid 1）→ 主动退出。
// 用 _exit 而不是 exit：不跑 atexit/析构，避免在 node 已半死时二次踩踏；
// 存档落盘由 start.js 的 SIGTERM 路径负责，孤儿场景下数据本就可能丢最后一笔。
void* OrphanWatchdog(void*) {
  const pid_t ppid0 = getppid();
  for (;;) {
    sleep(2);
    const pid_t p = getppid();
    if (p != ppid0 && (p == 1 || p == 0)) {
      fprintf(stderr, "[psnode] parent gone (ppid %d -> %d), exiting\n", (int)ppid0, (int)p);
      _exit(0);
    }
  }
  return nullptr;
}

}  // namespace

int main(int argc, char** argv) {
  PinCores();

  pthread_t tid;
  if (pthread_create(&tid, nullptr, OrphanWatchdog, nullptr) == 0) {
    pthread_detach(tid);
  } else {
    fprintf(stderr, "[psnode] watchdog thread failed\n");
  }

  // argv[0] 会被 node 当作进程名；argv[1] 是脚本路径
  return node::Start(argc, argv);
}
