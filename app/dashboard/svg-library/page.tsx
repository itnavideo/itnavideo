import React from 'react';
import { SvgAssetPicker } from '../../../components/ui/svg-library/SvgAssetPicker';

export const dynamic = 'force-dynamic';

export default function SvgLibraryPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="max-w-6xl mx-auto h-[800px]">
        <h1 className="text-3xl font-bold mb-2">Animated SVG Library</h1>
        <p className="text-zinc-400 mb-8">Browse and preview Remotion-ready animated vector graphics for videos.</p>
        <SvgAssetPicker />
      </div>
    </div>
  );
}
