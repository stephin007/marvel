import Link from "next/link";

const BUILDER = {
  name: "Stephin T Reji",
  url: "https://stephinreji.com",
} as const;

type SiteFooterProps = {
  /** Compact corner credit for the full-screen map */
  variant?: "page" | "map";
};

export function SiteFooter({ variant = "page" }: SiteFooterProps) {
  if (variant === "map") {
    return (
      <p className="pointer-events-auto absolute bottom-4 right-4 z-10 text-[11px] text-[#6b6560] md:bottom-5 md:right-5">
        Built by{" "}
        <a
          href={BUILDER.url}
          target="_blank"
          rel="noreferrer"
          className="text-[#9a9488] underline-offset-2 transition hover:text-[#e8e2d6] hover:underline"
        >
          {BUILDER.name}
        </a>
      </p>
    );
  }

  return (
    <footer className="border-t border-white/10 bg-[#06080f] px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#8a857a]">
          Built by{" "}
          <Link
            href={BUILDER.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#e8e2d6] underline-offset-4 transition hover:text-white hover:underline"
          >
            {BUILDER.name}
          </Link>
        </p>
        <p className="text-xs text-[#5c574f]">
          Fan project · Character data via{" "}
          <a
            href="https://comicvine.gamespot.com/"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:text-[#9a9488] hover:underline"
          >
            Comic Vine
          </a>
          . Not affiliated with Marvel or Disney.
        </p>
      </div>
    </footer>
  );
}
