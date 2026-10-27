import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/assets/database-svgs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to create cylinder (database)
function cylinder(cx, cy, rx, ry, h, fillTop, fillBody, stroke) {
  return `
    <path d="M ${cx - rx} ${cy} v ${h} a ${rx} ${ry} 0 0 0 ${rx * 2} 0 v -${h} Z" fill="${fillBody}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round" />
    <ellipse cx="${cx}" cy="${cy + h}" rx="${rx}" ry="${ry}" fill="${fillBody}" stroke="${stroke}" stroke-width="2.5" />
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fillTop}" stroke="${stroke}" stroke-width="2.5" />
  `;
}

// 110 Database SVG definitions
const databaseSvgCatalog = {
  // 1. Core Architecture & Storage Engine (20)
  oracle_database_cylinder: {
    category: 'architecture',
    title: 'Oracle Database Cylinder',
    tags: ['database', 'cylinder', 'oracle', 'storage', 'data'],
    svg: `
      <defs>
        <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EA580C" />
          <stop offset="100%" stop-color="#C2410C" />
        </linearGradient>
      </defs>
      ${cylinder(60, 25, 42, 14, 22, '#FB923C', 'url(#dbGrad)', '#7C2D12')}
      ${cylinder(60, 52, 42, 14, 22, '#FB923C', 'url(#dbGrad)', '#7C2D12')}
      ${cylinder(60, 78, 42, 14, 22, '#FB923C', 'url(#dbGrad)', '#7C2D12')}
      <path d="M 40 45 h 40 M 40 72 h 40 M 40 98 h 40" stroke="#FFE4D6" stroke-width="2" stroke-linecap="round" />
      <circle cx="85" cy="45" r="3" fill="#22C55E" />
      <circle cx="85" cy="72" r="3" fill="#22C55E" />
      <circle cx="85" cy="98" r="3" fill="#22C55E" />
    `,
  },
  oracle_instance: {
    category: 'architecture',
    title: 'Oracle Instance (SGA + Background Processes)',
    tags: ['oracle', 'instance', 'sga', 'memory', 'processes'],
    svg: `
      <rect x="12" y="16" width="96" height="88" rx="14" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="6 4" />
      <rect x="22" y="26" width="76" height="34" rx="8" fill="#1E293B" stroke="#0284C7" stroke-width="2" />
      <text x="60" y="48" fill="#38BDF8" font-size="12" font-family="sans-serif" font-weight="900" text-anchor="middle">SGA MEMORY</text>
      <circle cx="34" cy="80" r="12" fill="#F97316" stroke="#C2410C" stroke-width="2" />
      <text x="34" y="84" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">PMON</text>
      <circle cx="60" cy="80" r="12" fill="#F97316" stroke="#C2410C" stroke-width="2" />
      <text x="60" y="84" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">SMON</text>
      <circle cx="86" cy="80" r="12" fill="#F97316" stroke="#C2410C" stroke-width="2" />
      <text x="86" y="84" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">DBWn</text>
    `,
  },
  sga_system_global_area: {
    category: 'architecture',
    title: 'System Global Area (SGA)',
    tags: ['sga', 'system global area', 'ram', 'shared memory'],
    svg: `
      <rect x="10" y="18" width="100" height="84" rx="12" fill="#1E1B4B" stroke="#6366F1" stroke-width="2.5" />
      <text x="60" y="36" fill="#A5B4FC" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">SGA (SHARED RAM)</text>
      <rect x="18" y="44" width="38" height="22" rx="6" fill="#312E81" stroke="#818CF8" stroke-width="1.5" />
      <text x="37" y="58" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">Buffer Cache</text>
      <rect x="64" y="44" width="38" height="22" rx="6" fill="#312E81" stroke="#818CF8" stroke-width="1.5" />
      <text x="83" y="58" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">Shared Pool</text>
      <rect x="18" y="72" width="38" height="20" rx="6" fill="#312E81" stroke="#818CF8" stroke-width="1.5" />
      <text x="37" y="85" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">Redo Buffer</text>
      <rect x="64" y="72" width="38" height="20" rx="6" fill="#312E81" stroke="#818CF8" stroke-width="1.5" />
      <text x="83" y="85" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">Large Pool</text>
    `,
  },
  pga_program_global_area: {
    category: 'architecture',
    title: 'Program Global Area (PGA)',
    tags: ['pga', 'program global area', 'private memory', 'session'],
    svg: `
      <rect x="15" y="20" width="90" height="80" rx="14" fill="#064E3B" stroke="#10B981" stroke-width="2.5" />
      <text x="60" y="40" fill="#6EE7B7" font-size="12" font-family="sans-serif" font-weight="900" text-anchor="middle">PGA (PRIVATE RAM)</text>
      <rect x="25" y="48" width="70" height="18" rx="6" fill="#047857" stroke="#34D399" stroke-width="1.5" />
      <text x="60" y="61" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Sort Work Area</text>
      <rect x="25" y="72" width="70" height="18" rx="6" fill="#047857" stroke="#34D399" stroke-width="1.5" />
      <text x="60" y="85" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Session Memory</text>
    `,
  },
  database_buffer_cache: {
    category: 'architecture',
    title: 'Database Buffer Cache',
    tags: ['buffer cache', 'blocks', 'dirty buffer', 'lru'],
    svg: `
      <rect x="12" y="16" width="96" height="88" rx="10" fill="#1E293B" stroke="#0284C7" stroke-width="2.5" />
      <text x="60" y="32" fill="#38BDF8" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">BUFFER CACHE (LRU)</text>
      <g transform="translate(18, 40)">
        <rect x="0" y="0" width="24" height="24" rx="4" fill="#0369A1" stroke="#38BDF8" stroke-width="1.5" />
        <rect x="30" y="0" width="24" height="24" rx="4" fill="#EF4444" stroke="#F87171" stroke-width="1.5" />
        <rect x="60" y="0" width="24" height="24" rx="4" fill="#0369A1" stroke="#38BDF8" stroke-width="1.5" />
        <rect x="0" y="30" width="24" height="24" rx="4" fill="#0369A1" stroke="#38BDF8" stroke-width="1.5" />
        <rect x="30" y="30" width="24" height="24" rx="4" fill="#0369A1" stroke="#38BDF8" stroke-width="1.5" />
        <rect x="60" y="30" width="24" height="24" rx="4" fill="#EF4444" stroke="#F87171" stroke-width="1.5" />
        <text x="42" y="16" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Dirty</text>
        <text x="72" y="46" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Dirty</text>
      </g>
    `,
  },
  shared_pool: {
    category: 'architecture',
    title: 'Shared Pool (Library Cache + Data Dictionary)',
    tags: ['shared pool', 'library cache', 'dictionary cache', 'sql parse'],
    svg: `
      <rect x="12" y="16" width="96" height="88" rx="10" fill="#312E81" stroke="#818CF8" stroke-width="2.5" />
      <text x="60" y="34" fill="#C7D2FE" font-size="10" font-family="sans-serif" font-weight="900" text-anchor="middle">SHARED POOL</text>
      <rect x="20" y="42" width="80" height="26" rx="6" fill="#4338CA" stroke="#A5B4FC" stroke-width="1.5" />
      <text x="60" y="58" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Library Cache (Parsed SQL)</text>
      <rect x="20" y="72" width="80" height="24" rx="6" fill="#4338CA" stroke="#A5B4FC" stroke-width="1.5" />
      <text x="60" y="88" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Data Dictionary Cache</text>
    `,
  },
  redo_log_buffer: {
    category: 'architecture',
    title: 'Redo Log Buffer',
    tags: ['redo', 'log buffer', 'lgwr', 'transaction logs'],
    svg: `
      <rect x="12" y="22" width="96" height="76" rx="12" fill="#7F1D1D" stroke="#EF4444" stroke-width="2.5" />
      <text x="60" y="42" fill="#FCA5A5" font-size="9.5" font-family="sans-serif" font-weight="900" text-anchor="middle">REDO LOG BUFFER</text>
      <path d="M 22 56 h 76" stroke="#F87171" stroke-width="2" stroke-dasharray="4 3" />
      <rect x="24" y="64" width="16" height="20" rx="3" fill="#DC2626" />
      <rect x="44" y="64" width="16" height="20" rx="3" fill="#DC2626" />
      <rect x="64" y="64" width="16" height="20" rx="3" fill="#DC2626" />
      <path d="M 86 74 l 8 -4 v 8 Z" fill="#FBBF24" />
    `,
  },
  large_pool: {
    category: 'architecture',
    title: 'Large Pool',
    tags: ['large pool', 'rman', 'parallel execution', 'shared server'],
    svg: `
      <rect x="14" y="20" width="92" height="80" rx="12" fill="#14532D" stroke="#22C55E" stroke-width="2.5" />
      <text x="60" y="42" fill="#86EFAC" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">LARGE POOL</text>
      <rect x="22" y="52" width="76" height="18" rx="4" fill="#15803D" />
      <text x="60" y="65" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">RMAN Backup Buffers</text>
      <rect x="22" y="74" width="76" height="18" rx="4" fill="#15803D" />
      <text x="60" y="87" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Parallel Query Slaves</text>
    `,
  },
  java_pool: {
    category: 'architecture',
    title: 'Java Pool',
    tags: ['java pool', 'jvm', 'stored procedures'],
    svg: `
      <rect x="16" y="20" width="88" height="80" rx="12" fill="#701A75" stroke="#E879F9" stroke-width="2.5" />
      <text x="60" y="44" fill="#F5D0FE" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">JAVA POOL</text>
      <path d="M 45 65 c 4 -8 15 -8 20 0 c -8 4 -12 8 -20 0" fill="none" stroke="#F43F5E" stroke-width="2.5" />
      <path d="M 48 78 c 4 -6 12 -6 16 0" fill="none" stroke="#F59E0B" stroke-width="2" />
      <text x="60" y="90" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">JVM Code & Heap</text>
    `,
  },
  datafile_dbf: {
    category: 'architecture',
    title: 'Datafile (.dbf)',
    tags: ['datafile', 'dbf', 'tablespace', 'disk storage'],
    svg: `
      <rect x="24" y="16" width="72" height="88" rx="8" fill="#1E293B" stroke="#94A3B8" stroke-width="2.5" />
      <rect x="32" y="26" width="56" height="14" rx="4" fill="#0284C7" />
      <text x="60" y="36" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">USERS01.DBF</text>
      <line x1="32" y1="50" x2="88" y2="50" stroke="#475569" stroke-width="2" />
      <line x1="32" y1="62" x2="88" y2="62" stroke="#475569" stroke-width="2" />
      <line x1="32" y1="74" x2="88" y2="74" stroke="#475569" stroke-width="2" />
      <line x1="32" y1="86" x2="70" y2="86" stroke="#475569" stroke-width="2" />
      <circle cx="82" cy="86" r="4" fill="#F97316" />
    `,
  },
  control_file_ctl: {
    category: 'architecture',
    title: 'Control File (.ctl)',
    tags: ['control file', 'ctl', 'scn', 'metadata', 'checkpoint'],
    svg: `
      <polygon points="60,14 100,34 100,86 60,106 20,86 20,34" fill="#0F172A" stroke="#EAB308" stroke-width="2.5" />
      <circle cx="60" cy="55" r="18" fill="#CA8A04" stroke="#FEF08A" stroke-width="2" />
      <text x="60" y="58" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">CTL</text>
      <text x="60" y="86" fill="#FDE047" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">DB METADATA</text>
      <text x="60" y="96" fill="#94A3B8" font-size="6.5" font-family="sans-serif" text-anchor="middle">SCN &amp; CHECKPOINT</text>
    `,
  },
  redo_log_file: {
    category: 'architecture',
    title: 'Online Redo Log File',
    tags: ['redo log', 'online redo log', 'wal', 'transactions'],
    svg: `
      <circle cx="60" cy="60" r="44" fill="#7F1D1D" stroke="#EF4444" stroke-width="3" />
      <circle cx="60" cy="60" r="32" fill="#991B1B" stroke="#F87171" stroke-width="1.5" stroke-dasharray="4 3" />
      <circle cx="60" cy="60" r="16" fill="#DC2626" />
      <polygon points="56,52 68,60 56,68" fill="#FEF08A" />
      <text x="60" y="96" fill="#FECACA" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">ONLINE REDO</text>
    `,
  },
  archive_log_file: {
    category: 'architecture',
    title: 'Archive Log File',
    tags: ['archive log', 'archivelog', 'backup', 'point in time'],
    svg: `
      <rect x="22" y="18" width="76" height="84" rx="8" fill="#1C1917" stroke="#F59E0B" stroke-width="2.5" />
      <path d="M 32 30 h 40 M 32 42 h 56 M 32 54 h 56 M 32 66 h 36" stroke="#D97706" stroke-width="2" stroke-linecap="round" />
      <rect x="68" y="60" width="22" height="28" rx="4" fill="#B45309" stroke="#FDE68A" stroke-width="1.5" />
      <path d="M 79 66 v 10 M 74 71 l 5 5 l 5 -5" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
      <text x="50" y="92" fill="#FDE68A" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">ARCHIVELOG</text>
    `,
  },
  spfile_pfile_config: {
    category: 'architecture',
    title: 'SPFILE & PFILE Config',
    tags: ['spfile', 'pfile', 'init.ora', 'parameters', 'config'],
    svg: `
      <rect x="20" y="16" width="80" height="88" rx="10" fill="#0F172A" stroke="#06B6D4" stroke-width="2.5" />
      <rect x="28" y="24" width="64" height="18" rx="4" fill="#0891B2" />
      <text x="60" y="37" fill="#FFFFFF" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">SPFILE.ORA</text>
      <circle cx="36" cy="56" r="4" fill="#06B6D4" />
      <text x="46" y="59" fill="#E2E8F0" font-size="7" font-family="sans-serif">sga_target=16G</text>
      <circle cx="36" cy="72" r="4" fill="#06B6D4" />
      <text x="46" y="75" fill="#E2E8F0" font-size="7" font-family="sans-serif">pga_target=4G</text>
      <circle cx="36" cy="88" r="4" fill="#06B6D4" />
      <text x="46" y="91" fill="#E2E8F0" font-size="7" font-family="sans-serif">processes=500</text>
    `,
  },
  password_file: {
    category: 'architecture',
    title: 'Database Password File (orapw)',
    tags: ['password file', 'orapw', 'sysdba', 'auth'],
    svg: `
      <rect x="24" y="22" width="72" height="76" rx="10" fill="#3B0764" stroke="#C084FC" stroke-width="2.5" />
      <circle cx="60" cy="48" r="14" fill="#9333EA" stroke="#F3E8FF" stroke-width="2" />
      <circle cx="60" cy="46" r="5" fill="#FFFFFF" />
      <path d="M 60 51 v 8" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <rect x="36" y="72" width="48" height="14" rx="4" fill="#581C87" />
      <text x="60" y="82" fill="#E9D5FF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">SYSDBA AUTH</text>
    `,
  },
  tablespace_storage: {
    category: 'architecture',
    title: 'Tablespace Storage Container',
    tags: ['tablespace', 'storage', 'datafiles', 'extents'],
    svg: `
      <rect x="14" y="16" width="92" height="88" rx="12" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5" />
      <text x="60" y="32" fill="#7DD3FC" font-size="10" font-family="sans-serif" font-weight="900" text-anchor="middle">TABLESPACE</text>
      <rect x="22" y="40" width="76" height="24" rx="6" fill="#0369A1" stroke="#38BDF8" stroke-width="1.5" />
      <text x="60" y="55" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">datafile_1.dbf (10GB)</text>
      <rect x="22" y="70" width="76" height="24" rx="6" fill="#0369A1" stroke="#38BDF8" stroke-width="1.5" />
      <text x="60" y="85" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">datafile_2.dbf (10GB)</text>
    `,
  },
  segment_extent_block_hierarchy: {
    category: 'architecture',
    title: 'Segment Extent Block Hierarchy',
    tags: ['segment', 'extent', 'block', 'hierarchy', 'storage'],
    svg: `
      <rect x="10" y="14" width="100" height="92" rx="10" fill="#18181B" stroke="#A1A1AA" stroke-width="2" />
      <text x="60" y="28" fill="#F4F4F5" font-size="8.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">SEGMENT (Table / Index)</text>
      <rect x="16" y="34" width="88" height="34" rx="6" fill="#27272A" stroke="#E4E4E7" stroke-width="1.5" />
      <text x="60" y="46" fill="#FACC15" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">EXTENT (Contiguous Blocks)</text>
      <g transform="translate(20, 52)">
        <rect x="0" y="0" width="16" height="12" fill="#3F3F46" stroke="#FFFFFF" stroke-width="1" />
        <rect x="20" y="0" width="16" height="12" fill="#3F3F46" stroke="#FFFFFF" stroke-width="1" />
        <rect x="40" y="0" width="16" height="12" fill="#3F3F46" stroke="#FFFFFF" stroke-width="1" />
        <rect x="60" y="0" width="16" height="12" fill="#3F3F46" stroke="#FFFFFF" stroke-width="1" />
      </g>
      <text x="60" y="86" fill="#A1A1AA" font-size="7" font-family="sans-serif" text-anchor="middle">ORACLE DATA BLOCKS (8KB)</text>
      <path d="M 60 88 v 12" stroke="#A1A1AA" stroke-width="1.5" />
    `,
  },
  btree_index_structure: {
    category: 'architecture',
    title: 'B-Tree Index Structure',
    tags: ['btree', 'index', 'root', 'branch', 'leaf', 'scan'],
    svg: `
      <rect x="46" y="14" width="28" height="18" rx="4" fill="#4338CA" stroke="#A5B4FC" stroke-width="2" />
      <text x="60" y="26" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">ROOT</text>
      <path d="M 50 32 L 32 46 M 70 32 L 88 46" stroke="#818CF8" stroke-width="2" />
      <rect x="18" y="46" width="28" height="18" rx="4" fill="#3730A3" stroke="#A5B4FC" stroke-width="1.5" />
      <text x="32" y="58" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" text-anchor="middle">BRANCH</text>
      <rect x="74" y="46" width="28" height="18" rx="4" fill="#3730A3" stroke="#A5B4FC" stroke-width="1.5" />
      <text x="88" y="58" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" text-anchor="middle">BRANCH</text>
      <path d="M 24 64 L 16 78 M 40 64 L 46 78 M 80 64 L 74 78 M 96 64 L 104 78" stroke="#818CF8" stroke-width="1.5" />
      <rect x="8" y="78" width="20" height="24" rx="3" fill="#1E1B4B" stroke="#818CF8" stroke-width="1" />
      <rect x="36" y="78" width="20" height="24" rx="3" fill="#1E1B4B" stroke="#818CF8" stroke-width="1" />
      <rect x="64" y="78" width="20" height="24" rx="3" fill="#1E1B4B" stroke="#818CF8" stroke-width="1" />
      <rect x="92" y="78" width="20" height="24" rx="3" fill="#1E1B4B" stroke="#818CF8" stroke-width="1" />
      <text x="60" y="112" fill="#C7D2FE" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">LEAF BLOCKS + ROWIDs</text>
    `,
  },
  rowid_pointer: {
    category: 'architecture',
    title: 'ROWID Pointer to Physical Block',
    tags: ['rowid', 'pointer', 'physical address', 'fast lookup'],
    svg: `
      <rect x="14" y="24" width="92" height="28" rx="6" fill="#0F172A" stroke="#F59E0B" stroke-width="2" />
      <text x="60" y="42" fill="#FDE68A" font-size="8.5" font-family="monospace" font-weight="bold" text-anchor="middle">AAASVJAABAAAN12AAA</text>
      <path d="M 60 52 v 22 l -6 -6 M 60 74 l 6 -6" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
      <rect x="22" y="78" width="76" height="26" rx="6" fill="#1E293B" stroke="#38BDF8" stroke-width="2" />
      <text x="60" y="94" fill="#38BDF8" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Block #54, Row #12</text>
    `,
  },
  data_block_structure: {
    category: 'architecture',
    title: 'Data Block Internal Structure',
    tags: ['data block', 'header', 'pctfree', 'row data', 'pctused'],
    svg: `
      <rect x="20" y="12" width="80" height="96" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="2" />
      <rect x="22" y="14" width="76" height="18" fill="#334155" />
      <text x="60" y="26" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">Block Header</text>
      <rect x="22" y="34" width="76" height="14" fill="#475569" />
      <text x="60" y="44" fill="#CBD5E1" font-size="7" font-family="sans-serif" text-anchor="middle">Table Directory</text>
      <rect x="22" y="50" width="76" height="24" fill="#0284C7" />
      <text x="60" y="64" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">Free Space (PCTFREE)</text>
      <rect x="22" y="76" width="76" height="30" fill="#047857" />
      <text x="60" y="94" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Row Data (Rows)</text>
    `,
  },

  // 2. Background Processes (10)
  dbwn_database_writer: {
    category: 'processes',
    title: 'DBWn (Database Writer)',
    tags: ['dbwn', 'database writer', 'dirty buffer', 'flush'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#EA580C" stroke="#7C2D12" stroke-width="3" />
      <path d="M 50 46 h 20 M 60 36 v 20" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 60 74 v 22 l -6 -6 M 60 96 l 6 -6" fill="none" stroke="#EA580C" stroke-width="3" stroke-linecap="round" />
      <rect x="24" y="98" width="72" height="14" rx="4" fill="#1E293B" stroke="#94A3B8" stroke-width="1.5" />
      <text x="60" y="108" fill="#F97316" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">DBWn -> DATAFILES</text>
      <text x="60" y="30" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">DBWn</text>
    `,
  },
  lgwr_log_writer: {
    category: 'processes',
    title: 'LGWR (Log Writer)',
    tags: ['lgwr', 'log writer', 'redo', 'commit'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#DC2626" stroke="#7F1D1D" stroke-width="3" />
      <path d="M 52 38 l 18 8 l -18 8 Z" fill="#FFFFFF" />
      <text x="60" y="32" fill="#FFFFFF" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">LGWR</text>
      <path d="M 60 74 v 20 l -5 -5 M 60 94 l 5 -5" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" />
      <rect x="20" y="96" width="80" height="14" rx="4" fill="#450A0A" stroke="#EF4444" stroke-width="1.5" />
      <text x="60" y="106" fill="#FCA5A5" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">COMMIT -> REDO LOGS</text>
    `,
  },
  ckpt_checkpoint_process: {
    category: 'processes',
    title: 'CKPT (Checkpoint Process)',
    tags: ['ckpt', 'checkpoint', 'sync', 'scn', 'headers'],
    svg: `
      <circle cx="60" cy="50" r="30" fill="#D97706" stroke="#78350F" stroke-width="3" />
      <path d="M 46 50 l 10 10 l 18 -18" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="32" fill="#FEF3C7" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">CKPT</text>
      <text x="60" y="98" fill="#FBBF24" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">SCN SYNC IN HEADERS</text>
    `,
  },
  smon_system_monitor: {
    category: 'processes',
    title: 'SMON (System Monitor)',
    tags: ['smon', 'system monitor', 'crash recovery', 'temp extents'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#0284C7" stroke="#075985" stroke-width="3" />
      <circle cx="60" cy="46" r="14" fill="none" stroke="#BAE6FD" stroke-width="2.5" />
      <circle cx="60" cy="46" r="5" fill="#FFFFFF" />
      <text x="60" y="30" fill="#E0F2FE" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">SMON</text>
      <rect x="18" y="86" width="84" height="20" rx="6" fill="#0F172A" stroke="#0284C7" stroke-width="1.5" />
      <text x="60" y="100" fill="#7DD3FC" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">CRASH RECOVERY</text>
    `,
  },
  pmon_process_monitor: {
    category: 'processes',
    title: 'PMON (Process Monitor)',
    tags: ['pmon', 'process monitor', 'cleanup', 'failed user'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#7C3AED" stroke="#4C1D95" stroke-width="3" />
      <path d="M 48 40 l 24 16 M 72 40 l -24 16" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
      <text x="60" y="30" fill="#EDE9FE" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">PMON</text>
      <rect x="16" y="86" width="88" height="20" rx="6" fill="#2E1065" stroke="#A78BFA" stroke-width="1.5" />
      <text x="60" y="100" fill="#DDD6FE" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">CLEANUP FAILED SESSIONS</text>
    `,
  },
  arcn_archiver_process: {
    category: 'processes',
    title: 'ARCn (Archiver Process)',
    tags: ['arcn', 'archiver', 'archive redo', 'safety'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#D97706" stroke="#78350F" stroke-width="3" />
      <rect x="44" y="34" width="32" height="24" rx="4" fill="#FEF3C7" stroke="#92400E" stroke-width="2" />
      <line x1="50" y1="42" x2="70" y2="42" stroke="#92400E" stroke-width="2" />
      <line x1="50" y1="48" x2="66" y2="48" stroke="#92400E" stroke-width="2" />
      <text x="60" y="30" fill="#FEF3C7" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">ARCn</text>
      <text x="60" y="98" fill="#F59E0B" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">COPIES TO ARCHIVELOG</text>
    `,
  },
  mmon_manageability_monitor: {
    category: 'processes',
    title: 'MMON (Manageability Monitor - AWR)',
    tags: ['mmon', 'manageability', 'awr', 'metrics'],
    svg: `
      <circle cx="60" cy="48" r="28" fill="#0D9488" stroke="#115E59" stroke-width="3" />
      <path d="M 44 56 l 10 -12 l 8 6 l 12 -16" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="32" fill="#CCFBF1" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">MMON</text>
      <text x="60" y="98" fill="#2DD4BF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">AWR SNAPSHOT ENGINE</text>
    `,
  },
  mmnl_manageability_monitor_light: {
    category: 'processes',
    title: 'MMNL (Manageability Monitor Light - ASH)',
    tags: ['mmnl', 'ash', 'active session history', 'flush'],
    svg: `
      <circle cx="60" cy="48" r="26" fill="#047857" stroke="#064E3B" stroke-width="2.5" />
      <circle cx="60" cy="48" r="12" fill="#34D399" />
      <text x="60" y="32" fill="#D1FAE5" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">MMNL</text>
      <text x="60" y="98" fill="#34D399" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">ASH BUFFER FLUSH</text>
    `,
  },
  reco_recoverer_process: {
    category: 'processes',
    title: 'RECO (Distributed Recoverer)',
    tags: ['reco', 'recoverer', '2pc', 'two phase commit'],
    svg: `
      <circle cx="60" cy="48" r="28" fill="#BE123C" stroke="#881337" stroke-width="3" />
      <path d="M 44 48 a 16 16 0 1 1 32 0 a 16 16 0 0 1 -32 0" fill="none" stroke="#FDA4AF" stroke-width="3" stroke-dasharray="6 3" />
      <polygon points="76,46 76,56 86,51" fill="#FFFFFF" />
      <text x="60" y="32" fill="#FFE4E6" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">RECO</text>
      <text x="60" y="98" fill="#FB7185" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">RESOLVES 2-PHASE COMMIT</text>
    `,
  },
  lreg_listener_registration: {
    category: 'processes',
    title: 'LREG (Listener Registration)',
    tags: ['lreg', 'listener', 'service registration', 'tns'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#0284C7" stroke="#0369A1" stroke-width="3" />
      <path d="M 46 46 a 14 14 0 0 1 28 0" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <path d="M 40 40 a 22 22 0 0 1 40 0" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <circle cx="60" cy="54" r="4" fill="#FACC15" />
      <text x="60" y="28" fill="#E0F2FE" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">LREG</text>
      <text x="60" y="98" fill="#38BDF8" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">REGISTERS TO TNS LISTENER</text>
    `,
  },

  // 3. High Availability (RAC & ASM) (14)
  oracle_rac_cluster_nodes: {
    category: 'rac',
    title: 'Oracle RAC Cluster Nodes',
    tags: ['rac', 'real application clusters', 'nodes', 'high availability'],
    svg: `
      <rect x="12" y="18" width="42" height="42" rx="8" fill="#1E293B" stroke="#F97316" stroke-width="2.5" />
      <text x="33" y="42" fill="#F97316" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">NODE 1</text>
      <rect x="66" y="18" width="42" height="42" rx="8" fill="#1E293B" stroke="#F97316" stroke-width="2.5" />
      <text x="87" y="42" fill="#F97316" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">NODE 2</text>
      <path d="M 54 39 h 12" stroke="#22C55E" stroke-width="3" stroke-dasharray="3 2" />
      ${cylinder(60, 72, 36, 12, 18, '#FDBA74', '#EA580C', '#7C2D12')}
      <text x="60" y="112" fill="#FED7AA" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">SHARED STORAGE</text>
    `,
  },
  shared_storage_san_nas: {
    category: 'rac',
    title: 'Shared SAN/NAS Storage',
    tags: ['san', 'nas', 'shared storage', 'fiber channel'],
    svg: `
      <rect x="16" y="24" width="88" height="68" rx="8" fill="#0F172A" stroke="#0284C7" stroke-width="2.5" />
      <line x1="28" y1="40" x2="92" y2="40" stroke="#38BDF8" stroke-width="2" />
      <line x1="28" y1="58" x2="92" y2="58" stroke="#38BDF8" stroke-width="2" />
      <line x1="28" y1="76" x2="92" y2="76" stroke="#38BDF8" stroke-width="2" />
      <circle cx="24" cy="40" r="3" fill="#22C55E" />
      <circle cx="24" cy="58" r="3" fill="#22C55E" />
      <circle cx="24" cy="76" r="3" fill="#22C55E" />
      <text x="60" y="106" fill="#38BDF8" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">SAN FIBRE CHANNEL</text>
    `,
  },
  private_interconnect_network: {
    category: 'rac',
    title: 'Private Interconnect Network',
    tags: ['interconnect', 'private network', 'udp', 'rdma', 'cache fusion'],
    svg: `
      <circle cx="32" cy="40" r="16" fill="#1E293B" stroke="#F97316" stroke-width="2" />
      <text x="32" y="44" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">N1</text>
      <circle cx="88" cy="40" r="16" fill="#1E293B" stroke="#F97316" stroke-width="2" />
      <text x="88" y="44" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">N2</text>
      <path d="M 48 40 C 60 26 60 54 72 40" fill="none" stroke="#22C55E" stroke-width="3" stroke-linecap="round" />
      <rect x="22" y="76" width="76" height="24" rx="6" fill="#14532D" stroke="#4ADE80" stroke-width="1.5" />
      <text x="60" y="91" fill="#DCFCE7" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">10GbE / InfiniBand</text>
    `,
  },
  virtual_ip_vip: {
    category: 'rac',
    title: 'Virtual IP (VIP)',
    tags: ['vip', 'virtual ip', 'failover', 'rac'],
    svg: `
      <rect x="20" y="24" width="80" height="42" rx="10" fill="#047857" stroke="#34D399" stroke-width="2.5" />
      <text x="60" y="44" fill="#A7F3D0" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">VIRTUAL IP (VIP)</text>
      <text x="60" y="56" fill="#FFFFFF" font-size="7.5" font-family="monospace" text-anchor="middle">192.168.1.101</text>
      <path d="M 60 66 v 22 l -6 -6 M 60 88 l 6 -6" fill="none" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" />
      <text x="60" y="104" fill="#6EE7B7" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">INSTANT FAILOVER</text>
    `,
  },
  scan_single_client_access_name: {
    category: 'rac',
    title: 'SCAN (Single Client Access Name)',
    tags: ['scan', 'single client access name', 'dns', 'listener'],
    svg: `
      <circle cx="60" cy="38" r="22" fill="#1D4ED8" stroke="#93C5FD" stroke-width="2.5" />
      <text x="60" y="42" fill="#FFFFFF" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">SCAN</text>
      <path d="M 44 54 l -18 24 M 60 60 v 18 M 76 54 l 18 24" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" />
      <circle cx="26" cy="84" r="8" fill="#1E293B" stroke="#93C5FD" stroke-width="1.5" />
      <circle cx="60" cy="84" r="8" fill="#1E293B" stroke="#93C5FD" stroke-width="1.5" />
      <circle cx="94" cy="84" r="8" fill="#1E293B" stroke="#93C5FD" stroke-width="1.5" />
      <text x="60" y="108" fill="#93C5FD" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">3 SCAN VIP LISTENERS</text>
    `,
  },
  ocr_oracle_cluster_registry: {
    category: 'rac',
    title: 'OCR (Oracle Cluster Registry)',
    tags: ['ocr', 'cluster registry', 'clusterware', 'crs'],
    svg: `
      <polygon points="60,16 98,36 98,84 60,104 22,84 22,36" fill="#1E1B4B" stroke="#818CF8" stroke-width="2.5" />
      <text x="60" y="52" fill="#FFFFFF" font-size="12" font-family="sans-serif" font-weight="900" text-anchor="middle">OCR</text>
      <text x="60" y="66" fill="#C7D2FE" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">CLUSTER CONFIG</text>
      <circle cx="60" cy="78" r="4" fill="#38BDF8" />
    `,
  },
  voting_disk_quorum: {
    category: 'rac',
    title: 'Voting Disk (Cluster Quorum)',
    tags: ['voting disk', 'quorum', 'cssd', 'heartbeat'],
    svg: `
      <circle cx="60" cy="60" r="42" fill="#0F172A" stroke="#EAB308" stroke-width="3" />
      <circle cx="60" cy="60" r="14" fill="#EAB308" />
      <text x="60" y="64" fill="#78350F" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">CSSD</text>
      <text x="60" y="32" fill="#FEF08A" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">VOTING DISK</text>
      <text x="60" y="92" fill="#CBD5E1" font-size="7" font-family="sans-serif" text-anchor="middle">QUORUM ARBITER</text>
    `,
  },
  split_brain_scenario: {
    category: 'rac',
    title: 'Split-Brain Scenario Protection',
    tags: ['split brain', 'eviction', 'fence', 'node eviction'],
    svg: `
      <rect x="14" y="24" width="38" height="46" rx="8" fill="#1E293B" stroke="#EF4444" stroke-width="2" />
      <text x="33" y="48" fill="#F87171" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Node 1</text>
      <rect x="68" y="24" width="38" height="46" rx="8" fill="#1E293B" stroke="#EF4444" stroke-width="2" />
      <text x="87" y="48" fill="#F87171" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Node 2</text>
      <path d="M 52 32 L 68 58 M 68 32 L 52 58" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" />
      <text x="60" y="94" fill="#EF4444" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">FENCE / NODE EVICT</text>
    `,
  },
  clusterware_crs_engine: {
    category: 'rac',
    title: 'Clusterware (Grid Infrastructure Engine)',
    tags: ['clusterware', 'grid infrastructure', 'crs', 'engine'],
    svg: `
      <rect x="16" y="20" width="88" height="80" rx="14" fill="#111827" stroke="#F59E0B" stroke-width="2.5" />
      <circle cx="60" cy="52" r="18" fill="none" stroke="#F59E0B" stroke-width="3" stroke-dasharray="8 4" />
      <circle cx="60" cy="52" r="8" fill="#F59E0B" />
      <text x="60" y="34" fill="#FDE68A" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">GRID INFRASTRUCTURE</text>
      <text x="60" y="88" fill="#E2E8F0" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">CRS / CSS / EVM</text>
    `,
  },
  asm_automatic_storage_management: {
    category: 'rac',
    title: 'ASM (Automatic Storage Management)',
    tags: ['asm', 'storage management', 'raw disk', 'volume manager'],
    svg: `
      <rect x="14" y="16" width="92" height="88" rx="12" fill="#042F2E" stroke="#14B8A6" stroke-width="2.5" />
      <text x="60" y="34" fill="#5EEAD4" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">ORACLE ASM</text>
      <rect x="22" y="44" width="76" height="16" rx="4" fill="#0D9488" />
      <text x="60" y="55" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">+DATA DISKGROUP</text>
      <rect x="22" y="66" width="76" height="16" rx="4" fill="#0D9488" />
      <text x="60" y="77" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">+RECO DISKGROUP</text>
      <text x="60" y="96" fill="#99F6E4" font-size="7" font-family="sans-serif" text-anchor="middle">Striping &amp; Mirroring</text>
    `,
  },
  asm_disk_group: {
    category: 'rac',
    title: 'ASM Disk Group',
    tags: ['asm diskgroup', 'allocation units', 'disks'],
    svg: `
      <g transform="translate(10, 20)">
        <rect x="0" y="0" width="28" height="64" rx="4" fill="#1E293B" stroke="#06B6D4" stroke-width="1.5" />
        <rect x="34" y="0" width="28" height="64" rx="4" fill="#1E293B" stroke="#06B6D4" stroke-width="1.5" />
        <rect x="68" y="0" width="28" height="64" rx="4" fill="#1E293B" stroke="#06B6D4" stroke-width="1.5" />
        <line x1="0" y1="80" x2="96" y2="80" stroke="#0891B2" stroke-width="2" />
        <text x="48" y="92" fill="#67E8F9" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">+DATA (3 Disks)</text>
      </g>
    `,
  },
  asm_mirroring_redundancy: {
    category: 'rac',
    title: 'ASM Redundancy Mirroring',
    tags: ['asm mirroring', 'normal redundancy', 'high redundancy'],
    svg: `
      <rect x="18" y="20" width="38" height="56" rx="6" fill="#1E293B" stroke="#10B981" stroke-width="2" />
      <text x="37" y="44" fill="#6EE7B7" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Primary</text>
      <text x="37" y="56" fill="#FFFFFF" font-size="7" font-family="sans-serif" text-anchor="middle">AU #1</text>
      <rect x="64" y="20" width="38" height="56" rx="6" fill="#1E293B" stroke="#10B981" stroke-width="2" />
      <text x="83" y="44" fill="#6EE7B7" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">Mirror</text>
      <text x="83" y="56" fill="#FFFFFF" font-size="7" font-family="sans-serif" text-anchor="middle">AU #1</text>
      <path d="M 44 84 h 32" stroke="#10B981" stroke-width="2" stroke-dasharray="3 2" />
      <text x="60" y="100" fill="#34D399" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">NORMAL REDUNDANCY</text>
    `,
  },
  asm_rebalance_operation: {
    category: 'rac',
    title: 'ASM Rebalance Operation',
    tags: ['asm rebalance', 'power limit', 'allocation units'],
    svg: `
      <circle cx="60" cy="50" r="32" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2.5" />
      <path d="M 45 42 a 18 18 0 0 1 30 0" fill="none" stroke="#FACC15" stroke-width="3" stroke-linecap="round" />
      <polygon points="76,40 76,48 84,42" fill="#FACC15" />
      <path d="M 75 58 a 18 18 0 0 1 -30 0" fill="none" stroke="#FACC15" stroke-width="3" stroke-linecap="round" />
      <polygon points="44,60 44,52 36,58" fill="#FACC15" />
      <text x="60" y="100" fill="#7DD3FC" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">REBALANCE (POWER 8)</text>
    `,
  },
  rac_cache_fusion: {
    category: 'rac',
    title: 'RAC Cache Fusion',
    tags: ['cache fusion', 'interconnect', 'block transfer', 'rac'],
    svg: `
      <circle cx="34" cy="46" r="22" fill="#1E293B" stroke="#F97316" stroke-width="2.5" />
      <text x="34" y="49" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">SGA 1</text>
      <circle cx="86" cy="46" r="22" fill="#1E293B" stroke="#F97316" stroke-width="2.5" />
      <text x="86" y="49" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">SGA 2</text>
      <path d="M 50 40 h 20 l -4 -4 M 70 40 l -4 4" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" />
      <path d="M 70 52 h -20 l 4 -4 M 50 52 l 4 4" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" />
      <text x="60" y="92" fill="#FDBA74" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">CACHE FUSION</text>
      <text x="60" y="104" fill="#94A3B8" font-size="6.5" font-family="sans-serif" text-anchor="middle">Direct RAM Block Transfer</text>
    `,
  },

  // 4. Disaster Recovery (Data Guard) (12)
  primary_database_node: {
    category: 'dataguard',
    title: 'Data Guard Primary Database',
    tags: ['primary database', 'data guard', 'production', 'read write'],
    svg: `
      ${cylinder(60, 26, 40, 14, 30, '#15803D', '#166534', '#052E16')}
      <circle cx="82" cy="44" r="6" fill="#22C55E" />
      <text x="60" y="80" fill="#FFFFFF" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">PRIMARY</text>
      <text x="60" y="94" fill="#86EFAC" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">READ / WRITE</text>
    `,
  },
  physical_standby_database: {
    category: 'dataguard',
    title: 'Physical Standby Database (Redo Apply)',
    tags: ['standby', 'physical standby', 'data guard', 'mrp'],
    svg: `
      ${cylinder(60, 26, 40, 14, 30, '#0369A1', '#075985', '#082F49')}
      <circle cx="82" cy="44" r="6" fill="#38BDF8" />
      <text x="60" y="80" fill="#FFFFFF" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">PHYSICAL STANDBY</text>
      <text x="60" y="94" fill="#7DD3FC" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">REDO APPLY (MRP)</text>
    `,
  },
  logical_standby_database: {
    category: 'dataguard',
    title: 'Logical Standby Database (SQL Apply)',
    tags: ['logical standby', 'sql apply', 'lsp', 'data guard'],
    svg: `
      ${cylinder(60, 26, 40, 14, 30, '#6D28D9', '#5B21B6', '#2E1065')}
      <circle cx="82" cy="44" r="6" fill="#C084FC" />
      <text x="60" y="80" fill="#FFFFFF" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">LOGICAL STANDBY</text>
      <text x="60" y="94" fill="#DDD6FE" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">SQL APPLY (LSP)</text>
    `,
  },
  redo_transport_service: {
    category: 'dataguard',
    title: 'Redo Transport Service (SYNC/ASYNC)',
    tags: ['redo transport', 'sync', 'async', 'data guard network'],
    svg: `
      <rect x="14" y="32" width="30" height="40" rx="6" fill="#166534" stroke="#22C55E" stroke-width="2" />
      <text x="29" y="56" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">PRI</text>
      <path d="M 48 52 h 24 l -4 -4 M 72 52 l -4 4" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" />
      <rect x="76" y="32" width="30" height="40" rx="6" fill="#075985" stroke="#38BDF8" stroke-width="2" />
      <text x="91" y="56" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">SBY</text>
      <text x="60" y="94" fill="#FDE68A" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">REDO TRANSPORT</text>
      <text x="60" y="106" fill="#94A3B8" font-size="6.5" font-family="sans-serif" text-anchor="middle">SYNC / ASYNC Network</text>
    `,
  },
  mrp_managed_recovery_process: {
    category: 'dataguard',
    title: 'MRP (Managed Recovery Process)',
    tags: ['mrp', 'managed recovery process', 'apply redo', 'standby'],
    svg: `
      <circle cx="60" cy="48" r="28" fill="#0284C7" stroke="#0369A1" stroke-width="3" />
      <path d="M 44 48 l 10 10 l 20 -18" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="32" fill="#E0F2FE" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">MRP0</text>
      <text x="60" y="98" fill="#38BDF8" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">REDO APPLY ENGINE</text>
    `,
  },
  data_guard_switchover: {
    category: 'dataguard',
    title: 'Data Guard Planned Switchover',
    tags: ['switchover', 'data guard', 'zero data loss', 'planned role reversal'],
    svg: `
      <circle cx="34" cy="46" r="20" fill="#166534" stroke="#4ADE80" stroke-width="2" />
      <text x="34" y="49" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">PRI</text>
      <circle cx="86" cy="46" r="20" fill="#075985" stroke="#38BDF8" stroke-width="2" />
      <text x="86" y="49" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">SBY</text>
      <path d="M 44 26 C 60 16 60 16 76 26" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" />
      <path d="M 76 66 C 60 76 60 76 44 66" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
      <text x="60" y="94" fill="#4ADE80" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">PLANNED SWITCHOVER</text>
      <text x="60" y="106" fill="#CBD5E1" font-size="6.5" font-family="sans-serif" text-anchor="middle">Zero Data Loss Role Reversal</text>
    `,
  },
  data_guard_failover: {
    category: 'dataguard',
    title: 'Data Guard Unplanned Failover',
    tags: ['failover', 'disaster', 'standby promotion', 'emergency'],
    svg: `
      <circle cx="34" cy="46" r="20" fill="#7F1D1D" stroke="#EF4444" stroke-width="2" />
      <path d="M 26 38 l 16 16 M 42 38 l -16 16" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <circle cx="86" cy="46" r="20" fill="#166534" stroke="#22C55E" stroke-width="2.5" />
      <text x="86" y="49" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">NEW PRI</text>
      <path d="M 58 46 h 14 l -4 -4 M 72 46 l -4 4" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" />
      <text x="60" y="94" fill="#EF4444" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">EMERGENCY FAILOVER</text>
      <text x="60" y="106" fill="#FCA5A5" font-size="6.5" font-family="sans-serif" text-anchor="middle">Standby Promoted to Primary</text>
    `,
  },
  data_guard_broker: {
    category: 'dataguard',
    title: 'Data Guard Broker (DGMGRL)',
    tags: ['dgmgrl', 'broker', 'data guard broker', 'configuration'],
    svg: `
      <rect x="18" y="22" width="84" height="64" rx="10" fill="#0F172A" stroke="#818CF8" stroke-width="2.5" />
      <circle cx="60" cy="46" r="14" fill="#312E81" stroke="#A5B4FC" stroke-width="2" />
      <text x="60" y="50" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">DMON</text>
      <text x="60" y="74" fill="#C7D2FE" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">DGMGRL CLI</text>
      <text x="60" y="104" fill="#818CF8" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">AUTOMATED BROKER</text>
    `,
  },
  fast_start_failover_fsfo_observer: {
    category: 'dataguard',
    title: 'Fast-Start Failover (FSFO) Observer',
    tags: ['fsfo', 'fast start failover', 'observer', 'automatic failover'],
    svg: `
      <circle cx="60" cy="38" r="22" fill="#D97706" stroke="#FDE68A" stroke-width="2.5" />
      <circle cx="60" cy="38" r="8" fill="#78350F" />
      <text x="60" y="24" fill="#FEF3C7" font-size="6.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">OBSERVER</text>
      <path d="M 42 54 l -16 22 M 78 54 l 16 22" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" />
      <rect x="12" y="78" width="30" height="20" rx="4" fill="#166534" />
      <text x="27" y="91" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" text-anchor="middle">PRI</text>
      <rect x="78" y="78" width="30" height="20" rx="4" fill="#075985" />
      <text x="93" y="91" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" text-anchor="middle">SBY</text>
      <text x="60" y="112" fill="#FBBF24" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">FAST-START FAILOVER</text>
    `,
  },
  maximum_protection_shield: {
    category: 'dataguard',
    title: 'Maximum Protection Shield',
    tags: ['maximum protection', 'shield', 'zero data loss', 'sync'],
    svg: `
      <polygon points="60,16 96,30 96,68 60,104 24,68 24,30" fill="#1E3A8A" stroke="#3B82F6" stroke-width="3" />
      <path d="M 46 54 l 10 10 l 20 -20" fill="none" stroke="#60A5FA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="86" fill="#BFDBFE" font-size="7" font-family="sans-serif" font-weight="900" text-anchor="middle">MAX PROTECTION</text>
      <text x="60" y="96" fill="#93C5FD" font-size="6" font-family="sans-serif" text-anchor="middle">SYNC + AFFIRM</text>
    `,
  },
  maximum_availability_shield: {
    category: 'dataguard',
    title: 'Maximum Availability Shield',
    tags: ['maximum availability', 'shield', 'zero data loss fallback'],
    svg: `
      <polygon points="60,16 96,30 96,68 60,104 24,68 24,30" fill="#065F46" stroke="#10B981" stroke-width="3" />
      <circle cx="60" cy="54" r="14" fill="#047857" stroke="#6EE7B7" stroke-width="2" />
      <text x="60" y="58" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">99.999</text>
      <text x="60" y="86" fill="#A7F3D0" font-size="7" font-family="sans-serif" font-weight="900" text-anchor="middle">MAX AVAILABILITY</text>
      <text x="60" y="96" fill="#6EE7B7" font-size="6" font-family="sans-serif" text-anchor="middle">SYNC with Resilient Fallback</text>
    `,
  },
  maximum_performance_mode: {
    category: 'dataguard',
    title: 'Maximum Performance Mode',
    tags: ['maximum performance', 'speed', 'async', 'data guard'],
    svg: `
      <circle cx="60" cy="50" r="34" fill="#7C2D12" stroke="#F97316" stroke-width="3" />
      <path d="M 44 56 l 16 -24 l 6 12 l 14 -16" fill="none" stroke="#FDBA74" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="96" fill="#FB923C" font-size="7.5" font-family="sans-serif" font-weight="900" text-anchor="middle">MAX PERFORMANCE</text>
      <text x="60" y="106" fill="#FED7AA" font-size="6.5" font-family="sans-serif" text-anchor="middle">ASYNC Transport (Default)</text>
    `,
  },

  // 5. Data Replication (Oracle GoldenGate - OGG) (8)
  goldengate_pipeline_architecture: {
    category: 'goldengate',
    title: 'GoldenGate Architecture Pipeline',
    tags: ['goldengate', 'ogg', 'replication', 'cdc', 'trail files'],
    svg: `
      <rect x="8" y="32" width="22" height="36" rx="4" fill="#0F172A" stroke="#F97316" stroke-width="1.5" />
      <text x="19" y="52" fill="#FFFFFF" font-size="6" font-family="sans-serif" text-anchor="middle">EXTRACT</text>
      <path d="M 30 50 h 12" stroke="#F97316" stroke-width="2" />
      <rect x="42" y="36" width="16" height="28" rx="3" fill="#C2410C" />
      <text x="50" y="52" fill="#FFFFFF" font-size="6" font-family="sans-serif" text-anchor="middle">TRAIL</text>
      <path d="M 58 50 h 12" stroke="#F97316" stroke-width="2" />
      <rect x="70" y="32" width="22" height="36" rx="4" fill="#0F172A" stroke="#F97316" stroke-width="1.5" />
      <text x="81" y="52" fill="#FFFFFF" font-size="6" font-family="sans-serif" text-anchor="middle">REPLICAT</text>
      <path d="M 92 50 h 14" stroke="#F97316" stroke-width="2" />
      <circle cx="110" cy="50" r="4" fill="#22C55E" />
      <text x="60" y="96" fill="#FB923C" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">GOLDENGATE CDC PIPELINE</text>
    `,
  },
  ogg_extract_process: {
    category: 'goldengate',
    title: 'OGG Extract Process',
    tags: ['extract', 'capture', 'goldengate', 'cdc'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#C2410C" stroke="#7C2D12" stroke-width="3" />
      <path d="M 48 40 l 16 16 l 16 -16" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <text x="60" y="32" fill="#FFEDD5" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">EXTRACT</text>
      <text x="60" y="96" fill="#FB923C" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">CAPTURES FROM REDO</text>
    `,
  },
  ogg_local_trail_file: {
    category: 'goldengate',
    title: 'OGG Local Trail File',
    tags: ['trail file', 'local trail', 'goldengate', 'dircat'],
    svg: `
      <rect x="30" y="18" width="60" height="72" rx="8" fill="#1C1917" stroke="#EA580C" stroke-width="2.5" />
      <text x="60" y="38" fill="#F97316" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">LOCAL TRAIL</text>
      <text x="60" y="52" fill="#FFFFFF" font-size="7" font-family="monospace" text-anchor="middle">./dirdat/lt000001</text>
      <line x1="40" y1="64" x2="80" y2="64" stroke="#78350F" stroke-width="2" />
      <line x1="40" y1="74" x2="70" y2="74" stroke="#78350F" stroke-width="2" />
      <text x="60" y="106" fill="#FED7AA" font-size="7" font-family="sans-serif" text-anchor="middle">Source Trail Storage</text>
    `,
  },
  ogg_data_pump_process: {
    category: 'goldengate',
    title: 'OGG Data Pump Process',
    tags: ['data pump', 'ogg pump', 'network send', 'goldengate'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#9A3412" stroke="#431407" stroke-width="3" />
      <path d="M 44 46 h 32 l -8 -8 M 68 46 l -8 8" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <text x="60" y="30" fill="#FFEDD5" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">PUMP</text>
      <text x="60" y="96" fill="#F97316" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">NETWORK SHIPPER</text>
    `,
  },
  ogg_remote_trail_file: {
    category: 'goldengate',
    title: 'OGG Remote Trail File',
    tags: ['remote trail', 'target trail', 'goldengate'],
    svg: `
      <rect x="30" y="18" width="60" height="72" rx="8" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2.5" />
      <text x="60" y="38" fill="#38BDF8" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">REMOTE TRAIL</text>
      <text x="60" y="52" fill="#FFFFFF" font-size="7" font-family="monospace" text-anchor="middle">./dirdat/rt000001</text>
      <line x1="40" y1="64" x2="80" y2="64" stroke="#0369A1" stroke-width="2" />
      <line x1="40" y1="74" x2="70" y2="74" stroke="#0369A1" stroke-width="2" />
      <text x="60" y="106" fill="#BAE6FD" font-size="7" font-family="sans-serif" text-anchor="middle">Target Staging Trail</text>
    `,
  },
  ogg_replicat_process: {
    category: 'goldengate',
    title: 'OGG Replicat Process',
    tags: ['replicat', 'apply', 'goldengate', 'target apply'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#15803D" stroke="#052E16" stroke-width="3" />
      <path d="M 46 46 l 10 10 l 18 -18" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
      <text x="60" y="30" fill="#DCFCE7" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">REPLICAT</text>
      <text x="60" y="96" fill="#22C55E" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">APPLIES SQL TO TARGET</text>
    `,
  },
  ogg_bidirectional_replication: {
    category: 'goldengate',
    title: 'OGG Bi-Directional Active-Active',
    tags: ['bidirectional', 'active active', 'goldengate', 'sync'],
    svg: `
      <circle cx="34" cy="46" r="18" fill="#1E293B" stroke="#F97316" stroke-width="2" />
      <text x="34" y="49" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">DB-A</text>
      <circle cx="86" cy="46" r="18" fill="#1E293B" stroke="#F97316" stroke-width="2" />
      <text x="86" y="49" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">DB-B</text>
      <path d="M 44 32 C 60 22 60 22 76 32" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" />
      <path d="M 76 60 C 60 70 60 70 44 60" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" />
      <text x="60" y="96" fill="#4ADE80" font-size="7.5" font-family="sans-serif" font-weight="900" text-anchor="middle">ACTIVE-ACTIVE 2-WAY</text>
    `,
  },
  ogg_conflict_detection_resolution: {
    category: 'goldengate',
    title: 'OGG Conflict Detection & Resolution (CDR)',
    tags: ['cdr', 'conflict detection', 'timestamp resolution', 'goldengate'],
    svg: `
      <polygon points="60,16 96,36 96,80 60,102 24,80 24,36" fill="#7F1D1D" stroke="#EF4444" stroke-width="2.5" />
      <text x="60" y="48" fill="#FFFFFF" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">CDR</text>
      <text x="60" y="64" fill="#FCA5A5" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">LATEST TIMESTAMP</text>
      <text x="60" y="76" fill="#FCA5A5" font-size="6.5" font-family="sans-serif" text-anchor="middle">OVERWRITE WINS</text>
    `,
  },

  // 6. Backup, Recovery & Maintenance (RMAN & Migrations) (12)
  oracle_rman_engine: {
    category: 'rman',
    title: 'Oracle RMAN Recovery Manager',
    tags: ['rman', 'recovery manager', 'backup', 'restore'],
    svg: `
      <rect x="18" y="20" width="84" height="76" rx="12" fill="#0F172A" stroke="#F59E0B" stroke-width="2.5" />
      <circle cx="40" cy="46" r="14" fill="#B45309" stroke="#FDE68A" stroke-width="2" />
      <path d="M 40 38 v 8 l 6 4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
      <text x="74" y="44" fill="#FFFFFF" font-size="10" font-family="sans-serif" font-weight="900">RMAN</text>
      <text x="74" y="56" fill="#F59E0B" font-size="7" font-family="sans-serif">BACKUP</text>
      <rect x="26" y="68" width="68" height="18" rx="4" fill="#1E293B" />
      <text x="60" y="80" fill="#94A3B8" font-size="6.5" font-family="monospace" text-anchor="middle">backup database plus...</text>
      <text x="60" y="106" fill="#FDE68A" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">RECOVERY MANAGER</text>
    `,
  },
  full_database_backup: {
    category: 'rman',
    title: 'Full Database Backup',
    tags: ['full backup', 'level 0', 'rman backup', 'complete copy'],
    svg: `
      ${cylinder(60, 22, 36, 12, 24, '#15803D', '#166534', '#052E16')}
      <rect x="24" y="68" width="72" height="28" rx="6" fill="#047857" stroke="#34D399" stroke-width="2" />
      <text x="60" y="84" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">FULL BACKUP (L0)</text>
      <text x="60" y="93" fill="#A7F3D0" font-size="6.5" font-family="sans-serif" text-anchor="middle">All Allocated Blocks</text>
    `,
  },
  incremental_backup_delta: {
    category: 'rman',
    title: 'Incremental Backup (Delta Level 1)',
    tags: ['incremental backup', 'level 1', 'block change tracking', 'delta'],
    svg: `
      <rect x="20" y="24" width="80" height="40" rx="8" fill="#1E293B" stroke="#0284C7" stroke-width="2" />
      <text x="60" y="42" fill="#38BDF8" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">BASE LEVEL 0</text>
      <rect x="30" y="70" width="60" height="26" rx="6" fill="#EA580C" stroke="#FDBA74" stroke-width="2" />
      <text x="60" y="84" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="900" text-anchor="middle">INCR DELTA (L1)</text>
      <text x="60" y="93" fill="#FED7AA" font-size="6" font-family="sans-serif" text-anchor="middle">Changed Blocks Only</text>
      <path d="M 60 54 v 14" stroke="#F97316" stroke-width="2" stroke-dasharray="2 2" />
    `,
  },
  point_in_time_recovery_pitr: {
    category: 'rman',
    title: 'Point-In-Time Recovery (PITR)',
    tags: ['pitr', 'point in time recovery', 'scn', 'timestamp'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#0F172A" stroke="#EC4899" stroke-width="3" />
      <path d="M 60 28 v 18 l 10 10" stroke="#F472B6" stroke-width="3" stroke-linecap="round" />
      <circle cx="60" cy="46" r="4" fill="#FFFFFF" />
      <text x="60" y="92" fill="#F472B6" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">UNTIL SCN / TIME</text>
      <text x="60" y="104" fill="#CBD5E1" font-size="6.5" font-family="sans-serif" text-anchor="middle">Rewinds Past Human Errors</text>
    `,
  },
  corrupted_data_block: {
    category: 'rman',
    title: 'Corrupted Data Block (ORA-01578)',
    tags: ['corruption', 'corrupted block', 'ora-01578', 'bad block'],
    svg: `
      <rect x="22" y="18" width="76" height="76" rx="8" fill="#450A0A" stroke="#EF4444" stroke-width="2.5" />
      <path d="M 36 32 l 48 48 M 84 32 l -48 48" stroke="#EF4444" stroke-width="5" stroke-linecap="round" />
      <text x="60" y="104" fill="#FCA5A5" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">ORA-01578 CORRUPT</text>
    `,
  },
  block_media_recovery_bmr: {
    category: 'rman',
    title: 'Block Media Recovery (BMR)',
    tags: ['bmr', 'block media recovery', 'restore block', 'zero downtime'],
    svg: `
      <rect x="20" y="20" width="80" height="60" rx="8" fill="#1E293B" stroke="#94A3B8" stroke-width="2" />
      <rect x="36" y="32" width="22" height="22" rx="3" fill="#EF4444" />
      <path d="M 62 43 h 18 l -4 -4 M 80 43 l -4 4" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" />
      <rect x="68" y="32" width="22" height="22" rx="3" fill="#22C55E" />
      <text x="60" y="94" fill="#4ADE80" font-size="7.5" font-family="sans-serif" font-weight="900" text-anchor="middle">ONLINE BLOCK HEAL</text>
      <text x="60" y="106" fill="#94A3B8" font-size="6.5" font-family="sans-serif" text-anchor="middle">Heal Single Block Online</text>
    `,
  },
  fast_recovery_area_fra: {
    category: 'rman',
    title: 'Fast Recovery Area (FRA)',
    tags: ['fra', 'fast recovery area', 'flash recovery area', 'backups'],
    svg: `
      <rect x="14" y="20" width="92" height="76" rx="12" fill="#1E1B4B" stroke="#6366F1" stroke-width="2.5" />
      <text x="60" y="38" fill="#C7D2FE" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">+FAST RECOVERY AREA</text>
      <rect x="22" y="46" width="76" height="14" rx="3" fill="#312E81" />
      <text x="60" y="56" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" text-anchor="middle">Archivelogs &amp; Backupsets</text>
      <rect x="22" y="64" width="76" height="14" rx="3" fill="#312E81" />
      <text x="60" y="74" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" text-anchor="middle">Flashback Logs</text>
      <text x="60" y="104" fill="#A5B4FC" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">AUTONOMOUS DISK SPACE</text>
    `,
  },
  datapump_export_expdp: {
    category: 'rman',
    title: 'Data Pump Export (expdp)',
    tags: ['datapump', 'expdp', 'export', 'dmp file'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#1E3A8A" stroke="#3B82F6" stroke-width="2.5" />
      <path d="M 60 30 v 26 M 50 46 l 10 10 l 10 -10" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="88" fill="#60A5FA" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">expdp EXPORT</text>
      <text x="60" y="100" fill="#CBD5E1" font-size="7" font-family="monospace" text-anchor="middle">dumpfile=schema.dmp</text>
    `,
  },
  datapump_import_impdp: {
    category: 'rman',
    title: 'Data Pump Import (impdp)',
    tags: ['datapump', 'impdp', 'import', 'remap schema'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#14532D" stroke="#22C55E" stroke-width="2.5" />
      <path d="M 60 56 v -26 M 50 40 l 10 -10 l 10 10" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="88" fill="#4ADE80" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">impdp IMPORT</text>
      <text x="60" y="100" fill="#CBD5E1" font-size="7" font-family="monospace" text-anchor="middle">remap_schema=A:B</text>
    `,
  },
  cross_platform_database_migration: {
    category: 'rman',
    title: 'Cross-Platform Database Migration',
    tags: ['migration', 'endian', 'cross platform', 'solaris to linux'],
    svg: `
      <rect x="12" y="32" width="34" height="40" rx="6" fill="#1E293B" stroke="#64748B" stroke-width="2" />
      <text x="29" y="54" fill="#E2E8F0" font-size="7" font-family="sans-serif" text-anchor="middle">AIX/Solaris</text>
      <path d="M 50 52 h 20 l -4 -4 M 70 52 l -4 4" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
      <rect x="74" y="32" width="34" height="40" rx="6" fill="#0F172A" stroke="#EF4444" stroke-width="2" />
      <text x="91" y="54" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">OEL Linux</text>
      <text x="60" y="94" fill="#FBBF24" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">ENDIAN CONVERSION</text>
    `,
  },
  database_cloning_duplicate: {
    category: 'rman',
    title: 'Database Cloning & Duplicate',
    tags: ['clone', 'duplicate', 'active duplicate', 'dev test clone'],
    svg: `
      <rect x="18" y="24" width="36" height="48" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="2" />
      <text x="36" y="52" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">PROD</text>
      <path d="M 58 48 h 10" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="3 2" />
      <rect x="70" y="24" width="36" height="48" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="2" />
      <text x="88" y="52" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">CLONE</text>
      <text x="60" y="94" fill="#7DD3FC" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">DUPLICATE DATABASE</text>
      <text x="60" y="106" fill="#CBD5E1" font-size="6.5" font-family="sans-serif" text-anchor="middle">Zero-Impact Active Clone</text>
    `,
  },
  database_upgrade_11g_12c_to_19c_21c: {
    category: 'rman',
    title: 'Database Upgrade (11g/12c to 19c/23ai)',
    tags: ['upgrade', 'autoupgrade', '19c', '23ai', '11g'],
    svg: `
      <rect x="14" y="32" width="32" height="40" rx="6" fill="#334155" stroke="#64748B" stroke-width="2" />
      <text x="30" y="54" fill="#CBD5E1" font-size="8" font-family="sans-serif" text-anchor="middle">11g/12c</text>
      <path d="M 50 52 h 20 l -4 -4 M 70 52 l -4 4" fill="none" stroke="#22C55E" stroke-width="3" stroke-linecap="round" />
      <rect x="74" y="32" width="34" height="40" rx="6" fill="#15803D" stroke="#4ADE80" stroke-width="2.5" />
      <text x="91" y="54" fill="#FFFFFF" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">19c/23c</text>
      <text x="60" y="94" fill="#4ADE80" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">AUTOUPGRADE TOOL</text>
    `,
  },

  // 7. Performance Tuning & Diagnostics (14)
  awr_automatic_workload_repository: {
    category: 'performance',
    title: 'AWR (Automatic Workload Repository)',
    tags: ['awr', 'workload', 'report', 'db time', 'performance'],
    svg: `
      <rect x="20" y="16" width="80" height="88" rx="10" fill="#0F172A" stroke="#F59E0B" stroke-width="2.5" />
      <rect x="28" y="24" width="64" height="16" rx="4" fill="#B45309" />
      <text x="60" y="36" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">AWR REPORT</text>
      <path d="M 32 68 l 12 -16 l 16 10 l 16 -20" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="80" fill="#E2E8F0" font-size="7" font-family="sans-serif" text-anchor="middle">Top 5 Timed Events</text>
      <text x="60" y="92" fill="#FDE68A" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">DB TIME ANALYSIS</text>
    `,
  },
  ash_active_session_history: {
    category: 'performance',
    title: 'ASH (Active Session History)',
    tags: ['ash', 'active session', 'transient bottleneck', '1 second samples'],
    svg: `
      <circle cx="60" cy="50" r="34" fill="#1E1B4B" stroke="#818CF8" stroke-width="2.5" />
      <path d="M 60 26 v 24 l 12 12" stroke="#A5B4FC" stroke-width="3" stroke-linecap="round" />
      <circle cx="60" cy="50" r="4" fill="#F43F5E" />
      <text x="60" y="96" fill="#C7D2FE" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">ASH 1-SEC SAMPLING</text>
      <text x="60" y="106" fill="#94A3B8" font-size="6.5" font-family="sans-serif" text-anchor="middle">Realtime Session Triage</text>
    `,
  },
  addm_diagnostic_monitor: {
    category: 'performance',
    title: 'ADDM (Automatic Database Diagnostic Monitor)',
    tags: ['addm', 'diagnostic monitor', 'recommendations', 'ai advice'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#047857" stroke="#10B981" stroke-width="3" />
      <circle cx="50" cy="42" r="4" fill="#FFFFFF" />
      <circle cx="70" cy="42" r="4" fill="#FFFFFF" />
      <path d="M 48 56 c 8 6 16 6 24 0" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <text x="60" y="28" fill="#D1FAE5" font-size="7.5" font-family="sans-serif" font-weight="900" text-anchor="middle">ADDM AI</text>
      <text x="60" y="94" fill="#34D399" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">AUTOMATIC RECOMMENDATIONS</text>
    `,
  },
  sql_explain_plan_tree: {
    category: 'performance',
    title: 'SQL Explain Plan Tree',
    tags: ['explain plan', 'cost', 'cardinality', 'execution tree'],
    svg: `
      <rect x="42" y="16" width="36" height="18" rx="4" fill="#0284C7" />
      <text x="60" y="28" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">SELECT (Cost 4)</text>
      <path d="M 60 34 v 12 M 42 46 h 36" stroke="#38BDF8" stroke-width="2" />
      <rect x="18" y="52" width="38" height="20" rx="4" fill="#0369A1" />
      <text x="37" y="65" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" text-anchor="middle">HASH JOIN</text>
      <rect x="64" y="52" width="38" height="20" rx="4" fill="#0369A1" />
      <text x="83" y="65" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" text-anchor="middle">INDEX SCAN</text>
      <text x="60" y="98" fill="#7DD3FC" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">SQL EXPLAIN PLAN</text>
    `,
  },
  full_table_scan_fts: {
    category: 'performance',
    title: 'Full Table Scan (FTS)',
    tags: ['fts', 'full table scan', 'multiblock read', 'high io'],
    svg: `
      <rect x="20" y="20" width="80" height="60" rx="8" fill="#1E293B" stroke="#EF4444" stroke-width="2" />
      <path d="M 28 34 h 64 M 28 46 h 64 M 28 58 h 64 M 28 70 h 64" stroke="#DC2626" stroke-width="2.5" />
      <text x="60" y="96" fill="#EF4444" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">FULL TABLE SCAN</text>
      <text x="60" y="106" fill="#FCA5A5" font-size="6.5" font-family="sans-serif" text-anchor="middle">High Disk I/O &amp; Slow Query</text>
    `,
  },
  index_range_scan: {
    category: 'performance',
    title: 'Index Range Scan (Optimized)',
    tags: ['index scan', 'fast lookup', 'optimized', 'btree range'],
    svg: `
      <rect x="20" y="20" width="80" height="60" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="2" />
      <path d="M 28 34 h 24 M 28 46 h 36 M 28 58 h 18" stroke="#34D399" stroke-width="2.5" />
      <circle cx="78" cy="50" r="14" fill="#059669" stroke="#6EE7B7" stroke-width="2" />
      <path d="M 72 50 l 4 4 l 8 -8" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
      <text x="60" y="96" fill="#10B981" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">INDEX RANGE SCAN</text>
    `,
  },
  database_wait_events: {
    category: 'performance',
    title: 'Database Wait Events (Bottlenecks)',
    tags: ['wait events', 'enqueue', 'db file sequential read', 'log file sync'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#78350F" stroke="#F59E0B" stroke-width="3" />
      <path d="M 60 28 v 18 h 14" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <text x="60" y="88" fill="#F59E0B" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">TOP WAIT EVENTS</text>
      <text x="60" y="100" fill="#CBD5E1" font-size="6.5" font-family="sans-serif" text-anchor="middle">db file sync / read by other</text>
    `,
  },
  cpu_bottleneck_overload: {
    category: 'performance',
    title: 'CPU Bottleneck & 100% Core Overload',
    tags: ['cpu bottleneck', '100% cpu', 'runaway query', 'spikes'],
    svg: `
      <rect x="24" y="24" width="72" height="72" rx="10" fill="#450A0A" stroke="#DC2626" stroke-width="2.5" />
      <rect x="36" y="36" width="48" height="48" rx="6" fill="#991B1B" />
      <text x="60" y="64" fill="#FFFFFF" font-size="14" font-family="sans-serif" font-weight="900" text-anchor="middle">100%</text>
      <line x1="30" y1="16" x2="30" y2="24" stroke="#DC2626" stroke-width="2" />
      <line x1="60" y1="16" x2="60" y2="24" stroke="#DC2626" stroke-width="2" />
      <line x1="90" y1="16" x2="90" y2="24" stroke="#DC2626" stroke-width="2" />
      <text x="60" y="110" fill="#F87171" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">CPU BOTTLENECK</text>
    `,
  },
  memory_bottleneck_depletion: {
    category: 'performance',
    title: 'Memory Depletion & OOM Killer',
    tags: ['memory bottleneck', 'oom', 'out of memory', 'swapping'],
    svg: `
      <rect x="18" y="28" width="84" height="48" rx="6" fill="#1E293B" stroke="#F97316" stroke-width="2" />
      <rect x="22" y="32" width="76" height="40" fill="#EA580C" />
      <text x="60" y="56" fill="#FFFFFF" font-size="10" font-family="sans-serif" font-weight="900" text-anchor="middle">RAM 99%</text>
      <text x="60" y="94" fill="#F97316" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">MEMORY DEPLETION</text>
      <text x="60" y="106" fill="#FED7AA" font-size="6.5" font-family="sans-serif" text-anchor="middle">Swapping / Paging Detected</text>
    `,
  },
  disk_io_bottleneck: {
    category: 'performance',
    title: 'Disk I/O Latency Bottleneck',
    tags: ['disk io', 'iowait', 'latency', 'storage bottleneck'],
    svg: `
      <circle cx="60" cy="48" r="32" fill="#3B0764" stroke="#C084FC" stroke-width="2.5" />
      <path d="M 40 48 h 40" stroke="#E9D5FF" stroke-width="4" stroke-linecap="round" />
      <polygon points="76,42 86,48 76,54" fill="#E9D5FF" />
      <text x="60" y="96" fill="#C084FC" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">DISK I/O BOTTLENECK</text>
      <text x="60" y="108" fill="#CBD5E1" font-size="6.5" font-family="sans-serif" text-anchor="middle">High Latency / Slow Storage</text>
    `,
  },
  locking_blocking_sessions: {
    category: 'performance',
    title: 'Blocking Sessions & Row Locks',
    tags: ['locking', 'blocking', 'row lock', 'enqueue tx'],
    svg: `
      <circle cx="34" cy="46" r="18" fill="#15803D" stroke="#4ADE80" stroke-width="2" />
      <text x="34" y="49" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">Holder</text>
      <path d="M 52 46 h 16" stroke="#EF4444" stroke-width="3" stroke-linecap="round" />
      <circle cx="86" cy="46" r="18" fill="#991B1B" stroke="#F87171" stroke-width="2" />
      <text x="86" y="49" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">Waiter</text>
      <text x="60" y="94" fill="#EF4444" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">BLOCKING SESSIONS</text>
    `,
  },
  deadlock_circular_chain: {
    category: 'performance',
    title: 'Deadlock Circular Chain (ORA-00060)',
    tags: ['deadlock', 'ora-00060', 'circular lock', 'resolution'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#450A0A" stroke="#EF4444" stroke-width="2.5" />
      <path d="M 44 38 a 16 16 0 1 1 32 0 a 16 16 0 0 1 -32 0" fill="none" stroke="#F87171" stroke-width="3" stroke-dasharray="8 4" />
      <polygon points="78,34 78,44 86,39" fill="#FFFFFF" />
      <text x="60" y="92" fill="#EF4444" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">DEADLOCK DETECTED</text>
      <text x="60" y="104" fill="#FCA5A5" font-size="7" font-family="sans-serif" text-anchor="middle">ORA-00060 (Circular Wait)</text>
    `,
  },
  sql_tuning_advisor: {
    category: 'performance',
    title: 'SQL Tuning Advisor (STA)',
    tags: ['sql tuning advisor', 'profiles', 'indexes', 'optimizer'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#0C4A6E" stroke="#38BDF8" stroke-width="3" />
      <path d="M 48 38 l 24 16 l -24 0 Z" fill="#FACC15" />
      <text x="60" y="94" fill="#38BDF8" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">SQL TUNING ADVISOR</text>
      <text x="60" y="106" fill="#CBD5E1" font-size="6.5" font-family="sans-serif" text-anchor="middle">Generates SQL Profiles</text>
    `,
  },
  sql_trace_tkprof: {
    category: 'performance',
    title: 'SQL Trace & TKPROF Formatter',
    tags: ['tkprof', 'sql trace', 'event 10046', 'diagnostics'],
    svg: `
      <rect x="22" y="18" width="76" height="74" rx="8" fill="#1C1917" stroke="#F59E0B" stroke-width="2.5" />
      <text x="60" y="34" fill="#FDE68A" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">TKPROF REPORT</text>
      <text x="60" y="48" fill="#FFFFFF" font-size="6" font-family="monospace" text-anchor="middle">Parse  CPU  Elapsed</text>
      <text x="60" y="58" fill="#F59E0B" font-size="6" font-family="monospace" text-anchor="middle">0.01   0.45   0.52</text>
      <text x="60" y="70" fill="#22C55E" font-size="6" font-family="monospace" text-anchor="middle">Rows: 1,420,000</text>
      <text x="60" y="104" fill="#F59E0B" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">RAW TRACE PROFILER</text>
    `,
  },

  // 8. Multitenant Architecture (CDB & PDB) (5)
  cdb_container_database: {
    category: 'multitenant',
    title: 'Container Database (CDB)',
    tags: ['cdb', 'container database', 'multitenant', 'consolidation'],
    svg: `
      <rect x="12" y="14" width="96" height="92" rx="14" fill="#0F172A" stroke="#0284C7" stroke-width="3" />
      <text x="60" y="32" fill="#38BDF8" font-size="10" font-family="sans-serif" font-weight="900" text-anchor="middle">CDB (CONTAINER DB)</text>
      <rect x="20" y="40" width="80" height="20" rx="4" fill="#0369A1" />
      <text x="60" y="53" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">CDB$ROOT (Core System)</text>
      <rect x="20" y="66" width="36" height="30" rx="4" fill="#1E293B" stroke="#0284C7" stroke-width="1.5" />
      <text x="38" y="84" fill="#38BDF8" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">PDB1</text>
      <rect x="64" y="66" width="36" height="30" rx="4" fill="#1E293B" stroke="#0284C7" stroke-width="1.5" />
      <text x="82" y="84" fill="#38BDF8" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">PDB2</text>
    `,
  },
  pdb_pluggable_database: {
    category: 'multitenant',
    title: 'Pluggable Database (PDB)',
    tags: ['pdb', 'pluggable database', 'tenant', 'isolation'],
    svg: `
      <rect x="24" y="20" width="72" height="78" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="2.5" />
      <text x="60" y="40" fill="#34D399" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">PDB</text>
      <text x="60" y="54" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" text-anchor="middle">App Data &amp; Users</text>
      <rect x="34" y="64" width="52" height="22" rx="4" fill="#047857" />
      <text x="60" y="78" fill="#D1FAE5" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">PLUGGABLE</text>
      <text x="60" y="108" fill="#10B981" font-size="7" font-family="sans-serif" text-anchor="middle">Isolated Tenant</text>
    `,
  },
  cdb_root_container: {
    category: 'multitenant',
    title: 'CDB$ROOT Container',
    tags: ['cdb$root', 'root container', 'common users', 'metadata'],
    svg: `
      <polygon points="60,16 98,38 98,82 60,104 22,82 22,38" fill="#1E1B4B" stroke="#6366F1" stroke-width="3" />
      <text x="60" y="52" fill="#FFFFFF" font-size="9" font-family="sans-serif" font-weight="900" text-anchor="middle">CDB$ROOT</text>
      <text x="60" y="66" fill="#C7D2FE" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">COMMON USERS</text>
      <text x="60" y="78" fill="#A5B4FC" font-size="6.5" font-family="sans-serif" text-anchor="middle">Metadata Links</text>
    `,
  },
  pdb_plug_unplug_operation: {
    category: 'multitenant',
    title: 'PDB Plug & Unplug Operation',
    tags: ['plug unplug', 'pdb mobility', 'relocate', 'xml manifest'],
    svg: `
      <rect x="14" y="28" width="40" height="48" rx="6" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="34" y="54" fill="#FDE68A" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">UNPLUG</text>
      <path d="M 54 52 h 12 l -3 -3 M 66 52 l -3 3" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" />
      <rect x="66" y="28" width="40" height="48" rx="6" fill="#1E293B" stroke="#22C55E" stroke-width="2" />
      <text x="86" y="54" fill="#86EFAC" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">PLUG</text>
      <text x="60" y="96" fill="#FACC15" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">PDB MOBILITY</text>
    `,
  },
  pdb_snapshot_carousel: {
    category: 'multitenant',
    title: 'PDB Snapshot Carousel',
    tags: ['snapshot carousel', 'pdb snapshots', 'point in time clone'],
    svg: `
      <circle cx="60" cy="50" r="32" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2.5" />
      <circle cx="60" cy="28" r="6" fill="#FACC15" />
      <circle cx="78" cy="42" r="6" fill="#38BDF8" />
      <circle cx="72" cy="68" r="6" fill="#38BDF8" />
      <circle cx="48" cy="68" r="6" fill="#38BDF8" />
      <circle cx="42" cy="42" r="6" fill="#38BDF8" />
      <text x="60" y="54" fill="#FFFFFF" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">PDB</text>
      <text x="60" y="98" fill="#7DD3FC" font-size="7.5" font-family="sans-serif" font-weight="900" text-anchor="middle">SNAPSHOT CAROUSEL</text>
    `,
  },

  // 9. Cloud, Infrastructure, OS & Security (10)
  oracle_cloud_infrastructure_oci: {
    category: 'cloud',
    title: 'Oracle Cloud Infrastructure (OCI)',
    tags: ['oci', 'oracle cloud', 'cloud infrastructure', 'regions'],
    svg: `
      <path d="M 38 64 a 18 18 0 0 1 32 -10 a 24 24 0 0 1 24 22 h -64 a 14 14 0 0 1 8 -12" fill="#C2410C" stroke="#FB923C" stroke-width="2.5" />
      <text x="60" y="54" fill="#FFFFFF" font-size="10" font-family="sans-serif" font-weight="900" text-anchor="middle">OCI</text>
      <text x="60" y="88" fill="#FDBA74" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">ORACLE CLOUD</text>
    `,
  },
  autonomous_database_cloud: {
    category: 'cloud',
    title: 'Oracle Autonomous Database',
    tags: ['autonomous database', 'self driving', 'self securing', 'cloud db'],
    svg: `
      <circle cx="60" cy="46" r="30" fill="#042F2E" stroke="#14B8A6" stroke-width="3" />
      <circle cx="60" cy="46" r="14" fill="none" stroke="#5EEAD4" stroke-width="2.5" stroke-dasharray="6 3" />
      <circle cx="60" cy="46" r="5" fill="#FACC15" />
      <text x="60" y="94" fill="#2DD4BF" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">AUTONOMOUS DATABASE</text>
      <text x="60" y="106" fill="#99F6E4" font-size="6.5" font-family="sans-serif" text-anchor="middle">Self-Driving, Self-Securing</text>
    `,
  },
  oracle_enterprise_manager_oem_13c: {
    category: 'cloud',
    title: 'Oracle Enterprise Manager (OEM 13c)',
    tags: ['oem', 'oem 13c', 'enterprise manager', 'cloud control'],
    svg: `
      <rect x="14" y="20" width="92" height="74" rx="10" fill="#0F172A" stroke="#0284C7" stroke-width="2.5" />
      <rect x="22" y="28" width="76" height="16" rx="4" fill="#0369A1" />
      <text x="60" y="40" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">OEM 13c CLOUD CONTROL</text>
      <path d="M 30 68 l 14 -18 l 16 12 l 18 -16" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" />
      <text x="60" y="106" fill="#38BDF8" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">SINGLE PANE DASHBOARD</text>
    `,
  },
  quest_toad_database_ide: {
    category: 'cloud',
    title: 'Quest Toad Database IDE',
    tags: ['toad', 'quest toad', 'database ide', 'sql editor'],
    svg: `
      <circle cx="60" cy="48" r="30" fill="#14532D" stroke="#4ADE80" stroke-width="3" />
      <circle cx="48" cy="38" r="5" fill="#FFFFFF" />
      <circle cx="72" cy="38" r="5" fill="#FFFFFF" />
      <circle cx="50" cy="38" r="2" fill="#000000" />
      <circle cx="70" cy="38" r="2" fill="#000000" />
      <path d="M 46 54 c 6 6 22 6 28 0" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <text x="60" y="96" fill="#86EFAC" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">QUEST TOAD IDE</text>
    `,
  },
  oracle_enterprise_linux_rhel_terminal: {
    category: 'cloud',
    title: 'Oracle Enterprise Linux (OEL / RHEL Terminal)',
    tags: ['oel', 'linux', 'rhel', 'terminal', 'bash'],
    svg: `
      <rect x="16" y="20" width="88" height="74" rx="8" fill="#000000" stroke="#EF4444" stroke-width="2" />
      <rect x="16" y="20" width="88" height="16" fill="#1F2937" />
      <circle cx="26" cy="28" r="3" fill="#EF4444" />
      <circle cx="34" cy="28" r="3" fill="#F59E0B" />
      <circle cx="42" cy="28" r="3" fill="#10B981" />
      <text x="26" y="52" fill="#22C55E" font-size="8" font-family="monospace font-bold">[oracle@db01 ~]$</text>
      <text x="26" y="66" fill="#F87171" font-size="7.5" font-family="monospace">uname -r</text>
      <text x="60" y="106" fill="#E5E7EB" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">ORACLE LINUX (UEK)</text>
    `,
  },
  sqlplus_command_line: {
    category: 'cloud',
    title: 'SQL*Plus Command Line Tool',
    tags: ['sqlplus', 'cli', 'sql*plus', 'sysdba'],
    svg: `
      <rect x="14" y="20" width="92" height="76" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="2" />
      <text x="24" y="40" fill="#38BDF8" font-size="8" font-family="monospace" font-weight="bold">SQL&gt; connect / as sysdba</text>
      <text x="24" y="54" fill="#22C55E" font-size="7.5" font-family="monospace">Connected.</text>
      <text x="24" y="68" fill="#FACC15" font-size="7.5" font-family="monospace">SQL&gt; startup</text>
      <text x="24" y="82" fill="#E2E8F0" font-size="7" font-family="monospace">Database opened.</text>
      <text x="60" y="106" fill="#38BDF8" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">SQL*PLUS TERMINAL</text>
    `,
  },
  oracle_wallet_tde_encryption: {
    category: 'cloud',
    title: 'Oracle Wallet & TDE Encryption',
    tags: ['tde', 'transparent data encryption', 'wallet', 'security'],
    svg: `
      <polygon points="60,16 94,32 94,76 60,100 26,76 26,32" fill="#1E1B4B" stroke="#A855F7" stroke-width="2.5" />
      <rect x="46" y="46" width="28" height="24" rx="4" fill="#7E22CE" stroke="#D8B4FE" stroke-width="2" />
      <path d="M 52 46 v -8 a 8 8 0 0 1 16 0 v 8" fill="none" stroke="#D8B4FE" stroke-width="2.5" />
      <text x="60" y="88" fill="#E9D5FF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">TDE ENCRYPTION</text>
    `,
  },
  banking_payment_switch_36k_tps: {
    category: 'cloud',
    title: 'Banking Payment Switch (36,000 TPS)',
    tags: ['banking', 'payment switch', 'tps', 'fintech', 'high volume'],
    svg: `
      <circle cx="60" cy="46" r="30" fill="#064E3B" stroke="#10B981" stroke-width="3" />
      <text x="60" y="46" fill="#FFFFFF" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">36,000</text>
      <text x="60" y="58" fill="#6EE7B7" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">TPS CORE</text>
      <text x="60" y="96" fill="#34D399" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">BANKING PAYMENT SWITCH</text>
      <text x="60" y="108" fill="#CBD5E1" font-size="6.5" font-family="sans-serif" text-anchor="middle">Mission-Critical Tier 1 DB</text>
    `,
  },
  opatch_rolling_patching: {
    category: 'cloud',
    title: 'OPatch Rolling Patching (Zero Downtime)',
    tags: ['opatch', 'psu', 'ru', 'rolling patch', 'zero downtime'],
    svg: `
      <circle cx="60" cy="46" r="28" fill="#0C4A6E" stroke="#0284C7" stroke-width="2.5" />
      <path d="M 44 46 h 32 M 60 30 v 32" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" />
      <text x="60" y="94" fill="#38BDF8" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">OPATCH AUTO (RU)</text>
      <text x="60" y="106" fill="#BAE6FD" font-size="6.5" font-family="sans-serif" text-anchor="middle">Rolling Zero Downtime</text>
    `,
  },
  cis_database_security_hardening: {
    category: 'cloud',
    title: 'CIS Database Security Hardening',
    tags: ['cis benchmark', 'security hardening', 'audit', 'compliance'],
    svg: `
      <polygon points="60,16 94,30 94,72 60,98 26,72 26,30" fill="#047857" stroke="#34D399" stroke-width="3" />
      <path d="M 48 50 l 8 8 l 16 -16" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <text x="60" y="110" fill="#6EE7B7" font-size="7.5" font-family="sans-serif" font-weight="900" text-anchor="middle">CIS HARDENED</text>
    `,
  },

  // 10. Motion Hooks & Channel Assets (5)
  vs_battle_split_screen_badge: {
    category: 'hooks',
    title: 'VS Battle Split Screen Badge',
    tags: ['vs', 'versus', 'battle badge', 'split screen', 'compare'],
    svg: `
      <polygon points="60,14 104,36 104,84 60,106 16,84 16,36" fill="#DC2626" stroke="#FEF08A" stroke-width="3" />
      <text x="60" y="66" fill="#FEF08A" font-size="24" font-family="sans-serif" font-weight="900" text-anchor="middle">VS</text>
      <text x="60" y="84" fill="#FFFFFF" font-size="7.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">HEAD TO HEAD</text>
    `,
  },
  dba_pro_tip_golden_badge: {
    category: 'hooks',
    title: 'DBA Pro Tip Golden Badge',
    tags: ['pro tip', 'golden badge', 'best practice', 'dba secret'],
    svg: `
      <circle cx="60" cy="50" r="36" fill="#B45309" stroke="#FDE68A" stroke-width="3.5" />
      <circle cx="60" cy="50" r="30" fill="#D97706" />
      <path d="M 60 28 l 4 12 h 12 l -10 8 l 4 12 l -10 -7 l -10 7 l 4 -12 l -10 -8 h 12 Z" fill="#FEF08A" />
      <text x="60" y="74" fill="#FFFFFF" font-size="8" font-family="sans-serif" font-weight="900" text-anchor="middle">DBA PRO TIP</text>
    `,
  },
  myth_busted_stamp: {
    category: 'hooks',
    title: 'Myth Busted Red Stamp',
    tags: ['myth busted', 'stamp', 'debunked', 'fact check'],
    svg: `
      <rect x="12" y="32" width="96" height="46" rx="8" fill="#7F1D1D" stroke="#EF4444" stroke-width="3" transform="rotate(-6 60 55)" />
      <text x="60" y="58" fill="#FCA5A5" font-size="12" font-family="sans-serif" font-weight="900" text-anchor="middle" transform="rotate(-6 60 55)">MYTH BUSTED!</text>
      <text x="60" y="70" fill="#FFFFFF" font-size="6.5" font-family="sans-serif" font-weight="bold" text-anchor="middle" transform="rotate(-6 60 55)">100% DEBUNKED</text>
    `,
  },
  critical_alert_warning_triangle: {
    category: 'hooks',
    title: 'Critical Alert Warning Triangle',
    tags: ['critical alert', 'warning', 'production down', 'danger'],
    svg: `
      <polygon points="60,18 104,94 16,94" fill="#EA580C" stroke="#FEF08A" stroke-width="3.5" stroke-linejoin="round" />
      <text x="60" y="72" fill="#FFFFFF" font-size="28" font-family="sans-serif" font-weight="900" text-anchor="middle">!</text>
      <text x="60" y="88" fill="#FEF08A" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">CRITICAL ALERT</text>
    `,
  },
  oracle_course_channel_logo: {
    category: 'hooks',
    title: 'Oracle Master Course Channel Badge',
    tags: ['channel logo', 'badge', 'oracle master', 'dba course'],
    svg: `
      <circle cx="60" cy="50" r="38" fill="#18181B" stroke="#F97316" stroke-width="3" />
      <text x="60" y="44" fill="#F97316" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">ORACLE</text>
      <text x="60" y="58" fill="#FFFFFF" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">MASTER</text>
      <text x="60" y="74" fill="#FDE047" font-size="7" font-family="sans-serif" font-weight="black" text-anchor="middle">ACADEMY</text>
    `,
  },
};

// Generate files
let count = 0;
for (const [key, item] of Object.entries(databaseSvgCatalog)) {
  const filePath = path.join(outDir, `${key}.svg`);
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%" aria-label="${item.title}">
  <!-- Itnavideo Database Asset: ${item.title} -->
  ${item.svg.trim()}
</svg>
`;
  fs.writeFileSync(filePath, svgContent, 'utf8');
  count++;
}

console.log(`Successfully generated ${count} Database SVGs in ${outDir}`);
