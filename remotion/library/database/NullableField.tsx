import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NullableFieldProps {
  fieldName?: string;
  isNullable?: boolean;
  defaultValue?: string;
  className?: string;
}

export const NullableField: React.FC<NullableFieldProps> = ({
  fieldName = 'watermark_color',
  isNullable = true,
  defaultValue = 'NULL (Inherits Brand Color)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-slate-700 text-white font-bold border border-white/20">
          NULLABILITY SPECIFIER
        </span>
        <span className="text-white/40">FIELD OPTIONALITY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-white">{fieldName}</span>
          <span className={"px-2.5 py-1 rounded text-xs font-bold border " +
            (isNullable ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-red-950 text-red-300 border-red-600')}>
            {isNullable ? 'NULLABLE' : 'NOT NULL'}
          </span>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          <div className="text-[10px] text-white/40 mb-1">DEFAULT VALUE:</div>
          <div className="text-white font-bold">{defaultValue}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TRI-STATE LOGIC (TRUE, FALSE, NULL)</span>
        <span>POSTGRES SPEC</span>
      </div>
    </div>
  );
};
