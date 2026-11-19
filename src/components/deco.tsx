/** Little decorations: hearts, sparkles and a heart padlock. Purely visual (aria-hidden). */

export function Heart({ className = "", color = "currentColor", size = 24, style }: { className?: string; color?: string; size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 21.2S2.5 15.3 2.5 8.6A5 5 0 0 1 12 6a5 5 0 0 1 9.5 2.6c0 6.7-9.5 12.6-9.5 12.6Z" fill={color} />
      <ellipse cx="7.6" cy="8.6" rx="1.8" ry="1.1" fill="#fff" opacity=".55" transform="rotate(-35 7.6 8.6)" />
    </svg>
  );
}

export function Sparkle({ className = "", color = "currentColor", size = 18, style }: { className?: string; color?: string; size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 1.5c.8 5.6 3.4 9.4 10.5 10.5C15.4 13.1 12.8 16.9 12 22.5 11.2 16.9 8.6 13.1 1.5 12 8.6 10.9 11.2 7.1 12 1.5Z" fill={color} />
    </svg>
  );
}

/** Heart-shaped padlock, the site mark. */
export function LockMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M22 28v-8a10 10 0 0 1 20 0v8" fill="none" stroke="var(--color-cocoa)" strokeWidth="5" strokeLinecap="round" />
      <path d="M32 58S9 44.5 9 30.2C9 24 13.6 19.6 19.4 19.6c5.5 0 9.6 3.3 12.6 7.6 3-4.3 7.1-7.6 12.6-7.6C50.4 19.6 55 24 55 30.2 55 44.5 32 58 32 58Z" fill="var(--color-cherry)" />
      <ellipse cx="20" cy="29" rx="4" ry="2.4" fill="#fff" opacity=".45" transform="rotate(-35 20 29)" />
      <circle cx="32" cy="35" r="3.6" fill="var(--color-milk)" />
      <rect x="30.4" y="36.5" width="3.2" height="8" rx="1.6" fill="var(--color-milk)" />
    </svg>
  );
}

/** Floating hearts and sparkles scattered over a section. */
export function Confetti({ dense = false }: { dense?: boolean }) {
  const items: [string, string, number, string, number, "h" | "s"][] = [
    ["6%", "18%", 22, "var(--color-bubble)", 0, "h"],
    ["88%", "12%", 18, "var(--color-cherry)", 1.2, "h"],
    ["14%", "78%", 16, "#f5b301", 0.6, "s"],
    ["93%", "70%", 20, "var(--color-bubble)", 2, "s"],
    ["48%", "6%", 14, "#9b7bff", 1.6, "s"],
    ["75%", "88%", 18, "var(--color-straw-2)", 0.9, "h"],
  ];
  const list = dense ? items : items.slice(0, 4);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {list.map(([left, top, size, color, delay, kind], i) => (
        <span key={i} className="absolute animate-floaty" style={{ left, top, animationDelay: `${delay}s`, ["--r" as string]: `${(i % 3) * 8 - 8}deg` }}>
          {kind === "h" ? <Heart size={size} color={color} /> : <Sparkle size={size} color={color} className="animate-twinkle" style={{ animationDelay: `${delay}s` }} />}
        </span>
      ))}
    </div>
  );
}
