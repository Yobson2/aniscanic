import React from "react";
import { cn } from "@/lib/utils";

type LogoVariant = "full" | "icon" | "wordmark";
type LogoSize = "sm" | "md" | "lg";
type LogoColorMode = "gradient" | "white" | "dark";

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  colorMode?: LogoColorMode;
  className?: string;
}

const sizeMap = {
  sm: { icon: 24, text: "text-lg", gap: "gap-1.5" },
  md: { icon: 36, text: "text-2xl", gap: "gap-2" },
  lg: { icon: 56, text: "text-4xl", gap: "gap-3" },
} as const;

// ─── Concept 1: Flame Eye ───────────────────────────────────────────────────

function FlameEyeIcon({
  size,
  colorMode,
}: {
  size: number;
  colorMode: LogoColorMode;
}) {
  const id = React.useId();
  const gradId = `eye-grad-${id}`;
  const monoFill =
    colorMode === "white" ? "#F5F5F5" : colorMode === "dark" ? "#1F1F1F" : undefined;
  const pupilFill = colorMode === "white" ? "#1F1F1F" : colorMode === "dark" ? "#F5F5F5" : "#1F1F1F";
  const strokeColor = colorMode === "white" ? "#F5F5F5" : colorMode === "dark" ? "#1F1F1F" : "#F5F5F5";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!monoFill && (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4655" />
            <stop offset="100%" stopColor="#FFD369" />
          </linearGradient>
        </defs>
      )}
      {/* Eye outline */}
      <path
        d="M4,20 Q20,6 36,20 Q20,34 4,20 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Iris */}
      <circle
        cx="20"
        cy="20"
        r="8"
        fill={monoFill ?? `url(#${gradId})`}
      />
      {/* Pupil */}
      <circle cx="20" cy="20" r="3.5" fill={pupilFill} />
      {/* Highlight */}
      <circle cx="22.5" cy="17.5" r="1.5" fill="#FFFFFF" opacity="0.85" />
      {/* Spark lines (only at larger sizes) */}
      {size >= 32 && (
        <>
          <line
            x1="30"
            y1="10"
            x2="34"
            y2="6"
            stroke={monoFill ?? "#FFD369"}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="33"
            y1="14"
            x2="37"
            y2="12"
            stroke={monoFill ?? "#FFD369"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

// ─── Concept 2: Shuriken A (Recommended) ────────────────────────────────────

function ShurikenAIcon({
  size,
  colorMode,
}: {
  size: number;
  colorMode: LogoColorMode;
}) {
  const id = React.useId();
  const gradId = `shuriken-grad-${id}`;
  const maskId = `shuriken-mask-${id}`;
  const monoFill =
    colorMode === "white" ? "#F5F5F5" : colorMode === "dark" ? "#1F1F1F" : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {!monoFill && (
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4655" />
            <stop offset="100%" stopColor="#FFD369" />
          </linearGradient>
        )}
        <mask id={maskId}>
          {/* White = visible, black = cut out */}
          <rect width="40" height="40" fill="white" />
          {/* "A" cutout: diamond shape */}
          <path
            d="M20,13 L25,21 L20,28 L15,21 Z"
            fill="black"
          />
          {/* "A" crossbar */}
          <rect x="16.5" y="22" width="7" height="2" rx="0.5" fill="white" />
        </mask>
      </defs>
      <g transform="rotate(12, 20, 20)">
        {/* Four-pointed star with concave edges */}
        <path
          d="M20,2 Q26,14 38,20 Q26,26 20,38 Q14,26 2,20 Q14,14 20,2 Z"
          fill={monoFill ?? `url(#${gradId})`}
          mask={`url(#${maskId})`}
        />
      </g>
    </svg>
  );
}

// ─── Concept 3: Rising Frame ────────────────────────────────────────────────

function RisingFrameIcon({
  size,
  colorMode,
}: {
  size: number;
  colorMode: LogoColorMode;
}) {
  const id = React.useId();
  const gradId = `frame-grad-${id}`;
  const monoFill =
    colorMode === "white" ? "#F5F5F5" : colorMode === "dark" ? "#1F1F1F" : undefined;
  const strokeColor = monoFill ?? "#FF4655";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!monoFill && (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4655" />
            <stop offset="100%" stopColor="#FFD369" />
          </linearGradient>
        </defs>
      )}
      <g transform="rotate(-2, 20, 20)">
        {/* Manga panel frame */}
        <rect
          x="6"
          y="3"
          width="28"
          height="34"
          rx="4"
          ry="4"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
        />
        {/* Play triangle */}
        <path
          d="M16,13 L28,20 L16,27 Z"
          fill={monoFill ?? `url(#${gradId})`}
          strokeLinejoin="round"
        />
        {/* Diagonal speed line */}
        {size >= 32 && (
          <line
            x1="10"
            y1="7"
            x2="30"
            y2="33"
            stroke={monoFill ?? "#FFD369"}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
        )}
      </g>
    </svg>
  );
}

