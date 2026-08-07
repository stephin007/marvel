"use client";

import { useOpenPanel } from "@openpanel/nextjs";
import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import type { AnalyticsEventName } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: AnalyticsEventName;
  eventProperties?: Record<string, unknown>;
};

export function TrackedLink({
  event,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps) {
  const op = useOpenPanel();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    op.track(event, eventProperties);
    onClick?.(e);
  };

  return <Link {...props} onClick={handleClick} />;
}
