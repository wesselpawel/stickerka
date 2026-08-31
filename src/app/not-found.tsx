import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(248,127,240,0.20),_transparent_35%),linear-gradient(135deg,#fdf7ff_0%,#f3f5ff_38%,#eef6ff_100%)] px-5 py-10 text-slate-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-16 h-56 w-56 rounded-full bg-[#f8c7f7]/60 blur-3xl" />
        <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-[#a7d8ff]/60 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-[#c9f7d8]/60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl rounded-[32px] border border-white/60 bg-white/50 p-6 shadow-[0_30px_80px_rgba(76,90,128,0.12)] backdrop-blur-xl md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d8d9ff] bg-[#f2f0ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">
              404
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Ups… tej strony nie ma.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Chyba zabłądziłeś wśród naklejek. Wróć do sklepu albo zajrzyj do nas,
              żeby znaleźć coś idealnego na Twoją przestrzeń.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-3 text-base font-bold text-white shadow-[0_18px_35px_rgba(99,102,241,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Przejdź do sklepu
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-base font-bold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-white"
              >
                O nas
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-[#f8c7f7] via-[#ddd7ff] to-[#a7d8ff] opacity-80 blur-3xl" />
            <div className="relative flex h-[280px] w-[280px] items-center justify-center rounded-[30px] border border-white/70 bg-white/60 shadow-[0_24px_60px_rgba(91,104,146,0.18)] backdrop-blur-md">
              <div className="absolute inset-6 rounded-[24px] border border-dashed border-slate-300/80" />

              <div className="relative flex flex-col items-center justify-center text-center">
                <span className="text-[84px] font-black leading-none tracking-[-0.1em] text-transparent bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-400 bg-clip-text">
                  404
                </span>
                <span className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                  lost in art
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