// ─── Wordmark ───────────────────────────────────────────────────────────────

function Wordmark({
  colorMode,
  textClass,
  concept,
}: {
  colorMode: LogoColorMode;
  textClass: string;
  concept?: "eye" | "shuriken" | "frame";
}) {
  if (colorMode === "white") {
    return (
      <span className={cn(textClass, "font-extrabold tracking-wider text-[#F5F5F5]")}>
        ANISCANIC
      </span>
    );
  }
  if (colorMode === "dark") {
    return (
      <span className={cn(textClass, "font-extrabold tracking-wider text-[#1F1F1F]")}>
        ANISCANIC
      </span>
    );
  }

  // Gradient wordmark
  if (concept === "shuriken") {
    return (
      <span className={cn(textClass, "font-extrabold tracking-wider")}>
        <span className="text-[#FF4655]">A</span>
        <span className="bg-gradient-to-r from-[#FF4655] to-[#FFD369] bg-clip-text text-transparent">
          NISCANIC
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        textClass,
        "font-extrabold tracking-wider bg-gradient-to-r from-[#FF4655] to-[#FFD369] bg-clip-text text-transparent"
      )}
    >
      ANISCANIC
    </span>
  );
}

// ─── Icon map per concept ───────────────────────────────────────────────────

const iconComponents = {
  eye: FlameEyeIcon,
  shuriken: ShurikenAIcon,
  frame: RisingFrameIcon,
} as const;

type LogoConcept = keyof typeof iconComponents;

// ─── Main Logo Component ────────────────────────────────────────────────────

interface AniscanicLogoProps extends LogoProps {
  concept?: LogoConcept;
}

export function AniscanicLogo({
  variant = "full",
  size = "md",
  colorMode = "gradient",
  concept = "shuriken",
  className,
}: AniscanicLogoProps) {
  const { icon: iconSize, text: textClass, gap } = sizeMap[size];
  const IconComponent = iconComponents[concept];

  return (
    <span className={cn("inline-flex items-center", gap, className)}>
      {variant !== "wordmark" && (
        <IconComponent size={iconSize} colorMode={colorMode} />
      )}
      {variant !== "icon" && (
        <Wordmark colorMode={colorMode} textClass={textClass} concept={concept} />
      )}
    </span>
  );
}

// ─── Showcase: renders all 3 concepts side by side (for comparison) ─────────

export function LogoShowcase() {
  return (
    <div className="flex flex-col gap-12 p-8">
      {(["eye", "shuriken", "frame"] as const).map((concept) => (
        <div key={concept} className="flex flex-col gap-6">
          <h3 className="text-white text-lg font-semibold capitalize">
            Concept: {concept === "eye" ? "Flame Eye" : concept === "shuriken" ? "Shuriken A" : "Rising Frame"}
          </h3>

          {/* Full color on dark */}
          <div className="flex items-center gap-8 bg-[#1F1F1F] p-6 rounded-2xl">
            <AniscanicLogo concept={concept} variant="full" size="lg" colorMode="gradient" />
            <AniscanicLogo concept={concept} variant="icon" size="lg" colorMode="gradient" />
            <AniscanicLogo concept={concept} variant="icon" size="md" colorMode="gradient" />
            <AniscanicLogo concept={concept} variant="icon" size="sm" colorMode="gradient" />
          </div>

          {/* Monochrome white on dark */}
          <div className="flex items-center gap-8 bg-[#1F1F1F] p-6 rounded-2xl">
            <AniscanicLogo concept={concept} variant="full" size="lg" colorMode="white" />
          </div>

          {/* Full color on light */}
          <div className="flex items-center gap-8 bg-white p-6 rounded-2xl">
            <AniscanicLogo concept={concept} variant="full" size="lg" colorMode="gradient" />
          </div>

          {/* Monochrome dark on light */}
          <div className="flex items-center gap-8 bg-white p-6 rounded-2xl">
            <AniscanicLogo concept={concept} variant="full" size="lg" colorMode="dark" />
          </div>
        </div>
      ))}
    </div>
  );
}
