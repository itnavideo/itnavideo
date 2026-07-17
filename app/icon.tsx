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
          background: '#0B1120',
          borderRadius: 8,
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
          <rect x="11" y="11" width="20" height="20" rx="6" fill="#22D3EE" opacity={0.3} />
          <rect x="17" y="17" width="20" height="20" rx="6" fill="#22D3EE" />
          <polygon points="23,20 23,34 34,27" fill="#0B1120" />
        </svg>
      </div>
    ),
    size
  );
}

