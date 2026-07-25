---
title: "NJU OS by Jyy "
date: 2026-07-25
tags: [OS, Systems, Learning, Course Review]
category: reflection
slug: os-course-30-lectures
---

I spent a few days working through Nanjing University's Operating Systems course (2026 Spring) taught by Prof. Jiang. It is 30 lectures across three units — Virtualization, Concurrency, Persistence — plus 9 lab assignments. Here is what each lecture left with me.

---

## Unit 1: Virtualization (Lectures 1-12)

### Lect 1 — Why Bother with OS in the AI Era?

The opening lecture asks a question most courses avoid: "AI can already code, so why learn this?" The answer: **abstraction is how you manage complexity**. The OS hides hardware behind APIs so applications do not have to care. This skill — designing good abstractions — matters more in the agent age, not less.

### Lect 2 — OS from the Application's View

OS = objects + API. A program is a **state machine**: initial state = `main(argc, argv)`, transition = execute one statement. This single idea becomes the foundation for everything that follows.

### Lect 3 — OS from the Hardware's View

Hardware does not know an OS exists. It is just a state machine running instructions. CPU Reset sets a known initial state, then it is off to the races. The OS is just a C program — it has no special privileges except the ones the hardware gives it.

### Lect 4 — Scaling Law and Agentic AI (Hacking Day)

A detour to reflect on AI. GPT-3.5 was already answering compiler optimization questions perfectly two months after launch. The professor's comment: "Everyone was still fine-tuning BERT, and suddenly the world changed."

### Lect 5 — Programs and Processes

The core insight: simulate one program inside another. Like non-recursive Tower of Hanoi. A CrazyOS is just a loop:

```c
while (1) {
    p = pickup_one();
    p->single_step();
}
```

That is the OS main loop.

### Lect 6 — The Process Address Space

Three system calls define process management:

- `fork()` — copy the state machine
- `execve()` — reset the state machine
- `_exit()` — delete the state machine
- `waitpid()` — synchronize with a child

Everything else is built on these.

### Lect 7 — Accessing OS Objects

Everything is a File. Not metaphorically. The kernel defines a `struct file_operations` with read, write, ioctl — and anything can implement it. `/dev/urandom`, `/proc/pid/maps`, a pipe, a socket, a printer. **Same API, infinite applications.**

A concrete example that stuck with me:

```bash
grep -s VmRSS /proc/*[0-9]/status | awk '{sum += $2} END {print sum " kB"}'
```

One command computes total physical memory of every process. Because every process's memory info is a "file."

### Lect 8 — Terminals and the UNIX Shell

Tracing the history from typewriters to VT100 explains why we have `\r`, `\n`, `\t`, 80-column terminals, ANSI escape sequences. The terminal you open today is a software simulation of a 1978 DEC VT100 — including its limitations and quirks.

### Lect 9 — The C Standard Library (1)

C is the bridge between high-level languages and the OS. Every language runtime (Python, Node.js, JVM) is a C program underneath. The C standard library wraps system calls into usable functions. You can also skip the library entirely and call syscalls directly with inline assembly:

```c
void _start() {
    __asm__("mov $60, %eax\n"
            "xor %edi, %edi\n"
            "syscall");
}
```

(Yes, `_start`, not `main`, is the real entry point.)

### Lect 10 — The C Standard Library (2)

Compiling your own libc (musl-gcc) shows it is not a magical black box — it is just a C program. Debug info formats (DWARF) and source maps (`.map`) reveal how much extra data your binaries carry.

### Lect 11 — Executable Files

An executable file is **a data structure describing the initial memory layout of a process**. Not "a program" — a blueprint. ELF is complicated because it is designed for machine efficiency, not human readability. The professor's response: FLE (Funny Little Executable), a homebrew format simple enough to understand, with an AI-written converter.

### Lect 12 — Building Application Ecosystem (Hacking Day)

The history of UNIX system calls: there was no fork() in the beginning. Shell used to close all files, open the terminal, read a command, load the new program into memory, execute it, and then re-load itself on exit. Fork was added later — 27 lines of assembly by Ken Thompson. **Do not be afraid to start with something that works poorly and improve it iteratively.** Minix showed that a teaching OS can accidentally become the most deployed OS on the planet (Intel ME).

---

## Unit 2: Concurrency (Lectures 13-21)

### Lect 13 — Multiprocessor Programming: From Entry to Exit

This lecture expands the state machine model: a multi-threaded program selects one thread and executes one statement. Simple. Then it shows you three ways the machine betrays you at once:

1. **The scheduler** interleaves threads arbitrarily
2. **The compiler** reorders and eliminates code (sum++ at -O1 and -O2 gave completely different results)
3. **The CPU** has a relaxed memory model — writes are not immediately visible to other cores

The famous example:

```c
int x = 0, y = 0;

void T_1() { x = 1; int t = y; }
void T_2() { y = 1; int t = x; }
```

Naively, four results are possible: (0,0), (1,0), (0,1), (1,1). In practice with relaxed memory models, (0,0) is also possible — both writes happened but neither was visible to the other core.

### Lect 14 — Mutual Exclusion

