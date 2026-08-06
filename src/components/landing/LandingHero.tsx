"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export function LandingHero() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <section className="relative flex flex-1 flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 bg-[#06080f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(230,36,41,0.22),transparent_55%),radial-gradient(ellipse_at_80%_60%,rgba(35,55,110,0.35),transparent_50%),radial-gradient(ellipse_at_20%_80%,rgba(201,162,39,0.08),transparent_40%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(1px_1px_at_25%_30%,rgba(255,255,255,0.5),transparent),radial-gradient(1px_1px_at_70%_20%,rgba(255,255,255,0.35),transparent),radial-gradient(1.5px_1.5px_at_40%_70%,rgba(255,255,255,0.25),transparent),radial-gradient(1px_1px_at_85%_75%,rgba(255,255,255,0.4),transparent)] [background-size:100%_100%]" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
          aria-hidden
        >
          <motion.line
            x1="18%"
            y1="28%"
            x2="42%"
            y2="36%"
            stroke="rgba(201,162,39,0.5)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.3 }}
          />
          <motion.line
            x1="42%"
            y1="36%"
            x2="58%"
            y2="22%"
            stroke="rgba(230,36,41,0.45)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.5 }}
          />
          <motion.line
            x1="58%"
            y1="22%"
            x2="72%"
            y2="40%"
            stroke="rgba(201,162,39,0.4)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.7 }}
          />
          {[
            ["18%", "28%"],
            ["42%", "36%"],
            ["58%", "22%"],
            ["72%", "40%"],
            ["30%", "55%"],
          ].map(([cx, cy], i) => (
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3"
              fill={i % 2 === 0 ? "#e62429" : "#c9a227"}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.12, type: "spring" }}
            />
          ))}
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 pt-28 md:pb-24 md:pt-32">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-[0.08em] text-[#e62429] sm:text-7xl md:text-8xl"
          >
            MARVEL
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-2xl leading-snug tracking-wide text-[#f5f1e8] sm:text-3xl md:text-4xl"
          >
            See how the Marvel Universe connects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="mt-4 max-w-md text-base leading-relaxed text-[#a8a296] md:text-lg"
          >
            An interactive constellation of heroes, teams, and events — a clear
            way to see how the Marvel Universe connects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-full bg-[#e62429] px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#ff2d33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e62429]"
            >
              Explore the map
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/guide"
              className="text-sm tracking-wide text-[#8a857a] underline-offset-4 transition hover:text-[#e8e2d6] hover:underline"
            >
              How to navigate
            </Link>
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
