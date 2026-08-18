<h1 align="center">Subhrajyoti Singha</h1>

<p align="center">
  <b>Backend Engineer</b> · Java/Spring Boot · Node.js · Python<br>
  CS @ SRM Institute of Science and Technology · Class of 2027
</p>

<p align="center">
  <a href="https://subhrajyoti-portfolio.web.app/">Portfolio</a> ·
  <a href="https://www.linkedin.com/in/subhrajyoti-singha-b243082a3/">LinkedIn</a> ·
  <a href="mailto:subhrajyoti.singha30@gmail.com">Email</a>
</p>

---

I build backend systems that run in production and stay running — concurrent data pipelines, spec-compliant APIs, and containerized services on small, cheap boxes. Most of what I write ends up with real users on the other end.

Currently a **Full Stack Engineering Intern at ZeroHash Technology**, working on a live subscription product.

---

## Open Source — Microsoft PowerToys

Two merged contributions to [microsoft/PowerToys](https://github.com/microsoft/PowerToys), Microsoft's Windows utility suite (C# / .NET 10, WinUI 3, Native AOT).

**[#49437](https://github.com/microsoft/PowerToys/pull/49437) — "Update and restart" / "Update and shut down" commands** · merged Aug 2026
Closed [issue #48849](https://github.com/microsoft/PowerToys/issues/48849) (`Help Wanted`). 15 files, +579/−19, three commits, two full maintainer review rounds.

- Detected pending updates through the **Windows Update Agent COM API** (`ISystemInformation::RebootRequired`) so the commands surface exactly when Windows itself offers them.
- Wrote **AOT-safe COM interop** with source-generated `[GeneratedComInterface]` and `StrategyBasedComWrappers` — classic `ComImport` marshalling is unavailable under Native AOT.
- Invoked `InitiateShutdown` via Win32 interop, enabling and then **restoring `SeShutdownPrivilege`** on the process token, including the `ERROR_NOT_ALL_ASSIGNED` case that `AdjustTokenPrivileges` doesn't report through its return value.
- Reworked the query cache to publish timestamp and value together under a lock using `Environment.TickCount64`, so a concurrent reader can't read a stale value as fresh.
- Migrated hand-written P/Invoke to **CsWin32** source-generated bindings to match repo conventions. 30 passing unit tests; verified clean on x64 and arm64 CI.

**[#49356](https://github.com/microsoft/PowerToys/pull/49356) — Command Palette calculator functions** · merged Jul 2026
Fixed a regression where inverse trigonometric functions silently failed after the Mages → exprtk engine migration, then added reciprocal, hyperbolic, and inverse-hyperbolic trig plus `logn(x, base)` and `root(x, n)` — with unit test coverage.

---

## Projects

### [Visalo](https://www.visalo.xyz/) — Schengen visa appointment tracker
`Node.js` `SQLite` `AWS EC2` `Stripe`

Distributed real-time monitoring across **70+ visa endpoints** in the UK and Ireland, polling HTTP scrapers, MTProto, and REST APIs concurrently at 10–50s intervals.

- SQLite in WAL mode with SHA-256 content hashing and MD5 fingerprinting for **lock-free deduplication** across concurrent writers — no race conditions, no rate-limit bans.
- WhatsApp bot and Stripe checkout wired through Express webhooks, handling onboarding, per-market subscription preferences, and lifecycle for **100+ paying subscribers**.

### [CalSync 2.0](https://trycalsync.duckdns.org/) — Timetable → calendar sync
`Java` `Spring Boot` `PostgreSQL` `Docker` `AWS` — [backend](https://github.com/Subhro-ai/calSync-backend)

Turns a slow university portal into an auto-updating **RFC 5545 iCalendar** feed you subscribe to once in Google/Apple/Outlook Calendar.

- Deterministic event UIDs and ETag conditional caching make refreshes idempotent — no duplicate-event storms when day orders shift mid-semester.
- Reverse-engineered a Zoho-based portal with jsoup: CAPTCHA challenges, concurrent-session eviction, multi-source merges. **21 JUnit tests.**
- **Zero requests hit the university servers on a feed read** — everything resolves from a local lookup, and no student credentials are ever stored.
- 4-service Docker Compose stack on a 1 GB EC2 instance with automatic TLS and daily backups, running at **$0/month**.

### [SurveilAI](https://surveilai.onrender.com/) — AI surveillance system
`React` `FastAPI` `OpenCV` `PostgreSQL` — [repo](https://github.com/Subhro-ai/SurveilAI)

Threat detection over live video frames, with a PostgreSQL schema built for high-throughput alert metadata.

---

## Stack

**Languages** Java · Python · C++ · TypeScript/JavaScript · SQL
**Backend** Spring Boot · Node.js · Express · FastAPI · REST APIs
**Frontend** React · Next.js · Angular · Tailwind
**Data** PostgreSQL · MySQL · SQLite · MongoDB · Redis
**Infra** AWS EC2 · Docker · GitHub Actions · CI/CD · PM2

---

## Also

SAP Certified Associate — Back-End Developer (ABAP Cloud) · Generative AI Developer
NPTEL — Elite in Machine Learning · Silver in Internet of Things
First Prize, IEEE CSIS Coding Competition 2024
CGPA 9.34

---

<p align="center">
  <i>Open to backend and full-stack roles — India or remote.</i><br>
  <a href="mailto:subhrajyoti.singha30@gmail.com">subhrajyoti.singha30@gmail.com</a>
</p>
