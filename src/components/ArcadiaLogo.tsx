export default function ArcadiaLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Arcadia Games Logo"
    >
      <defs>
        <linearGradient id="arcadiaHexGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="arcadiaBoltGrad" x1="16" y1="10" x2="48" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      {/* Outer Cyber Hexagon Shield */}
      <path
        d="M32 3L57 17.5V46.5L32 61L7 46.5V17.5L32 3Z"
        fill="url(#arcadiaHexGrad)"
        stroke="#22D3EE"
        strokeWidth="2.5"
      />
      {/* Inner Dark Core */}
      <path
        d="M32 9L51.5 20.3V43.7L32 55L12.5 43.7V20.3L32 9Z"
        fill="#090B14"
      />
      {/* Stylized 'A' + Gamepad + Lightning Bolt */}
      <path
        d="M32 14L17 46H24.5L28 38H36L39.5 46H47L32 14ZM29.8 32L32 26.5L34.2 32H29.8Z"
        fill="#FFFFFF"
      />
      {/* Cyber Thunder Accent */}
      <path
        d="M35 12L23 31H32L29 50L43 29H33.5L35 12Z"
        fill="url(#arcadiaBoltGrad)"
      />
    </svg>
  );
}
