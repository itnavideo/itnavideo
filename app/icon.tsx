import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
          borderRadius: 8,
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M8 5.5v13l11-6.5L8 5.5z" fill="#0B1120" stroke="#0B1120" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
