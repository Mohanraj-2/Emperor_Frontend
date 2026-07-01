'use client';
import { Crown } from 'lucide-react';

interface Props {
  size?: number;
  label?: string;
  className?: string;
}

export default function InlineLoader({
  size = 24,
  label,
  className = '',
}: Props) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill="none"
            stroke="#E8ECF4"
            strokeWidth="2"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill="none"
            stroke="#0B1F4D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${size * 1.5} ${size * 3}`}
            style={{ animation: 'e-spin 1.2s linear infinite' }}
          />
        </svg>
        <Crown
          className="text-pink-500"
          style={{ width: size * 0.4, height: size * 0.4 }}
        />
      </div>
      {label && (
        <span className="font-poppins text-xs text-navy-800 font-medium">
          {label}
        </span>
      )}
    </div>
  );
}
