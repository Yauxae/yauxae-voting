export default function LeopardBadge({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="20" cy="20" r="19" className="fill-gold-500/90" />
      <g className="fill-leopard-spot">
        <ellipse cx="13" cy="12" rx="3.4" ry="2.6" transform="rotate(-18 13 12)" />
        <ellipse cx="24" cy="10" rx="2.8" ry="2.2" transform="rotate(12 24 10)" />
        <ellipse cx="29" cy="18" rx="3" ry="2.4" transform="rotate(-8 29 18)" />
        <ellipse cx="10" cy="22" rx="2.6" ry="2.1" transform="rotate(20 10 22)" />
        <ellipse cx="18" cy="27" rx="3.2" ry="2.5" transform="rotate(-14 18 27)" />
        <ellipse cx="27" cy="29" rx="2.6" ry="2.1" transform="rotate(6 27 29)" />
        <ellipse cx="20" cy="19" rx="2.4" ry="1.9" transform="rotate(30 20 19)" />
      </g>
    </svg>
  );
}
