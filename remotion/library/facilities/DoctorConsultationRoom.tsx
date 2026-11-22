import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DoctorConsultationRoomProps {
  physicianName?: string;
  specialty?: string;
  roomNumber?: string;
  className?: string;
}

export const DoctorConsultationRoom: React.FC<DoctorConsultationRoomProps> = ({
  physicianName = 'Dr. Julian Sterling, MD',
  specialty = 'Internal Medicine & Cardiology',
  roomNumber = 'Exam Suite 204',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          OUTPATIENT CONSULTATION
        </span>
        <span className="text-white/40">{roomNumber}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="text-sm font-bold text-white">{physicianName}</div>
          <div className="text-xs text-teal-300/80 font-mono">{specialty}</div>
        </div>

        <div className="space-y-2 my-2 bg-zinc-950 p-3 rounded-lg border border-white/5 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">Examination Couch:</span>
            <span className="text-emerald-400 font-mono">Sanitized & Prepped</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Diagnostic Tools:</span>
            <span className="text-white">Otoscope, Dermatoscope, ECG</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Digital Charting (EHR):</span>
            <span className="text-teal-400 font-mono">Epic Systems Synced</span>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>SCHEDULE: 15-MIN APPOINTMENTS</span>
          <span className="text-emerald-400 font-mono">STATUS: IN SESSION</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>HIPAA COMPLIANT ENVIRONMENT</span>
        <span>TELEHEALTH RIG: READY</span>
      </div>
    </div>
  );
};
