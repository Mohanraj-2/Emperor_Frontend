'use client';
import { Crown } from 'lucide-react';

interface Props {
  size?: number;
  showBag?: boolean;
  showRing?: boolean;
  showLabel?: boolean;
  showDots?: boolean;
}

export default function EmpireSpinner({
  size = 120,
  showBag = true,
  showRing = true,
  showLabel = true,
  showDots = true,
}: Props) {
  const ringSize = size;
  const center = ringSize / 2;
  const radius = ringSize / 2 - 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        {/* Circular luxury progress ring */}
        {showRing && (
          <svg
            className="absolute inset-0 -rotate-90"
            width={ringSize}
            height={ringSize}
            viewBox={`0 0 ${ringSize} ${ringSize}`}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#E8ECF4"
              strokeWidth="3"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#0B1F4D"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{
                animation: 'ring-progress 2s ease-in-out infinite',
              }}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#F7B6C6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.25} ${circumference}`}
              style={{
                animation: 'ring-progress 2s ease-in-out infinite',
                animationDelay: '0.3s',
              }}
            />
          </svg>
        )}

        {/* Animated "E" logo spinner */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: 'e-spin 1.4s linear infinite' }}
        >
          <div
            className="rounded-full bg-navy-800 flex items-center justify-center shadow-lg"
            style={{
              width: ringSize * 0.5,
              height: ringSize * 0.5,
              animation: 'e-pulse 1.6s ease-in-out infinite',
            }}
          >
            <span
              className="font-playfair font-bold text-pink-400 leading-none"
              style={{ fontSize: ringSize * 0.22 }}
            >
              E
            </span>
          </div>
        </div>

        {/* Shopping bag animation */}
        {showBag && (
          <div
            className="absolute -bottom-1 -right-1 bg-pink-400 rounded-full flex items-center justify-center shadow-md"
            style={{
              width: ringSize * 0.26,
              height: ringSize * 0.26,
              animation: 'bag-bounce 1.4s ease-in-out infinite',
            }}
          >
            <Crown
              className="text-navy-800"
              style={{ width: ringSize * 0.12, height: ringSize * 0.12 }}
            />
          </div>
        )}
      </div>

      {/* Brand label */}
      {showLabel && (
        <div className="text-center">
          <div className="font-playfair font-bold text-navy-800 text-lg tracking-wide leading-none">
            EMPIRE
          </div>
          <div className="font-poppins text-[9px] text-pink-500 tracking-[0.2em] uppercase leading-none mt-0.5">
            — LIFESTYLE —
          </div>
        </div>
      )}

      {/* Bouncing dots */}
      {showDots && (
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-navy-800"
              style={{
                animation: 'dot-bounce 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
