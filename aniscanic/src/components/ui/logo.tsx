import React from "react";
import { cn } from "@/lib/utils";

type LogoVariant = "full" | "stacked" | "icon" | "wordmark";
type LogoSize = "sm" | "md" | "lg";
/** "color" = red + gold mark, "mono" = single-colour mark */
type LogoColorMode = "color" | "mono";
/** The background the logo sits on - drives wordmark and mono colours */
type LogoSurface = "dark" | "light";

const BRAND = {
  red: "#FF4655",
  gold: "#FFD369",
  ink: "#1F1F1F",
  cream: "#F5F5F5",
} as const;

const sizeMap = {
  sm: { icon: 24, text: "text-lg", gap: "gap-1.5", stackGap: "gap-2" },
  md: { icon: 36, text: "text-2xl", gap: "gap-2.5", stackGap: "gap-3" },
  lg: { icon: 56, text: "text-4xl", gap: "gap-3.5", stackGap: "gap-4" },
} as const;

// ─── Panel A mark ───────────────────────────────────────────────────────────
// An "A" drawn with manga panel gutters (negative space) on a rounded tile.
// The gold counter panel is the spotlight; the crossbar rises to the right.
// Below 24px a heavier "favicon cut" keeps the gutters legible.

export function LogoMark({
  size = 36,
  colorMode = "color",
  surface = "dark",
  title,
  className,
}: {
  size?: number;
  colorMode?: LogoColorMode;
  surface?: LogoSurface;
  /** Accessible name; omit when the mark sits next to a visible wordmark */
  title?: string;
  className?: string;
}) {
  const maskId = `panel-a-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const gutter = size < 24 ? 13 : 9;
  const radius = size < 24 ? 22 : 24;

  const monoFill = surface === "dark" ? BRAND.cream : BRAND.ink;
  const tileFill = colorMode === "mono" ? monoFill : BRAND.red;
  const spotlightFill = colorMode === "mono" ? monoFill : BRAND.gold;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="white" />
          <g stroke="black" strokeWidth={gutter} strokeLinecap="round">
            <line x1="51.92" y1="-6" x2="16.08" y2="106" />
            <line x1="48.08" y1="-6" x2="83.92" y2="106" />
            <line x1="28.88" y1="66" x2="68.56" y2="58" />
          </g>
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect width="100" height="100" rx={radius} fill={tileFill} />
        <polygon points="50,0 28.88,66 68.56,58" fill={spotlightFill} />
      </g>
    </svg>
  );
}

// ─── Wordmark ───────────────────────────────────────────────────────────────

function Wordmark({ surface, textClass }: { surface: LogoSurface; textClass: string }) {
  return (
    <span
      className={cn(
        textClass,
        "font-display font-bold lowercase leading-none tracking-[-0.03em]",
        surface === "dark" ? "text-brand-light" : "text-brand-dark"
      )}
    >
      aniscanic
    </span>
  );
}

// ─── Main Logo Component ────────────────────────────────────────────────────

interface AniscanicLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  colorMode?: LogoColorMode;
  surface?: LogoSurface;
  className?: string;
}

export function AniscanicLogo({
  variant = "full",
  size = "md",
  colorMode = "color",
  surface = "dark",
  className,
}: AniscanicLogoProps) {
  const { icon: iconSize, text: textClass, gap, stackGap } = sizeMap[size];

  if (variant === "icon") {
    return (
      <LogoMark
        size={iconSize}
        colorMode={colorMode}
        surface={surface}
        title="Aniscanic"
        className={className}
      />
    );
  }

  const stacked = variant === "stacked";

  return (
    <span
      className={cn(
        "inline-flex items-center",
        stacked ? cn("flex-col", stackGap) : gap,
        className
      )}
    >
      {variant !== "wordmark" && (
        <LogoMark
          size={stacked ? iconSize * 2 : iconSize}
          colorMode={colorMode}
          surface={surface}
        />
      )}
      <Wordmark surface={surface} textClass={textClass} />
    </span>
  );
}

// ─── Showcase: brand reference for every lockup and colour mode ─────────────

export function LogoShowcase() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-3xl bg-brand-dark p-10">
          <AniscanicLogo variant="full" size="lg" surface="dark" />
        </div>
        <div className="flex items-center justify-center rounded-3xl bg-brand-light p-10">
          <AniscanicLogo variant="full" size="lg" surface="light" />
        </div>
        <div className="flex items-center justify-center rounded-3xl bg-brand-dark p-10">
          <AniscanicLogo variant="full" size="lg" colorMode="mono" surface="dark" />
        </div>
        <div className="flex items-center justify-center rounded-3xl bg-brand-light p-10">
          <AniscanicLogo variant="full" size="lg" colorMode="mono" surface="light" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex items-center justify-center rounded-3xl bg-brand-dark p-10">
          <AniscanicLogo variant="stacked" size="lg" surface="dark" />
        </div>
        <div className="flex items-center justify-center rounded-3xl bg-brand-red p-10">
          <AniscanicLogo variant="full" size="md" colorMode="mono" surface="dark" />
        </div>
        <div className="flex items-end justify-center gap-6 rounded-3xl bg-brand-dark p-10">
          <LogoMark size={96} title="Aniscanic" />
          <LogoMark size={48} />
          <LogoMark size={32} />
          <LogoMark size={20} />
          <LogoMark size={16} />
        </div>
      </div>
    </div>
  );
}