The professor's explanation of mutexes uses two analogies:

- **Bathroom lock**: lock the door, do your business, unlock
- **Key on a table**: take the key, only you can go in; put it back when done

But the real content is deeper: why interrupt disabling doesn't work on multicore, why Dekker and Peterson's algorithms (pure load/store) don't work on real hardware, and why atomic instructions (`lock cmpxchg`) exist. Then why spin locks are wasteful, and why futex (kernel-assisted mutex) exists — fast path in user space, slow path in kernel.

### Lect 15 — Synchronization and Condition Variables

Mutex ensures mutual exclusion but not ordering. `join()` cannot be implemented with mutex alone. Condition variables fill the gap:

```c
mutex_lock(&lk);
while (!cond)
    cond_wait(&cv, &lk);
mutex_unlock(&lk);
```

The producer-consumer problem — 99% of concurrency problems reduce to this pattern.

### Lect 16 — Semaphores

What if a mutex could have N keys instead of 1? That is a semaphore. P (acquire, take a key) and V (release, return a key). The producer-consumer problem becomes beautifully simple:

```c
sem_t empty = SEM_INIT(depth);
sem_t fill = SEM_INIT(0);

void T_produce() { P(&empty); printf("("); V(&fill); }
void T_consume() { P(&fill); printf(")"); V(&empty); }
```

But semaphores are not universal — they work best when the condition is a counter. For complex conditions (OR conditions), condition variables are more natural.

### Lect 17 — Concurrency Bugs

Two types of deadlock:
- **AA-deadlock**: same thread locks the same mutex twice
- **ABBA-deadlock**: thread 1 holds A waits for B, thread 2 holds B waits for A

Four necessary conditions for deadlock: mutual exclusion, wait-for, no preemption, circular chain. Break any one and deadlock disappears. Lock ordering (always acquire locks in the same global order) is the most practical prevention.

Beyond deadlock: **data race** (concurrent access to same memory, one is a write, no happens-before). C/C++ data race is undefined behavior. The compiler can do anything.

