import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SpatialGISDatabaseCardProps {
  engineName?: string;
  srid?: number;
  spatialIndexType?: string;
  geometryTypes?: string[];
  className?: string;
}

export const SpatialGISDatabaseCard: React.FC<SpatialGISDatabaseCardProps> = ({
  engineName = "PostgreSQL + PostGIS 3.4",
  srid = 4326,
  spatialIndexType = "GIST (Generalized Search Tree / R-Tree)",
  geometryTypes = ["Point", "Polygon", "MultiPolygon", "LineString"],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            SPATIAL GIS GEODATABASE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          SRID: {srid} (WGS 84)
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Spatial Query Example</div>
        <code className="text-emerald-400">SELECT * FROM zones WHERE ST_Contains(geom, ST_MakePoint(lon, lat));</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Spatial Indexing</div>
          <div className="text-white font-bold text-xs mt-0.5">{spatialIndexType}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Geometries Supported</div>
          <div className="text-emerald-400 font-bold text-xs mt-0.5">Points, Polygons, 3D Mesh</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Engine: {engineName}</span>
        <span className="text-emerald-400 font-bold">Sub-10ms Geofence Lookups</span>
      </div>
    </div>
  );
};
