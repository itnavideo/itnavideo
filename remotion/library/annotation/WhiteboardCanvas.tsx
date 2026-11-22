import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WhiteboardCanvasProps {
  className?: string;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          DRY-ERASE WHITEBOARD
        </span>
        <span className="text-white/40">MARKER CANVAS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-100 rounded-xl border-4 border-zinc-700 p-5 flex flex-col justify-between text-zinc-900 shadow-inner">
        <div className="text-xs font-bold text-blue-700">SYSTEM ARCHITECTURE MAP</div>
        <div className="text-center font-bold text-lg text-zinc-800">Next.js ➔ Remotion Cloud</div>
        <div className="flex space-x-2 justify-end">
          <span className="w-6 h-2 bg-blue-600 rounded" />
          <span className="w-6 h-2 bg-red-600 rounded" />
          <span className="w-6 h-2 bg-black rounded" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>TEXTURE: GLOSS CERAMIC</span>
        <span>ERASER TRAY: MOUNTED</span>
      </div>
    </div>
  );
};