Two categories cover 97% of non-deadlock concurrency bugs (from an ASPLOS'08 study):
- **Atomicity violation** (AV): code that should run without interruption gets interrupted
- **Order violation** (OV): events happen in the wrong order

The Therac-25 radiation machine (1985-1987) — six deaths caused by a concurrency bug where mode switching and hardware setup were not atomic. **A reminder that concurrency bugs can kill.**

### Lect 18 — Parallel Algorithms and Data Structures

Mutex ensures correctness but kills scalability. The sloppy counter pattern: each thread accumulates locally, then merges into the global counter in batches. This reduces lock contention by orders of magnitude.

Thread-local storage (`thread_local` in C11/C++11) gives each thread its own copy of a variable. The compiler implements this via a segment register (`%fs` on x86-64), pointing different threads to different memory areas.

### Lect 19 — Asynchronous Programming Models

Threads are expensive — each one consumes MB of stack and kernel resources. Coroutines, goroutines, async/await all address this by multiplexing many lightweight execution flows onto fewer OS threads.

Go's model: N worker threads (one per CPU core), M goroutines scheduled on them. Channel-based communication ("Do not communicate by sharing memory; share memory by communicating") replaces shared state and locks with data passing — essentially UNIX pipes for concurrency.

### Lect 20 — CPU, GPU and SIMT

From instruction-level parallelism (ILP) to SIMD to SIMT. The key insight: **fetching and decoding an instruction costs energy. If multiple execution units share one fetch/decode unit, the cost is amortized.**

This is why GPU can pack thousands of cores — they are simple execution units grouped in warps of 32, all sharing a single program counter. Every thread in a warp executes the same instruction on different data. Branch divergence (if-else within a warp) is expensive — both paths execute, one is discarded.

### Lect 21 — A Token's Journey

The final concurrency lecture traces a single LLM request from `curl` to GPU output:

```
Your terminal → DNS → routers → Load Balancer → API Gateway → Auth/Billing → Inference Cluster → GPU SIMT kernels → Token stream → Back
```

Every concept from the course appears on this path: sockets, file descriptors, concurrent request handling, load balancing, distributed storage, GPU SIMT parallelism. The professor shows that the entire computer system stack, built over 50 years, ultimately exists to make one matrix multiply as efficient as possible.

---

## Unit 3: Persistence (Lectures 22-29)

### Lect 22 — I/O Device Principles

A device is just **a set of registers with agreed-upon functions**. CPU writes to register 0x1f2 to tell the ATA hard disk "how many sectors to read", writes to 0x1f7 to say "start reading," and reads from 0x1f0 to get the data.

The device driver translates file operations into register operations:

```c
struct file_operations {
    ssize_t (*read)(struct file *, char __user *, size_t, loff_t *);
    ssize_t (*write)(struct file *, const char __user *, size_t, loff_t *);
    long (*unlocked_ioctl)(struct file *, unsigned int, unsigned long);
    // ...
};
```

For operations that are not data transfer (changing resolution, clearing a paper jam, reading disk health), `ioctl` exists — a general-purpose control interface.

### Lect 23 — Storage Device Abstraction

The physical storage ladder: magnetic tape (sequential only, cheap) → magnetic drum → HDD (2.5D, random access but mechanical latency) → floppy disk → optical disc (CD/DVD, cheap to duplicate) → **Flash (SSD)**.

Flash is electric, not mechanical — so it is fast, parallel (more chips = faster), and shock-resistant. But it has a fatal flaw: each cell wears out after ~1000 writes (QLC). The solution: FTL (Flash Translation Layer) — a computer inside every SSD that remaps writes to spread wear evenly. **Software saving hardware's shortcomings, again.**

The OS sees all storage as block devices: `struct block disk[NUM_BLOCKS]`.

### Lect 24 — File System API (1)

Block devices are raw. File systems add meaning. The core abstraction is the **directory tree** — leveraging locality of information to organize files.

- `mount` — graft a device's tree onto another tree
- Hard links — multiple names for the same file (reference counted)
- Symbolic links — a file containing a path string (can cross file systems)
- Metadata — mode bits, owner, group, timestamps, extended attributes (xattr)

### Lect 25 — File System API (2)

Beyond basic CRUD:

- **inotify** — get notified when files change (no polling)
- **Git** as a persistent data structure — blob, tree, commit (random read + append-only write = any data structure)
- **OverlayFS** — stack multiple directories: read from top, write to top. This is how Docker layers work
- **FUSE** — implement a file system as a user-space program. Suddenly everything is a file: remote servers (sshfs), databases (dbfs), JSON (ffs)

### Lect 26 — File System Implementation

File data must live on disk blocks. Two approaches:

- **FAT** (old, simple): a global array acting like a linked list of blocks. Sequential access, poor random access.
- **inode** (UNIX): store block pointers in each file's inode. 12 direct pointers (fast for small files), plus indirect pointers for larger files.

The crash consistency problem: writing data, bitmap, and inode involves three separate block writes. If the power fails after any subset, the file system is inconsistent.

Solutions:
- **FSCK** — scan the entire disk on boot and fix up inconsistencies. Slow.
- **Journaling (WAL)** — write a log before writing data. If power fails, replay the log on recovery. This is what ext4 does.

Application-level lesson: `write()` does not reach the disk — it goes to the page cache. `fsync()` forces it to disk.

### Lect 27 — Database Systems

File systems give you bytes and paths. Databases give you **ACID transactions and queries**. The relational model (Codd, 1970) says "Everything is a table." SQL lets you declare what you want; the database figures out how to get it.

From traditional SQL to NoSQL (sacrifice queries for scalability) to vector databases for AI embeddings. The common thread: each layer exists because the layer below is not enough for the use case.

### Lect 28 — Computer System Security

CIA: Confidentiality, Integrity, Availability.

Access control: OS uses uid/gid/mode bits to decide "who can access what." But numbers leak through side channels — timing, electromagnetic radiation, cache timing (Meltdown/Spectre/Downfall).

Real-world cautionary tales: the Therac-25 (again!), the xz-utils backdoor (a 2-3 year supply chain attack), cold boot attacks (freeze RAM to read encryption keys). **No system is perfectly secure.** Defense in depth.

### Lect 29 — Virtual Machines and Containers

Two approaches to virtualization:

- **Full system (VMware)**: simulate an entire hardware stack. Can run any OS. Heavyweight.
- **OS-level (containers)**: use Linux Namespaces to virtualize OS objects (PID, mount, network, user) and cgroups to limit resources. Lightweight, but shares the host kernel.

Docker = Namespaces + cgroups + OverlayFS (layered images). Kubernetes takes containers and adds orchestration — auto-scaling, self-healing, declarative config.

The professor's commentary: "VMware led humanity down the wrong path. FreeBSD Jails (2000) had container-like isolation before VMware existed. But VMware made more money."

---

## The Labs

Nine labs mapped to the lectures:

- **M1 labyrinth** — CLI argument parsing, getopt_long, error handling
- **M2 pstree** — reading /proc filesystem, traversing process trees
- **M3 sperf** — performance profiling with signals and timers
- **M4 crepl** — fork, execve, dynamic linking, implementing a C REPL
- **M5 mymalloc** — implementing malloc, per-thread memory pools
- **M6 gpt.c** — parallelizing GPT-2 matrix multiply with threads/OpenMP
- **M7 httpd** — socket, epoll, concurrent HTTP server
- **M8 fsrecov** — recovering data from a corrupted ext2 filesystem
- **M9 libkvdb** — LSM-tree based key-value store with WAL

Each one gave me a tactile understanding of an OS concept that reading alone could not provide.

---

## Final Thought

The professor ended the course with two questions:

> "We can score well on exams. But when scores are no longer the metric, do we know what to do?"

and

> "The old guard's university system is about to collapse. Are you ready?"

The OS course is not about memorizing syscalls. It is about learning to see the layers, to understand why each one exists, and to design better ones yourself. That skill — **abstraction design** — is what lasts beyond any exam.

The course materials (lectures, labs, source code) are all open source at jyywiki.cn. If you are building systems, AI agents, or just want to understand what happens when you press the power button, I cannot recommend it enough.
