import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#050506',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            background: 'linear-gradient(135deg, #5eead4 0%, #38bdf8 52%, #fbbf24 100%)',
            borderRadius: 8,
            display: 'flex',
            height: 30,
            justifyContent: 'center',
            width: 30,
          }}
        >
          <svg width="25" height="25" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="11" width="32" height="26" rx="7" fill="rgba(2,6,23,0.9)" />
            <path d="M19 18.5v11l10-5.5-10-5.5Z" fill="white" />
            <path d="M10 25h4m20 0h4" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M14 19v10M34 19v10" stroke="#5eead4" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M6 22v4M42 22v4" stroke="#fbbf24" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    ),
    size
  );
}

