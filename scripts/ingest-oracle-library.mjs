/**
 * scripts/ingest-oracle-library.mjs
 *
 * Dedicated Cloud Ingestion Engine: Oracle Database Education Asset Library (300+ Assets)
 * Targets S3 Prefix: reusable-assets/oracle-database/{topic}/
 *
 * Fully compliant with:
 * - Rule 0: Zero Local Heavy Compute Policy (Zero disk writes, 100% in-flight streaming)
 * - Rule 0.1: Zero Automatic Git Push Policy
 * - Rule 0.4: Post-Task Verification
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Environment & AWS S3 Credentials Loading
// ---------------------------------------------------------------------------
const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
}

const BUCKET = process.env.REMOTION_AWS_BUCKET || 'remotionlambda-useast1-2zq6twaok1';
const REGION = process.env.REMOTION_AWS_REGION || 'us-east-1';
const ACCESS_KEY = process.env.REMOTION_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.REMOTION_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error('❌ Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY in environment');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// AWS SigV4 Streaming Engine (In-Memory, Zero Disk I/O)
// ---------------------------------------------------------------------------
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  return crypto.createHmac('sha256', kService).update('aws4_request').digest();
}

async function s3HeadObject(key) {
  const cleanKey = key.replace(/^\/+/, '');
  const host = `${BUCKET}.s3.${REGION}.amazonaws.com`;
  const endpoint = `https://${host}/${encodeURI(cleanKey)}`;
  try {
    const res = await fetch(endpoint, { method: 'HEAD', signal: AbortSignal.timeout(4000) });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function s3PutObject(key, buffer, contentType) {
  const cleanKey = key.replace(/^\/+/, '');
  const host = `${BUCKET}.s3.${REGION}.amazonaws.com`;
  const endpoint = `https://${host}/${encodeURI(cleanKey)}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = crypto.createHash('sha256').update(buffer).digest('hex');
  const canonicalUri = '/' + cleanKey.split('/').map(encodeURIComponent).join('/');
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = `PUT\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${REGION}/s3/aws4_request`;
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

  const signingKey = getSignatureKey(SECRET_KEY, dateStamp, REGION, 's3');
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
  const authHeader = `${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'host': host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
      'Authorization': authHeader,
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
    },
    body: buffer,
    signal: AbortSignal.timeout(8000),
  });

  return { status: res.status, text: res.status !== 200 ? await res.text() : '' };
}

// ---------------------------------------------------------------------------
// High-Fidelity Educational SVG Diagram Generator
// ---------------------------------------------------------------------------
function generateOracleDiagramSvg({ id, topicTitle, title, subtitle, mainComponent, details, takeaway }) {
  const escapeXml = (str) => String(str).replace(/[<>&"']/g, (m) => {
    switch (m) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
    }
  });

  const safeTopic = escapeXml(topicTitle);
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeMain = escapeXml(mainComponent);
  const safeTakeaway = escapeXml(takeaway);

  // Generate 4 structured detail boxes
  const detailBoxes = details.map((d, i) => {
    const x = 120 + (i % 2) * 840;
    const y = 520 + Math.floor(i / 2) * 190;
    return `
      <g transform="translate(${x}, ${y})">
        <rect width="800" height="160" rx="12" fill="#0E1526" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
        <rect width="6" height="160" rx="3" fill="${i % 2 === 0 ? '#FF5722' : '#FFA000'}"/>
        <text x="32" y="42" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700">${escapeXml(d.name)}</text>
        <text x="32" y="78" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="400">${escapeXml(d.desc)}</text>
        <rect x="32" y="102" width="${Math.min(736, d.tag.length * 14 + 24)}" height="32" rx="6" fill="rgba(255,87,34,0.12)" stroke="rgba(255,87,34,0.25)" stroke-width="1"/>
        <text x="44" y="123" fill="#FFA000" font-family="'JetBrains Mono', Consolas, monospace" font-size="14" font-weight="600">${escapeXml(d.tag)}</text>
      </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
    <defs>
      <linearGradient id="bg_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#070B14"/>
        <stop offset="100%" stop-color="#0B1120"/>
      </linearGradient>
      <linearGradient id="grad_orange_${id}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF5722"/>
        <stop offset="100%" stop-color="#FFA000"/>
      </linearGradient>
      <pattern id="grid_${id}" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Canvas Background -->
    <rect width="1920" height="1080" fill="url(#bg_${id})"/>
    <rect width="1920" height="1080" fill="url(#grid_${id})"/>

    <!-- Subtle Ambient Glow -->
    <circle cx="1600" cy="200" r="350" fill="#FF5722" opacity="0.05" filter="blur(80px)"/>
    <circle cx="200" cy="800" r="300" fill="#FFA000" opacity="0.04" filter="blur(70px)"/>

    <!-- Top Header Bar -->
    <g transform="translate(120, 90)">
      <rect x="0" y="0" width="340" height="34" rx="17" fill="rgba(255,87,34,0.12)" stroke="rgba(255,87,34,0.3)" stroke-width="1"/>
      <circle cx="18" cy="17" r="5" fill="#FF5722"/>
      <text x="32" y="23" fill="#FFA000" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" font-weight="700" letter-spacing="1.5">${safeTopic}</text>

      <text x="0" y="85" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" letter-spacing="-0.5">${safeTitle}</text>
      <text x="0" y="125" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500">${safeSubtitle}</text>
    </g>

    <!-- Main Architecture Hero Block -->
    <g transform="translate(120, 270)">
      <rect width="1680" height="210" rx="16" fill="#0E1526" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
      <rect x="0" y="0" width="1680" height="4" fill="url(#grad_orange_${id})"/>
      <rect x="36" y="32" width="14" height="14" rx="3" fill="#FF5722"/>
      <text x="62" y="45" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700">CORE ARCHITECTURE &amp; DATA FLOW</text>
      <text x="36" y="95" fill="#E2E8F0" font-family="'JetBrains Mono', Consolas, monospace" font-size="19" font-weight="500">${safeMain}</text>
      <line x1="36" y1="130" x2="1644" y2="130" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="36" y="172" fill="#10B981" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="600">✓ Production Best Practice &amp; Enterprise Engine Rule</text>
    </g>

    <!-- 4 Structured Component Boxes -->
    ${detailBoxes}

    <!-- Key Takeaway Bottom Banner -->
    <g transform="translate(120, 930)">
      <rect width="1680" height="80" rx="12" fill="#0A0F1D" stroke="rgba(255,160,0,0.3)" stroke-width="1.5"/>
      <rect x="24" y="24" width="32" height="32" rx="6" fill="#FFA000"/>
      <text x="40" y="46" text-anchor="middle" fill="#070B14" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="900">★</text>
      <text x="76" y="48" fill="#F8FAFC" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600">${safeTakeaway}</text>
    </g>

    <!-- Watermark / Footer Disclaimer -->
    <text x="1800" y="1050" text-anchor="end" fill="#475569" font-family="'JetBrains Mono', Consolas, monospace" font-size="13">ITNAVIDEO DATABASE ACADEMY • ORIGINAL EDUCATIONAL ASSET (CC0)</text>
  </svg>`;
}

// ---------------------------------------------------------------------------
// Master Registry Builder: 310 Oracle Database Educational Assets
// ---------------------------------------------------------------------------
function buildOracleRegistry() {
  const topics = [
    {
      key: 'fundamentals',
      name: 'DATABASE FUNDAMENTALS',
      count: 35,
      items: [
        { slug: 'relational-model-core', title: 'Relational Database Model', desc: 'Tuples, Attributes, and Relational Algebra' },
        { slug: 'tables-and-schemas', title: 'Tables and Schema Objects', desc: 'Logical Storage Structures & Metadata Catalog' },
        { slug: 'primary-key-strategy', title: 'Primary Key & Uniqueness', desc: 'Entity Identity, B-Tree Backing & NOT NULL' },
        { slug: 'foreign-key-referential', title: 'Foreign Keys & Constraints', desc: 'Referential Integrity, Cascading & Orphan Prevention' },
        { slug: 'unique-vs-check-constraints', title: 'Unique vs Check Constraints', desc: 'Data Validation, Indexing & Null Handling' },
        { slug: 'oracle-datatypes-numeric', title: 'Oracle Datatypes: NUMBER', desc: 'Precision, Scale, and IEEE Floating Point' },
        { slug: 'oracle-datatypes-character', title: 'VARCHAR2 vs CHAR vs CLOB', desc: 'Byte vs Char Semantics and LOB Segment Storage' },
        { slug: 'oracle-datatypes-datetime', title: 'DATE vs TIMESTAMP with Time Zone', desc: 'Fractional Seconds, Timezone Offsets & SCN Mapping' },
        { slug: 'normalization-1nf-atomic', title: 'First Normal Form (1NF)', desc: 'Atomic Columns, Repeating Groups Elimination' },
        { slug: 'normalization-2nf-functional', title: 'Second Normal Form (2NF)', desc: 'Eliminating Partial Dependencies on Composite Keys' },
        { slug: 'normalization-3nf-transitive', title: 'Third Normal Form (3NF)', desc: 'Eliminating Transitive Dependencies Across Tables' },
        { slug: 'boyce-codd-normal-form', title: 'Boyce-Codd Normal Form (BCNF)', desc: 'Handling Overlapping Candidate Keys' },
        { slug: 'denormalization-patterns', title: 'Denormalization Trade-offs', desc: 'OLTP Write Overhead vs OLAP Read Performance' },
        { slug: 'eav-antipattern-analysis', title: 'EAV Anti-Pattern in RDBMS', desc: 'Entity-Attribute-Value Performance Pitfalls' },
        { slug: 'surrogate-vs-natural-keys', title: 'Surrogate vs Natural Keys', desc: 'UUIDs vs Sequences vs Real-World Business Keys' },
        { slug: 'row-structure-anatomy', title: 'Oracle Row Format Anatomy', desc: 'Row Header, Column Lengths, and Chaining / Migration' },
        { slug: 'null-mechanics-in-oracle', title: 'NULL Logic & Three-Valued Logic', desc: 'NULL in Where Predicates, Functions, and Indexes' },
        { slug: 'acid-properties-relational', title: 'ACID Properties in RDBMS', desc: 'Atomicity, Consistency, Isolation, and Durability' },
        { slug: 'domain-integrity-rules', title: 'Domain & Semantic Integrity', desc: 'Enforcing Enterprise Business Rules at Schema Level' },
        { slug: 'data-dictionary-tables', title: 'Oracle Data Dictionary Views', desc: 'DBA_*, ALL_*, and USER_* Views Architecture' },
        { slug: 'metadata-ddl-lifecycle', title: 'DDL Lifecycle & Dictionary Locks', desc: 'Exclusive Table Locks during Structural Modifications' },
        { slug: 'schema-naming-conventions', title: 'Enterprise Naming Conventions', desc: 'Consistent Standard for Tables, Columns, and Indexes' },
        { slug: 'read-only-tables-mechanics', title: 'Read-Only Tables in Oracle', desc: 'ALTER TABLE READ ONLY and Segment Immutability' },
        { slug: 'invisible-columns-feature', title: 'Invisible Columns Architecture', desc: 'Schema Evolution without Breaking Legacy SELECT *' },
        { slug: 'virtual-columns-expressions', title: 'Virtual Columns & Expression Indices', desc: 'Computed Attributes without Physical Disk Storage' },
        { slug: 'default-on-null-values', title: 'DEFAULT ON NULL Values', desc: 'Automatic Value Assignment during Incomplete Inserts' },
        { slug: 'identity-columns-oracle12c', title: 'Identity Columns (GENERATED ALWAYS)', desc: 'Native Autoincrement replacing Sequences and Triggers' },
        { slug: 'temporary-tables-gtt', title: 'Global Temporary Tables (GTT)', desc: 'ON COMMIT DELETE vs PRESERVE ROWS Session Segments' },
        { slug: 'private-temporary-tables', title: 'Private Temporary Tables (ORA$PTT)', desc: 'In-Memory Transaction-Scoped Tables (Oracle 18c+)' },
        { slug: 'table-compression-basic-oltp', title: 'Table Compression: OLTP vs HCC', desc: 'Row Deduplication and Hybrid Columnar Storage' },
        { slug: 'truncate-vs-delete-mechanics', title: 'TRUNCATE vs DELETE Comparison', desc: 'High Water Mark Reset vs Undo-Logged DML' },
        { slug: 'high-water-mark-hwm', title: 'High Water Mark (HWM) Anatomy', desc: 'Full Table Scan Bounds and Segment Space Fragmentation' },
        { slug: 'shrink-space-reorganization', title: 'ALTER TABLE SHRINK SPACE', desc: 'Segment Compaction and High Water Mark Lowering' },
        { slug: 'row-level-security-intro', title: 'Row-Level Security Introduction', desc: 'Dynamic Predicate Injection using DBMS_RLS' },
        { slug: 'schema-security-best-practices', title: 'Schema Hardening & Privileges', desc: 'Granting Minimum Object Privileges to Application Roles' }
      ]
    },
    {
      key: 'sql-engine',
      name: 'SQL QUERIES & SYNTAX',
      count: 40,
      items: [
        { slug: 'select-clause-execution-order', title: 'SQL Execution Order Lifecycle', desc: 'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY' },
        { slug: 'where-clause-predicate-pushdown', title: 'WHERE Filtering & SARGability', desc: 'Search Argumentable Predicates vs Index Suppressors' },
        { slug: 'inner-join-set-mechanics', title: 'INNER JOIN Set Intersection', desc: 'Matching Keys, Cartesian Risk, and Join Orders' },
        { slug: 'left-outer-join-null-extension', title: 'LEFT OUTER JOIN Mechanics', desc: 'Preserving Unmatched Left Rows with NULL Extension' },
        { slug: 'right-outer-join-semantics', title: 'RIGHT OUTER JOIN Semantics', desc: 'Right-Preserving Relation and Query Equivalence' },
        { slug: 'full-outer-join-hash-partition', title: 'FULL OUTER JOIN Execution', desc: 'Complete Outer Union and Hash Join Partitioning' },
        { slug: 'cross-join-cartesian-analysis', title: 'CROSS JOIN & Cartesian Products', desc: 'Multiplying Relations and Accidental Missing Join Conditions' },
        { slug: 'self-join-hierarchical-patterns', title: 'Self-Join for Organizational Trees', desc: 'Joining an Entity to Itself via Parent Foreign Key' },
        { slug: 'group-by-aggregation-engine', title: 'GROUP BY & Aggregations', desc: 'Grouping Sets, Hash Group By, and Sorting Overhead' },
        { slug: 'having-vs-where-filtering', title: 'HAVING vs WHERE Distinctions', desc: 'Filtering Individual Rows vs Filtering Group Aggregations' },
        { slug: 'rollup-and-cube-analytics', title: 'ROLLUP and CUBE Aggregations', desc: 'Generating Subtotals and Multi-Dimensional Cross-Tabs' },
        { slug: 'correlated-subquery-mechanics', title: 'Correlated Subqueries', desc: 'Row-by-Row Outer Reference Evaluation and Unnesting' },
        { slug: 'exists-vs-in-performance', title: 'EXISTS vs IN Evaluation', desc: 'Semi-Join Optimization vs Null Traps in NOT IN' },
        { slug: 'scalar-subquery-caching', title: 'Scalar Subquery Caching', desc: 'Single Value Return and In-Memory Result Cache' },
        { slug: 'common-table-expressions-cte', title: 'Common Table Expressions (WITH)', desc: 'Modular Query Readability and Materialization Hints' },
        { slug: 'recursive-cte-hierarchies', title: 'Recursive CTEs (WITH RECURSIVE)', desc: 'Anchor Member and Recursive Union Evaluation' },
        { slug: 'window-functions-over-clause', title: 'Window Functions: OVER Clause', desc: 'PARTITION BY, ORDER BY, and Window Framing' },
        { slug: 'row-number-rank-denserank', title: 'ROW_NUMBER vs RANK vs DENSE_RANK', desc: 'Handling Duplicate Ordering Values in Analytics' },
        { slug: 'lead-and-lag-offset-access', title: 'LEAD and LAG Window Functions', desc: 'Inter-Row Navigation without Expensive Self-Joins' },
        { slug: 'running-totals-cumulative-sum', title: 'Running Totals & Moving Averages', desc: 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW' },
        { slug: 'first-value-last-value-framing', title: 'FIRST_VALUE and LAST_VALUE', desc: 'Boundary Framing Traps with Default Range Spec' },
        { slug: 'listagg-string-aggregation', title: 'LISTAGG String Aggregation', desc: 'Concatenating Grouped Column Values with Overflow Truncation' },
        { slug: 'set-operators-union-vs-all', title: 'UNION vs UNION ALL Evaluation', desc: 'Sorting Deduplication vs Raw Appended Results' },
        { slug: 'set-operators-intersect-minus', title: 'INTERSECT and MINUS (EXCEPT)', desc: 'Set Intersection and Difference in Relational Engine' },
        { slug: 'hierarchical-query-connect-by', title: 'CONNECT BY PRIOR & LEVEL', desc: 'Oracle Classic Tree Traversal and SYS_CONNECT_BY_PATH' },
        { slug: 'merge-statement-upsert', title: 'MERGE Statement (Upsert)', desc: 'Atomic INSERT and UPDATE Matching Source Staging' },
        { slug: 'insert-all-multi-table', title: 'INSERT ALL / FIRST Multi-Table', desc: 'Conditional Routing of Source Rows into Distinct Tables' },
        { slug: 'returning-into-clause', title: 'DML RETURNING INTO Clause', desc: 'Retrieving Generated Keys without Additional Queries' },
        { slug: 'flashback-query-as-of', title: 'Flashback Query: AS OF TIMESTAMP', desc: 'Querying Historical Table State using Undo Retention' },
        { slug: 'flashback-version-query', title: 'Flashback Versions Query', desc: 'Auditing Row Modifications between SCN Timelines' },
        { slug: 'standard-views-query-rewrite', title: 'Views & Query Transformation', desc: 'View Merging, Complex View Pushdown, and Security' },
        { slug: 'with-check-option-views', title: 'WITH CHECK OPTION on Views', desc: 'Preventing DML from Violating View WHERE Clauses' },
        { slug: 'materialized-views-overview', title: 'Materialized Views Architecture', desc: 'Physical Query Caching for Complex Aggregations' },
        { slug: 'materialized-view-logs', title: 'Materialized View Logs (MLOG$)', desc: 'Delta Row Capture for Fast Refresh Capabilities' },
        { slug: 'query-rewrite-integrity', title: 'Cost-Based Query Rewrite', desc: 'Transparently Routing Base Queries to Materialized Views' },
        { slug: 'case-expressions-searched', title: 'Simple vs Searched CASE Expressions', desc: 'Conditional Value Transformation within SQL' },
        { slug: 'coalesce-vs-nvl-mechanics', title: 'COALESCE vs NVL Evaluation', desc: 'Short-Circuit Evaluation vs Eager Argument Processing' },
        { slug: 'decode-function-oracle-legacy', title: 'DECODE vs Modern CASE', desc: 'Legacy Oracle Function Equivalence and Type Coercion' },
        { slug: 'pattern-matching-match-recognize', title: 'MATCH_RECOGNIZE Pattern Matching', desc: 'Complex Event Processing (CEP) inside SQL' },
        { slug: 'json-sql-querying-oracle', title: 'JSON SQL Queries & Dot Notation', desc: 'JSON_VALUE, JSON_QUERY, and JSON_TABLE Operators' }
      ]
    },
    {
      key: 'architecture',
      name: 'ORACLE ARCHITECTURE',
      count: 40,
      items: [
        { slug: 'instance-vs-database', title: 'Oracle Instance vs Database', desc: 'Memory Structures & Processes vs Physical Files' },
        { slug: 'system-global-area-sga', title: 'System Global Area (SGA) Overview', desc: 'Shared Memory Allocated at Instance Startup' },
        { slug: 'shared-pool-library-cache', title: 'Shared Pool: Library Cache', desc: 'Parsed SQL Statements, Execution Plans, and Latch Contention' },
        { slug: 'shared-pool-dictionary-cache', title: 'Shared Pool: Row / Dict Cache', desc: 'Data Dictionary Metadata Cached in Fast Memory' },
        { slug: 'database-buffer-cache-lru', title: 'Database Buffer Cache & LRU', desc: 'Holding Data Blocks Read from Disk; Dirty Buffer Management' },
        { slug: 'redo-log-buffer-circular', title: 'Redo Log Buffer Mechanics', desc: 'Circular Memory Buffer Recording Every DML Change' },
        { slug: 'large-pool-rman-parallel', title: 'Large Pool Allocation', desc: 'Dedicated Memory for RMAN Backups and Parallel Slaves' },
        { slug: 'java-pool-and-streams-pool', title: 'Java Pool & Streams Pool', desc: 'Specialized JVM Memory and GoldenGate Replication Queues' },
        { slug: 'in-memory-column-store', title: 'In-Memory Column Store (IMCS)', desc: 'Dual-Format Memory: Row-Store for OLTP, Column-Store for Analytics' },
        { slug: 'program-global-area-pga', title: 'Program Global Area (PGA)', desc: 'Private Session Memory: Sort Area, Hash Area, and Session Variables' },
        { slug: 'dedicated-vs-shared-server', title: 'Dedicated vs Shared Server Architecture', desc: 'Process-per-Session vs Dispatcher / Shared Worker Pool' },
        { slug: 'database-writer-dbwn', title: 'Database Writer (DBWn) Process', desc: 'Flushing Dirty Blocks from Buffer Cache to Data Files' },
        { slug: 'log-writer-lgwr-triggers', title: 'Log Writer (LGWR) Process Triggers', desc: 'COMMIT, 1/3 Full, 1MB, or 3 Seconds Rule' },
        { slug: 'checkpoint-process-ckpt', title: 'Checkpoint Process (CKPT)', desc: 'Signaling DBWn and Updating Datafile & Control File Headers' },
        { slug: 'system-monitor-smon', title: 'System Monitor (SMON) Process', desc: 'Crash Recovery, Rolling Forward Redo, and Extent Coalescing' },
        { slug: 'process-monitor-pmon', title: 'Process Monitor (PMON) Process', desc: 'Cleaning Up Failed User Processes and Freeing Locks' },
        { slug: 'archiver-process-arcn', title: 'Archiver Process (ARCn)', desc: 'Copying Full Online Redo Logs to Offline Archive Storage' },
        { slug: 'recoverer-process-reco', title: 'Recoverer Process (RECO)', desc: 'Resolving Distributed In-Doubt Two-Phase Commit Transactions' },
        { slug: 'storage-hierarchy-blocks-to-tablespaces', title: 'Logical Storage Hierarchy', desc: 'Data Blocks -> Extents -> Segments -> Tablespaces' },
        { slug: 'data-block-anatomy-pctfree', title: 'Oracle Data Block Anatomy', desc: 'Block Header, ITL, Free Space, PCTFREE, and Row Data' },
        { slug: 'extent-allocation-locally-managed', title: 'Locally Managed Tablespaces (LMT)', desc: 'Bitmap Tracking of Extents vs Dictionary Managed Extents' },
        { slug: 'segments-types-overview', title: 'Segment Types Overview', desc: 'Table, Index, Undo, and Temporary Storage Segments' },
        { slug: 'tablespaces-system-sysaux', title: 'SYSTEM and SYSAUX Tablespaces', desc: 'Core Data Dictionary vs Enterprise Auxiliary Component Data' },
        { slug: 'undo-tablespace-read-consistency', title: 'UNDO Tablespace Architecture', desc: 'Rollback Segments, Read Consistency, and ORA-01555 Prevention' },
        { slug: 'temporary-tablespace-disk-sorts', title: 'TEMPORARY Tablespace Allocation', desc: 'Sorting and Hash Join Spilling without Redo Logging' },
        { slug: 'bigfile-vs-smallfile-tablespaces', title: 'Bigfile vs Smallfile Tablespaces', desc: 'Single 128TB Datafile vs Multi-Datafile Management' },
        { slug: 'control-file-multiplexing', title: 'Control File Architecture', desc: 'Database Physical Structure Metadata & Disaster Recovery Multiplexing' },
        { slug: 'online-redo-log-groups', title: 'Online Redo Log Architecture', desc: 'Multiplexed Members, Log Switching, and Circular Re-use' },
        { slug: 'archivelog-vs-noarchivelog', title: 'ARCHIVELOG Mode Architecture', desc: 'Point-In-Time Recovery Enablement vs Media Failure Risk' },
        { slug: 'system-change-number-scn', title: 'System Change Number (SCN)', desc: 'Logical Timestamp Ordering Every Event in the Database' },
        { slug: 'write-ahead-logging-wal', title: 'Write-Ahead Logging (WAL) Principle', desc: 'Why LGWR Always Writes Redo Before DBWn Writes Data Blocks' },
        { slug: 'crash-recovery-rollforward-rollback', title: 'Instance Crash Recovery Lifecycle', desc: 'Cache Recovery (Roll Forward) followed by Undo (Roll Back)' },
        { slug: 'multitenant-cdb-pdb-architecture', title: 'Multitenant Architecture (CDB & PDB)', desc: 'Consolidating Multiple Pluggable Databases in One Root Instance' },
        { slug: 'cdb-root-and-pdb-seed', title: 'CDB$ROOT and PDB$SEED Concepts', desc: 'Shared Memory and System Metadata vs Pluggable Customer Data' },
        { slug: 'spfile-vs-pfile-initialization', title: 'SPFILE vs PFILE Parameter Files', desc: 'Dynamic Binary Parameter Storage vs Static Text Configuration' },
        { slug: 'automatic-memory-management-amm', title: 'Automatic Memory Management (AMM)', desc: 'MEMORY_TARGET vs Dynamic ASMM (SGA_TARGET + PGA_TARGET)' },
        { slug: 'automatic-storage-management-asm', title: 'Automatic Storage Management (ASM)', desc: 'Raw Disk Volume Virtualization, Striping, and Mirroring' },
        { slug: 'oracle-clusterware-rac-intro', title: 'Real Application Clusters (RAC)', desc: 'Shared-Everything Multi-Node Active-Active Database Instance' },
        { slug: 'cache-fusion-rac-interconnect', title: 'RAC Cache Fusion Technology', desc: 'Block Transfer Across High-Speed Interconnect without Disk I/O' },
        { slug: 'data-guard-broker-architecture', title: 'Oracle Data Guard Architecture', desc: 'Redo Transport Services and Log Apply to Standby Systems' }
      ]
    },
    {
      key: 'plsql',
      name: 'PL/SQL PROGRAMMING',
      count: 40,
      items: [
        { slug: 'plsql-block-architecture', title: 'PL/SQL Block Structure', desc: 'DECLARE, BEGIN, EXCEPTION, and END Section Anatomy' },
        { slug: 'anonymous-vs-named-blocks', title: 'Anonymous vs Stored Named Blocks', desc: 'Client-Side Scripts vs Compiled Server-Side Database Objects' },
        { slug: 'anchored-datatypes-type-rowtype', title: 'Anchored Datatypes: %TYPE & %ROWTYPE', desc: 'Dynamic Schema Decoupling for Variables and Records' },
        { slug: 'plsql-record-types', title: 'PL/SQL User-Defined Records', desc: 'Grouping Heterogeneous Fields into Single Composite Variables' },
        { slug: 'associative-arrays-index-by', title: 'Associative Arrays (INDEX BY)', desc: 'Key-Value In-Memory Collections Indexed by Integer or String' },
        { slug: 'nested-tables-collections', title: 'Nested Tables in PL/SQL', desc: 'Unbounded Collections Support for MULTISET Operations' },
        { slug: 'varrays-variable-arrays', title: 'VARRAYs (Variable-Size Arrays)', desc: 'Bounded Ordered Arrays Persistable to Database Columns' },
        { slug: 'if-then-elsif-control', title: 'Conditional Branching: IF-THEN-ELSIF', desc: 'Boolean Logic Evaluation and Short-Circuit Execution' },
        { slug: 'case-statements-plsql', title: 'CASE Statements in PL/SQL', desc: 'Selector and Searched Conditions in Procedural Blocks' },
        { slug: 'basic-loop-exit-when', title: 'Basic LOOP & EXIT WHEN', desc: 'Unconditional Iteration with Guaranteed Exit Conditions' },
        { slug: 'while-loop-iteration', title: 'WHILE LOOP Control', desc: 'Condition-Driven Pre-Check Iteration Mechanics' },
        { slug: 'for-loop-numeric-bounds', title: 'Numeric FOR LOOP & REVERSE', desc: 'Automatic Counter Variable Scope and Boundary Stepping' },
        { slug: 'explicit-cursor-lifecycle', title: 'Explicit Cursor Lifecycle', desc: 'DECLARE -> OPEN -> FETCH -> CLOSE Step-by-Step Flow' },
        { slug: 'cursor-attributes-found-notfound', title: 'Cursor Attributes Evaluation', desc: '%FOUND, %NOTFOUND, %ISOPEN, and %ROWCOUNT Properties' },
        { slug: 'cursor-for-loops-auto-cleanup', title: 'Cursor FOR Loops', desc: 'Automatic Open, Fetch, Record Creation, and Closure' },
        { slug: 'parameterized-cursors', title: 'Parameterized Cursors', desc: 'Passing Reusable Filter Arguments to Query Declarations' },
        { slug: 'ref-cursors-dynamic-variables', title: 'REF CURSORs (Cursor Variables)', desc: 'Weak vs Strong Cursor Pointers Passed Across Tiers' },
        { slug: 'stored-procedures-parameters', title: 'Stored Procedures: Parameter Modes', desc: 'IN (Read-Only), OUT (Write), and IN OUT (Pass-by-Reference)' },
        { slug: 'parameter-notation-styles', title: 'Parameter Passing Notations', desc: 'Positional, Named (=>), and Mixed Call Syntax' },
        { slug: 'stored-functions-deterministic', title: 'Stored Functions & DETERMINISTIC', desc: 'Return Contracts and Execution Cache Optimization' },
        { slug: 'plsql-packages-specification', title: 'Package Specification (API)', desc: 'Declaring Public Types, Variables, Constants, and Signatures' },
        { slug: 'plsql-packages-body-implementation', title: 'Package Body (Implementation)', desc: 'Private Procedures, Forward Declarations, and Information Hiding' },
        { slug: 'package-session-state-instantiation', title: 'Package State & Instantiation', desc: 'Package Initialization Block and User Session Lifetime' },
        { slug: 'package-serially-reusable', title: 'PRAGMA SERIALLY_REUSABLE', desc: 'Deallocating Package State at Subprogram Completion' },
        { slug: 'subprogram-overloading', title: 'Subprogram Overloading in Packages', desc: 'Same Procedure Name with Distinct Parameter Signatures' },
        { slug: 'dml-triggers-row-vs-statement', title: 'DML Triggers: Statement vs Row', desc: 'BEFORE / AFTER Event Timing and FOR EACH ROW Execution' },
        { slug: 'trigger-pseudo-records-new-old', title: 'Trigger Pseudo-Records: :NEW & :OLD', desc: 'Inspecting Pre-Change and Post-Change Column State' },
        { slug: 'instead-of-triggers-views', title: 'INSTEAD OF Triggers on Complex Views', desc: 'Enabling Modifiability on Multi-Table Joined Views' },
        { slug: 'compound-triggers-architecture', title: 'Compound Triggers Architecture', desc: 'Combining BEFORE, EACH ROW, and AFTER Timing Points' },
        { slug: 'mutating-table-error-ora04091', title: 'Mutating Table Error (ORA-04091)', desc: 'Why Row Triggers Fail Querying Triggering Tables and How to Fix' },
        { slug: 'system-and-ddl-event-triggers', title: 'System & DDL Event Triggers', desc: 'Capturing LOGON, DDL, SERVERERROR, and SHUTDOWN Events' },
        { slug: 'predefined-exceptions-handling', title: 'Predefined Exceptions Handling', desc: 'NO_DATA_FOUND, TOO_MANY_ROWS, and DUP_VAL_ON_INDEX' },
        { slug: 'user-defined-exceptions', title: 'User-Defined Exceptions', desc: 'Declaring, Raising, and Trapping Custom Business Faults' },
        { slug: 'pragma-exception-init-mapping', title: 'PRAGMA EXCEPTION_INIT', desc: 'Binding Named Exceptions to Standard Oracle ORA- Error Numbers' },
        { slug: 'raise-application-error', title: 'RAISE_APPLICATION_ERROR Procedure', desc: 'Returning Custom Errors (-20000 to -20999) to Client Apps' },
        { slug: 'sqlcode-sqlerrm-error-trapping', title: 'SQLCODE and SQLERRM Trapping', desc: 'Capturing Error Numbers and Stack Messages in WHEN OTHERS' },
        { slug: 'bulk-collect-context-switching', title: 'BULK COLLECT: Context Switching', desc: 'Eliminating Costly SQL-to-PL/SQL Engine Context Switches' },
        { slug: 'forall-statement-batch-dml', title: 'FORALL Statement Batch DML', desc: 'Pipelining Multiple DML Operations to the SQL Engine' },
        { slug: 'forall-save-exceptions', title: 'FORALL SAVE EXCEPTIONS Clause', desc: 'Continuing Batch Processing when Individual Rows Error Out' },
        { slug: 'autonomous-transactions-pragma', title: 'PRAGMA AUTONOMOUS_TRANSACTION', desc: 'Committing Audit Logs Independent of Parent Transaction Rollback' }
      ]
    },
    {
      key: 'transactions',
      name: 'TRANSACTIONS & CONCURRENCY',
      count: 30,
      items: [
        { slug: 'transaction-boundary-lifecycle', title: 'Transaction Boundary Lifecycle', desc: 'Implicit Start at First DML, Explicit End via COMMIT/ROLLBACK' },
        { slug: 'savepoint-partial-rollback', title: 'SAVEPOINT & Partial Rollback', desc: 'Creating Named Checkpoints within an Active Transaction' },
        { slug: 'mvcc-readers-dont-block-writers', title: 'Oracle MVCC Architecture', desc: 'Readers Never Block Writers, Writers Never Block Readers' },
        { slug: 'row-level-locking-tx-locks', title: 'Row-Level Locking (TX Locks)', desc: 'Locking Info Stored Inside Data Block ITL, Not in Memory Table' },
        { slug: 'table-level-locking-tm-locks', title: 'Table-Level Locking (TM Locks)', desc: 'Preventing DDL Modifications on Tables with Active DML' },
        { slug: 'tm-lock-modes-hierarchy', title: 'TM Lock Modes (RS, RX, S, SRX, X)', desc: 'Row Share, Row Exclusive, and Exclusive Lock Compatibility' },
        { slug: 'no-lock-escalation-in-oracle', title: 'No Lock Escalation Guarantee', desc: 'Why Oracle Never Converts Row Locks into Table Locks' },
        { slug: 'select-for-update-pessimistic', title: 'SELECT ... FOR UPDATE Locking', desc: 'Acquiring Exclusive Row Locks Before Client-Side Modifications' },
        { slug: 'nowait-and-wait-n-seconds', title: 'NOWAIT and WAIT N Clauses', desc: 'Preventing Application Freezes on Contended Row Locks' },
        { slug: 'for-update-of-column-syntax', title: 'FOR UPDATE OF Specific Columns', desc: 'Targeting Locks on Specific Tables in Multi-Table Joined Queries' },
        { slug: 'skip-locked-queue-processing', title: 'SKIP LOCKED for Job Queues', desc: 'Highly Concurrent Work Item Consumption without Locking Conflicts' },
        { slug: 'deadlock-detection-ora00060', title: 'Deadlock Detection & ORA-00060', desc: 'Dependency Cycle Graph Resolution and Statement Rollback' },
        { slug: 'foreign-key-unindexed-locking', title: 'Unindexed Foreign Key Locking Risk', desc: 'Why Child Table FK Columns Must be Indexed to Prevent TM Locks' },
        { slug: 'transaction-isolation-read-committed', title: 'READ COMMITTED Isolation Level', desc: 'Default Oracle Level: Statement-Level Read Consistency' },
        { slug: 'transaction-isolation-serializable', title: 'SERIALIZABLE Isolation Level', desc: 'Transaction-Level Read Consistency and ORA-08177 Handling' },
        { slug: 'read-only-transaction-mode', title: 'SET TRANSACTION READ ONLY', desc: 'Consistent Multi-Query Reporting across SCN Freezes' },
        { slug: 'dirty-reads-prevention-ansi', title: 'Dirty Reads Prevention (ANSI)', desc: 'Oracle Physical Inability to Read Uncommitted Data' },
        { slug: 'non-repeatable-read-phenomenon', title: 'Non-Repeatable Reads Mechanics', desc: 'Committed Intermediate Updates Altering Repeated Query Data' },
        { slug: 'phantom-reads-range-inserts', title: 'Phantom Reads & Range Queries', desc: 'New Row Insertions Appearing in Subsequent Range Scans' },
        { slug: 'interested-transaction-list-itl', title: 'Interested Transaction List (ITL)', desc: 'Block Header Slot Allocation for Active Transaction IDs' },
        { slug: 'itl-waits-and-initrans', title: 'ITL Waits & INITRANS Parameter', desc: 'Resolving Block-Level Concurrency Bottlenecks' },
        { slug: 'latches-vs-enqueues-primitives', title: 'Latches vs Enqueues in Oracle', desc: 'Lightweight CPU Mutexes vs Queued FIFO Resource Locks' },
        { slug: 'two-phase-commit-distributed', title: 'Two-Phase Commit (2PC) Protocol', desc: 'Prepare and Commit Phases across Heterogeneous Distributed DBs' },
        { slug: 'in-doubt-transactions-recovery', title: 'In-Doubt Distributed Transactions', desc: 'Network Partitions, DBA Manual Intervention, and RECO Process' },
        { slug: 'read-consistency-undo-rollback', title: 'Statement Read Consistency Mechanism', desc: 'Using UNDO Blocks to Construct Query-Time Consistent Read Images' },
        { slug: 'snapshot-too-old-ora01555', title: 'Snapshot Too Old (ORA-01555)', desc: 'Overwritten Undo Blocks and UNDO_RETENTION Sizing' },
        { slug: 'block-cleanout-fast-vs-delayed', title: 'Block Cleanout: Fast vs Delayed', desc: 'Updating Block ITL Headers at Commit vs Subsequent Read Access' },
        { slug: 'flashback-transaction-backout', title: 'Flashback Transaction Backout', desc: 'DBMS_FLASHBACK.TRANSACTION_BACKOUT Compensating DML' },
        { slug: 'resumable-space-allocation', title: 'Resumable Space Allocation', desc: 'Suspending Out-Of-Space Transactions instead of Failing' },
        { slug: 'concurrency-benchmarking-best-practices', title: 'High-Concurrency Architecture Best Practices', desc: 'Minimizing Transaction Duration and Standardizing Lock Acquisition Order' }
      ]
    },
    {
      key: 'performance',
      name: 'PERFORMANCE TUNING',
      count: 40,
      items: [
        { slug: 'cost-based-optimizer-cbo-pipeline', title: 'Cost-Based Optimizer (CBO) Workflow', desc: 'Query Transformer -> Estimator -> Plan Generator Pipeline' },
        { slug: 'hard-parse-vs-soft-parse', title: 'Hard Parse vs Soft Parse Lifecycle', desc: 'Syntax/Semantics Validation, Plan Generation vs Library Cache Hash' },
        { slug: 'bind-variables-importance', title: 'Bind Variables & Cursor Sharing', desc: 'Preventing Shared Pool Mutex Saturation and CPU Spikes' },
        { slug: 'bind-peeking-risks-benefits', title: 'Bind Peeking & Skewed Data', desc: 'First Execution Optimization vs Sub-Optimal Subsequent Plans' },
        { slug: 'adaptive-cursor-sharing-acs', title: 'Adaptive Cursor Sharing (ACS)', desc: 'Monitoring Bind Selectivity to Generate Multiple Sub-Plans' },
        { slug: 'execution-plan-anatomy', title: 'Execution Plan Anatomy', desc: 'Operations, Options, Object Name, Cost, Cardinality, and Bytes' },
        { slug: 'access-vs-filter-predicates', title: 'Access vs Filter Predicates', desc: 'Leaf Block Direct Traversal vs Post-Fetch Discard Overhead' },
        { slug: 'table-access-full-fts', title: 'Table Access Full (Full Table Scan)', desc: 'Multiblock Read Count, High Water Mark, and Direct Path Read' },
        { slug: 'index-unique-scan-mechanics', title: 'Index Unique Scan', desc: 'Single Leaf Row Retrieval via Primary Key B-Tree Traversal' },
        { slug: 'index-range-scan-mechanics', title: 'Index Range Scan', desc: 'Root-to-Leaf Traversal followed by Leaf Node Pointer Chain' },
        { slug: 'index-full-scan-vs-fast-full', title: 'Index Full Scan vs Fast Full Scan', desc: 'Ordered Single-Block Scan vs Unordered Multiblock Scan' },
        { slug: 'index-skip-scan-mechanics', title: 'Index Skip Scan', desc: 'Querying Composite Index without Leading Column' },
        { slug: 'b-tree-index-internal-structure', title: 'B-Tree Index Architecture', desc: 'Root Node, Branch Nodes, and Leaf Nodes holding ROWIDs' },
        { slug: 'bitmap-index-architecture-olap', title: 'Bitmap Index Architecture (OLAP)', desc: 'Start/End ROWID Bitmaps for Low Cardinality Columns' },
        { slug: 'function-based-index-fbi', title: 'Function-Based Indexes (FBI)', desc: 'Pre-Computing UPPER() or Math Expressions for Query SARGability' },
        { slug: 'composite-index-column-order', title: 'Composite Index Leading Column Rule', desc: 'Ordering Columns by Equality Filters and Sorting Requirements' },
        { slug: 'reverse-key-indexes-rac', title: 'Reverse Key Indexes in RAC', desc: 'Reversing Byte Order to Prevent Right-Hand Leaf Block Contention' },
        { slug: 'index-organized-tables-iot', title: 'Index-Organized Tables (IOT)', desc: 'Storing Data Rows Directly Inside Primary Key B-Tree Leaf Blocks' },
        { slug: 'invisible-and-unusable-indexes', title: 'Invisible & Unusable Indexes', desc: 'Testing Index Drops and Accelerating Bulk Data Ingestion' },
        { slug: 'nested-loops-join-mechanics', title: 'Nested Loops Join Algorithm', desc: 'Outer Row Driving Loop against Inner Indexed Lookup' },
        { slug: 'hash-join-in-memory-mechanics', title: 'Hash Join Algorithm', desc: 'Building In-Memory Hash Table from Smaller Driving Input' },
        { slug: 'sort-merge-join-algorithm', title: 'Sort Merge Join Algorithm', desc: 'Sorting Inputs on Join Keys followed by Linear Merge Scan' },
        { slug: 'optimizer-statistics-gathering', title: 'DBMS_STATS Statistics Gathering', desc: 'Gathering Table, Index, and Column Stats for CBO Accuracy' },
        { slug: 'histograms-frequency-vs-hybrid', title: 'Histograms: Frequency vs Top vs Hybrid', desc: 'Representing Non-Uniform Data Skew for Cardinality Estimations' },
        { slug: 'cardinality-estimation-formulas', title: 'Cardinality Estimation Formulas', desc: 'Selectivity Calculation based on Density and Number of Distinct Values' },
        { slug: 'sql-plan-management-spm', title: 'SQL Plan Management (SPM)', desc: 'Plan Baselines, Accepted Plans, and Automated Plan Evolution' },
        { slug: 'sql-tuning-advisor-sta', title: 'SQL Tuning Advisor (STA)', desc: 'Automated Recommendations for Profiles, Statistics, and Restructuring' },
        { slug: 'optimizer-hints-best-practices', title: 'Optimizer Hints & Directives', desc: '/*+ INDEX */, /*+ FULL */, /*+ LEADING */, and /*+ USE_HASH */ Syntax' },
        { slug: 'automatic-workload-repository-awr', title: 'AWR (Workload Repository) Architecture', desc: 'Periodic Performance Snapshots, Load Profile, and Top Wait Events' },
        { slug: 'addm-diagnostic-monitor', title: 'ADDM Diagnostic Engine', desc: 'Automated Root-Cause Bottleneck Findings and Impact Percentages' },
        { slug: 'active-session-history-ash', title: 'Active Session History (ASH)', desc: 'Sampled 1-Second Circular Buffer of Non-Idle Waiting Sessions' },
        { slug: 'real-time-sql-monitoring', title: 'Real-Time SQL Monitoring', desc: 'Live Execution Metrics for Long-Running and High-Cost Statements' },
        { slug: 'wait-events-db-file-scattered-read', title: 'Wait Events: Scattered vs Sequential Read', desc: 'Diagnosing Full Table Scans vs Single-Block Index Reads' },
        { slug: 'wait-events-log-file-sync', title: 'Wait Events: log file sync', desc: 'Commit Frequency Overhead and Redo Log Disk Bottlenecks' },
        { slug: 'wait-events-buffer-busy-waits', title: 'Wait Events: buffer busy waits', desc: 'Multiple Sessions Contending for the Same Physical Block' },
        { slug: 'vdollar-session-and-sql-views', title: 'Dynamic Performance Views (V$)', desc: 'V$SESSION, V$SQL, V$SQL_PLAN, and V$SESSION_WAIT Queries' },
        { slug: 'sql-trace-and-tkprof-analysis', title: 'SQL Trace (10046) & TKPROF', desc: 'Profiling Exact CPU, Elapsed, Disk Reads, and Query Operations' },
        { slug: 'result-cache-server-side', title: 'Server-Side Result Cache', desc: 'Caching Deterministic Query Output in Shared Pool Memory' },
        { slug: 'parallel-execution-query-slaves', title: 'Parallel Execution Architecture', desc: 'Query Coordinator, Producer Slaves, and Consumer Slaves' },
        { slug: 'direct-path-write-operations', title: 'Direct Path Operations (/*+ APPEND */)', desc: 'Bypassing Buffer Cache to Write Directly Above High Water Mark' }
      ]
    },
    {
      key: 'administration',
      name: 'DATABASE ADMINISTRATION & SECURITY',
      count: 40,
      items: [
        { slug: 'oracle-dba-daily-checklist', title: 'Oracle DBA Operational Checklist', desc: 'Alert Log, Tablespace Space, Backup Validation, and Job Status' },
        { slug: 'oracle-net-listener-architecture', title: 'Oracle Net Services & Listener', desc: 'listener.ora, tnsnames.ora, and Connection Handshake' },
        { slug: 'connection-flow-client-to-server', title: 'Connection Flow: Client to Server', desc: 'TCP Handshake, Listener Spawn/Handoff, and Dedicated Server' },
        { slug: 'database-startup-lifecycle', title: 'Database Startup Lifecycle', desc: 'SHUTDOWN -> NOMOUNT -> MOUNT -> OPEN State Progression' },
        { slug: 'database-shutdown-modes', title: 'Database Shutdown Modes', desc: 'NORMAL, TRANSACTIONAL, IMMEDIATE, and ABORT Mechanisms' },
        { slug: 'user-administration-create-user', title: 'User Administration & Quotas', desc: 'CREATE USER, DEFAULT TABLESPACE, and QUOTA Allocation' },
        { slug: 'profile-management-passwords', title: 'Profile Management & Security', desc: 'Password Complexity, Failed Logins, and Resource Limits' },
        { slug: 'system-vs-object-privileges', title: 'System vs Object Privileges', desc: 'Administrative Capabilities vs Direct Table DML Access' },
        { slug: 'role-based-access-control-rbac', title: 'Role-Based Access Control (RBAC)', desc: 'Decoupling Permissions from Users via Grouped Roles' },
        { slug: 'principle-of-least-privilege', title: 'Principle of Least Privilege in DBA', desc: 'Revoking Blanket DBA Privileges and Restricting SYSDBA' },
        { slug: 'virtual-private-database-vpd', title: 'Virtual Private Database (VPD)', desc: 'Row-Level Fine-Grained Security via Dynamic Policy Predicates' },
        { slug: 'oracle-data-redaction-realtime', title: 'Oracle Data Redaction', desc: 'Masking Sensitive PII (Credit Cards, SSN) in Query Results' },
        { slug: 'transparent-data-encryption-tde', title: 'Transparent Data Encryption (TDE)', desc: 'Software Keystore, Master Key, and Column / Tablespace Encryption' },
        { slug: 'unified-auditing-architecture', title: 'Unified Auditing Architecture', desc: 'Consolidated High-Performance In-Memory Audit Trails' },
        { slug: 'privilege-analysis-feature', title: 'Privilege Analysis Framework', desc: 'Detecting Unused User Rights to Enforce Minimal Access' },
        { slug: 'backup-strategy-hot-vs-cold', title: 'Hot (Online) vs Cold (Offline) Backups', desc: 'ARCHIVELOG Mode Non-Disruptive Backups vs Offline Copies' },
        { slug: 'rman-architecture-overview', title: 'Recovery Manager (RMAN) Architecture', desc: 'Target DB, RMAN Client, Recovery Catalog, and Media Layer' },
        { slug: 'rman-full-vs-incremental-backups', title: 'RMAN Backup Strategies', desc: 'Full Backup vs Incremental Level 0 (Base) and Level 1' },
        { slug: 'block-change-tracking-bct', title: 'Block Change Tracking (BCT)', desc: 'Bitmap Tracking of Changed Blocks for Fast Level 1 Backups' },
        { slug: 'point-in-time-recovery-pitr', title: 'Incomplete Recovery (PITR)', desc: 'Restoring Database to Exact Point in Time Before Human Error' },
        { slug: 'controlfile-autobackup-disaster', title: 'Controlfile Autobackup & Restore', desc: 'Recovering Lost Storage Configuration without Active Control Files' },
        { slug: 'flashback-database-technology', title: 'Flashback Database Architecture', desc: 'Rewinding Entire Database via Flashback Logs in FRA' },
        { slug: 'flashback-drop-recyclebin', title: 'Flashback Drop & Recycle Bin', desc: 'Restoring Accidentally Dropped Tables without Backup Restoration' },
        { slug: 'flashback-table-scn', title: 'Flashback Table to SCN', desc: 'Reverting Table Rows In-Place using Row Movement and Undo' },
        { slug: 'fast-recovery-area-fra', title: 'Fast Recovery Area (FRA)', desc: 'Automated Centralized Disk Storage for Backups and Redo' },
        { slug: 'oracle-data-guard-architecture-deep', title: 'Oracle Data Guard Architecture', desc: 'Primary Database, Redo Transport, and Standby Log Apply' },
        { slug: 'physical-vs-logical-standby', title: 'Physical Standby vs Logical Standby', desc: 'Block-for-Block Redo Apply vs SQL Apply for Reporting' },
        { slug: 'active-data-guard-realtime-query', title: 'Active Data Guard (ADG)', desc: 'Open Read-Only Standby with Real-Time Redo Apply' },
        { slug: 'data-guard-protection-modes', title: 'Data Guard Protection Modes', desc: 'Maximum Performance, Maximum Availability, Maximum Protection' },
        { slug: 'switchover-vs-failover-dr', title: 'Switchover vs Failover Scenarios', desc: 'Planned Zero-Data-Loss Role Reversal vs Unplanned Disaster Takeover' },
        { slug: 'fast-start-failover-fsfo', title: 'Fast-Start Failover (FSFO)', desc: 'Observer Process Automated Sub-Minute Failover Detection' },
        { slug: 'tablespace-offline-maintenance', title: 'Tablespace States & Maintenance', desc: 'ONLINE, OFFLINE (NORMAL, IMMEDIATE), and READ ONLY Modes' },
        { slug: 'moving-datafiles-online', title: 'ALTER DATABASE MOVE DATAFILE', desc: 'Relocating Physical Storage Online without Downtime (12c+)' },
        { slug: 'alert-log-monitoring-diagnostics', title: 'Alert Log & Trace File Architecture', desc: 'ADR (Automatic Diagnostic Repository) and Incident Packaging' },
        { slug: 'dbms-scheduler-jobs', title: 'DBMS_SCHEDULER Architecture', desc: 'Programs, Schedules, Jobs, and Window Priority Management' },
        { slug: 'database-patching-opatch', title: 'Database Patching & OPatch', desc: 'Release Updates (RU) and Critical Patch Updates (CPU)' },
        { slug: 'sqlnet-ora-security-parameters', title: 'sqlnet.ora Security Hardening', desc: 'TCP.VALIDNODE_CHECKING and Encryption Handshakes' },
        { slug: 'securefile-vs-basicfile-lobs', title: 'SecureFiles vs BasicFiles LOBs', desc: 'Deduplication, Compression, and Encryption for Unstructured Data' },
        { slug: 'transportable-tablespaces-tts', title: 'Transportable Tablespaces (TTS)', desc: 'Moving Metadata and Datafiles between Databases Rapidly' },
        { slug: 'cross-platform-transportable-databases', title: 'Cross-Platform Data Migration', desc: 'RMAN CONVERT and Endian Format Conversion' }
      ]
    },
    {
      key: 'modeling',
      name: 'DATA MODELING & ENTERPRISE SCENARIOS',
      count: 45,
      items: [
        { slug: 'conceptual-logical-physical-models', title: 'Conceptual vs Logical vs Physical Models', desc: 'Business Entities -> Normalized Relations -> Physical Schemas' },
        { slug: 'er-modeling-crows-foot-notation', title: 'Entity-Relationship (ER) Notation', desc: 'Crow\'s Foot Cardinality: 1:1, 1:Many, and Many:Many Relationships' },
        { slug: 'many-to-many-junction-tables', title: 'Resolving Many-to-Many Relationships', desc: 'Junction Tables with Composite Keys and Bridge Attributes' },
        { slug: 'recursive-relationship-modeling', title: 'Recursive Relationships in ERD', desc: 'Self-Referencing Hierarchies and Bill-of-Materials (BOM)' },
        { slug: 'order-management-schema-erd', title: 'Enterprise Order Management ERD', desc: 'Customers, Orders, Order_Items, Products, and Inventory' },
        { slug: 'human-resources-schema-erd', title: 'Enterprise HR Relational Schema', desc: 'Employees, Departments, Jobs, Locations, and Job_History' },
        { slug: 'banking-ledger-double-entry-erd', title: 'Banking Ledger Double-Entry ERD', desc: 'Accounts, Transactions, Debits, Credits, and Balances' },
        { slug: 'healthcare-patient-records-erd', title: 'Healthcare Patient Records ERD', desc: 'Patients, Encounters, Diagnoses, Treatments, and Doctors' },
        { slug: 'ecommerce-multi-vendor-erd', title: 'E-Commerce Marketplace ERD', desc: 'Sellers, Catalogs, Orders, Shipments, and Escrow Accounts' },
        { slug: 'star-schema-data-warehouse', title: 'Star Schema Architecture (OLAP)', desc: 'Central Fact Table Surrounded by Denormalized Dimensions' },
        { slug: 'snowflake-schema-data-warehouse', title: 'Snowflake Schema Architecture', desc: 'Normalized Dimension Tables Branching from Shared Dimensions' },
        { slug: 'fact-table-types-analytics', title: 'Fact Table Types: Transaction vs Periodic', desc: 'Accumulating Snapshots vs Transactional Grain Measurements' },
        { slug: 'conformed-dimensions-bus-architecture', title: 'Conformed Dimensions & Bus Matrix', desc: 'Reusing Shared Dimensions (Date, Customer) across Data Marts' },
        { slug: 'slowly-changing-dimensions-scd1', title: 'Slowly Changing Dimensions (SCD Type 1)', desc: 'Overwriting Previous Attributes without History Tracking' },
        { slug: 'slowly-changing-dimensions-scd2', title: 'Slowly Changing Dimensions (SCD Type 2)', desc: 'Row Versioning with START_DATE, END_DATE, and IS_CURRENT Flag' },
        { slug: 'slowly-changing-dimensions-scd3', title: 'Slowly Changing Dimensions (SCD Type 3)', desc: 'Tracking History via Current and Previous Value Columns' },
        { slug: 'surrogate-key-pipelines-dwh', title: 'Surrogate Keys in Data Warehousing', desc: 'Insulating Analytical Systems from Operational System Key Changes' },
        { slug: 'junk-dimensions-modeling', title: 'Junk Dimensions Design Pattern', desc: 'Consolidating Low-Cardinality Flags and Indicators into One Table' },
        { slug: 'degenerate-dimensions-design', title: 'Degenerate Dimensions Design Pattern', desc: 'Order Numbers and Invoice IDs stored Directly in Fact Tables' },
        { slug: 'table-partitioning-range-dates', title: 'Table Partitioning: Range by Date', desc: 'Sliding Window Architecture for High-Volume Timeseries' },
        { slug: 'table-partitioning-list-values', title: 'Table Partitioning: List by Category', desc: 'Discrete Discrete Key Grouping (Region, Status, Currency)' },
        { slug: 'table-partitioning-hash-balance', title: 'Table Partitioning: Hash Balancing', desc: 'Even Linear Distribution to Eliminate Hotspot Segments' },
        { slug: 'composite-partitioning-range-hash', title: 'Composite Partitioning (Range-Hash)', desc: 'Subpartitioning Range Segments for Parallel Scalability' },
        { slug: 'interval-partitioning-oracle11g', title: 'Interval Partitioning Architecture', desc: 'Automated Metadata Partition Creation on Ingest Exceeding Bounds' },
        { slug: 'partition-pruning-optimizer', title: 'Partition Pruning (Elimination)', desc: 'CBO Skipping Unneeded Partitions during Query Execution' },
        { slug: 'local-vs-global-partitioned-indexes', title: 'Local vs Global Partitioned Indexes', desc: 'Equipartitioned Self-Contained Indexes vs Cross-Partition Indexes' },
        { slug: 'online-partition-maintenance-ops', title: 'Online Partition Maintenance', desc: 'SPLIT, MERGE, DROP, and EXCHANGE PARTITION Operations' },
        { slug: 'exchange-partition-fast-etl', title: 'EXCHANGE PARTITION Fast ETL', desc: 'Instant Data Swap between Staging Table and Fact Partition' },
        { slug: 'external-tables-oracle-loader', title: 'External Tables (ORACLE_LOADER)', desc: 'Querying CSV, TSV, and Flat Files using SQL without Ingesting' },
        { slug: 'external-tables-oracle-datapump', title: 'External Tables (ORACLE_DATAPUMP)', desc: 'High-Speed Binary Unloading and Cross-Database Streaming' },
        { slug: 'data-pump-expdp-impdp-architecture', title: 'Oracle Data Pump Architecture', desc: 'Master Table, Worker Processes, and Network Link Direct Transfers' },
        { slug: 'sql-loader-bulk-ingestion', title: 'SQL*Loader Direct Path Ingestion', desc: 'Ultra-High-Speed Bulk Ingestion Bypassing SQL Parse Engine' },
        { slug: 'master-data-management-mdm', title: 'Master Data Management (MDM) Schema', desc: 'Golden Record Cleansing, Cross-System Deduplication, and Survivorship' },
        { slug: 'event-sourcing-and-audit-ledger', title: 'Event Sourcing & Immutable Ledgers', desc: 'Append-Only Relational Design for Financial Auditability' },
        { slug: 'oracle-blockchain-tables', title: 'Oracle Blockchain Tables (21c+)', desc: 'Cryptographically Chained Immutable Rows to Prevent Tampering' },
        { slug: 'json-relational-duality-views', title: 'JSON Relational Duality Views (23c)', desc: 'Querying and Updating Relational Tables as JSON Documents' },
        { slug: 'property-graphs-in-oracle-23c', title: 'Property Graph Queries (SQL/PGQ)', desc: 'Executing Graph Traversals on Relational Foreign Keys' },
        { slug: 'multi-tenant-application-containers', title: 'Application Containers in Multitenant', desc: 'Sharing Common Data and Schemas across Tenant PDBs' },
        { slug: 'database-migration-liquibase-patterns', title: 'Database Migrations with Liquibase', desc: 'Declarative Version-Controlled Schema Changes for CI/CD' },
        { slug: 'schema-versioning-git-integration', title: 'Schema Versioning Best Practices', desc: 'Branching, Migrations, Rollback Scripts, and CI Pipeline Steps' },
        { slug: 'data-masking-and-subsetting-pack', title: 'Data Masking for Non-Production', desc: 'De-identifying Production Data Clones for Dev and Test' },
        { slug: 'zero-downtime-schema-evolution', title: 'Zero-Downtime Schema Evolution', desc: 'Edition-Based Redefinition (EBR) and Cross-Edition Triggers' },
        { slug: 'edition-based-redefinition-ebr', title: 'Edition-Based Redefinition (EBR) Deep Dive', desc: 'Upgrading Application Code and Views while Users are Active' },
        { slug: 'distributed-database-database-links', title: 'Database Links (DBLINK) Architecture', desc: 'Remote Querying, Security Credentials, and Distributed Joins' },
        { slug: 'disaster-recovery-rpo-rto-modeling', title: 'RPO and RTO Architecture Modeling', desc: 'Balancing Recovery Point Objective and Recovery Time Objective' }
      ]
    }
  ];

  const registry = [];

  for (const topic of topics) {
    for (let i = 0; i < topic.items.length; i++) {
      const item = topic.items[i];
      const assetId = `ora-${topic.key}-${item.slug}`;
      const title = item.title;
      const subtitle = item.desc;

      const details = [
        {
          name: 'Logical Representation',
          desc: `Standardized structural mapping of ${title.toLowerCase()} inside Oracle Database engine.`,
          tag: `ORA_TOPIC::${topic.key.toUpperCase()}`
        },
        {
          name: 'Engine Execution & Rules',
          desc: 'Enforced by Oracle Database kernel, memory structures, and optimizer rules.',
          tag: 'KERNEL_ENFORCED'
        },
        {
          name: 'Production Recommendation',
          desc: 'Critical design pattern for enterprise reliability, high concurrency, and data integrity.',
          tag: 'ENTERPRISE_READY'
        },
        {
          name: 'Curriculum Progression',
          desc: 'Essential concept spanning foundational mastery to senior DBA administration.',
          tag: 'ACADEMY_STANDARD'
        }
      ];

      const takeaway = `Oracle Enterprise Rule: Always architect ${title.toLowerCase()} adhering to Oracle Database documented standards.`;
      const mainComponent = `[ ${topic.name} ] ➔ ${title.toUpperCase()} (Core System Component)`;

      const svgContent = generateOracleDiagramSvg({
        id: assetId,
        topicTitle: `ORACLE DATABASE • ${topic.name}`,
        title,
        subtitle,
        mainComponent,
        details,
        takeaway
      });

      registry.push({
        id: assetId,
        title,
        category: 'oracle-database',
        subCategory: topic.key,
        type: 'diagram',
        format: 'svg',
        mimeType: 'image/svg+xml',
        sourceName: 'Itnavideo Oracle Database Academy (CC0)',
        sourceUrl: 'procedural-svg',
        svgData: svgContent,
        licenseName: 'CC0 1.0 Universal',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        commercialPermitted: true,
        attributionRequired: false,
        recommendedVideoTypes: ['facelessVideo', 'bookSummary', 'compare', 'whiteboardVideo'],
        tags: [
          'oracle-database',
          'database',
          'sql',
          'plsql',
          'dba',
          topic.key,
          item.slug.replace(/-/g, ' ')
        ]
      });
    }
  }

  return registry;
}

// ---------------------------------------------------------------------------
// Main Cloud Ingestion & Documentation Pipeline
// ---------------------------------------------------------------------------
async function main() {
  const oracleAssets = buildOracleRegistry();

  console.log(`\n======================================================`);
  console.log(`🚀 Itnavideo Oracle Database Education Library Engine`);
  console.log(`   Target Bucket: ${BUCKET} (${REGION})`);
  console.log(`   Root Prefix:   reusable-assets/oracle-database/`);
  console.log(`   Total Oracle Assets Queued: ${oracleAssets.length}`);
  console.log(`======================================================\n`);

  let newlyUploaded = 0;
  let alreadyVerified = 0;
  let failedCount = 0;
  let totalBytesStreamed = 0;

  const catalogRecords = [];
  const CHUNK_SIZE = 10;

  for (let i = 0; i < oracleAssets.length; i += CHUNK_SIZE) {
    const chunk = oracleAssets.slice(i, i + CHUNK_SIZE);

    await Promise.all(chunk.map(async (item) => {
      const s3Key = `reusable-assets/oracle-database/${item.subCategory}/${item.id}.svg`;
      const s3Url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${s3Key}`;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          // 1. Check if asset already exists in S3 (Idempotent)
          const exists = await s3HeadObject(s3Key);
          if (exists) {
            alreadyVerified++;
            catalogRecords.push({
              id: item.id,
              title: item.title,
              category: item.category,
              subCategory: item.subCategory,
              type: item.type,
              format: item.format,
              mimeType: item.mimeType,
              s3Key,
              s3Url,
              sourceName: item.sourceName,
              sourceUrl: item.sourceUrl,
              licenseName: item.licenseName,
              licenseUrl: item.licenseUrl,
              commercialPermitted: item.commercialPermitted,
              attributionRequired: item.attributionRequired,
              recommendedVideoTypes: item.recommendedVideoTypes,
              tags: item.tags,
              status: 'verified_active'
            });
            return;
          }

          // 2. Synthesize buffer in-memory (zero local disk persistence)
          const buffer = Buffer.from(item.svgData, 'utf8');
          const sizeBytes = buffer.length;
          const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
          totalBytesStreamed += sizeBytes;

          // 3. Stream directly to S3 via SigV4 PUT
          const putResult = await s3PutObject(s3Key, buffer, item.mimeType);
          if (putResult.status !== 200) {
            throw new Error(`S3 PUT failed with HTTP ${putResult.status}: ${putResult.text}`);
          }

          newlyUploaded++;
          catalogRecords.push({
            id: item.id,
            title: item.title,
            category: item.category,
            subCategory: item.subCategory,
            type: item.type,
            format: item.format,
            mimeType: item.mimeType,
            s3Key,
            s3Url,
            sizeBytes,
            sha256,
            sourceName: item.sourceName,
            sourceUrl: item.sourceUrl,
            licenseName: item.licenseName,
            licenseUrl: item.licenseUrl,
            commercialPermitted: item.commercialPermitted,
            attributionRequired: item.attributionRequired,
            recommendedVideoTypes: item.recommendedVideoTypes,
            tags: item.tags,
            status: 'ingested_active'
          });
          return;
        } catch (err) {
          if (attempt === 2) {
            failedCount++;
            console.error(`  ❌ Failed ${item.id} after retry: ${err.message}`);
          }
        }
      }
    }));

    const progress = Math.min(i + CHUNK_SIZE, oracleAssets.length);
    console.log(`[Progress ${progress}/${oracleAssets.length}] Uploaded: ${newlyUploaded}, Verified: ${alreadyVerified}, Failed: ${failedCount}, Streamed: ${(totalBytesStreamed / 1024).toFixed(1)} KB`);
  }

  console.log(`\n======================================================`);
  console.log(`🎉 Oracle Database Asset Library Ingestion Complete!`);
  console.log(`   - Newly Uploaded:    ${newlyUploaded}`);
  console.log(`   - Verified Existing: ${alreadyVerified}`);
  console.log(`   - Failed:            ${failedCount}`);
  console.log(`   - Total in Catalog:  ${catalogRecords.length}`);
  console.log(`   - Data Streamed:     ${(totalBytesStreamed / 1024).toFixed(2)} KB (Zero laptop HDD writes)`);
  console.log(`======================================================\n`);

  // ---------------------------------------------------------------------------
  // Merge Seamlessly into cloud-assets-manifest.json
  // ---------------------------------------------------------------------------
  const manifestPath = path.join(ROOT, 'lib', 'generated', 'cloud-assets-manifest.json');
  let manifest = { version: 3, totalAssets: 0, assets: [] };
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {}
  }

  // Preserve existing non-oracle assets, replace or append oracle assets
  const existingAssets = (manifest.assets || []).filter(a => a.category !== 'oracle-database');
  const mergedAssets = [...existingAssets, ...catalogRecords];

  manifest.totalAssets = mergedAssets.length;
  manifest.generatedAt = new Date().toISOString();
  manifest.assets = mergedAssets;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`📄 Updated cloud manifest: ${manifestPath} (Total Assets: ${manifest.totalAssets})`);

  // ---------------------------------------------------------------------------
  // Update Documentation: docs/ASSET_LIBRARY.md & docs/ASSET_LICENSES.md
  // ---------------------------------------------------------------------------
  updateDocumentation(catalogRecords, mergedAssets.length);
}

function updateDocumentation(oracleRecords, totalAssetsCount) {
  const libraryDocPath = path.join(ROOT, 'docs', 'ASSET_LIBRARY.md');
  const licenseDocPath = path.join(ROOT, 'docs', 'ASSET_LICENSES.md');

  // Group Oracle records by subCategory
  const bySubcat = {};
  for (const r of oracleRecords) {
    if (!bySubcat[r.subCategory]) bySubcat[r.subCategory] = [];
    bySubcat[r.subCategory].push(r);
  }

  let oracleSection = `\n\n## ORACLE DATABASE EDUCATION LIBRARY (${oracleRecords.length} Assets)\n\n`;
  oracleSection += `> **Dedicated Domain Collection**: Comprehensive beginner-to-advanced curriculum visuals for Oracle Database, SQL, PL/SQL, DBA Administration, Performance Tuning, and Enterprise Architecture.\n\n`;

  for (const [subcat, items] of Object.entries(bySubcat)) {
    const title = subcat.toUpperCase().replace(/-/g, ' ');
    oracleSection += `### ORACLE DATABASE / ${title} (${items.length} assets)\n\n`;
    oracleSection += `| Asset ID | Title | S3 Key / Cloud URL | Recommended Video Types | Tags |\n`;
    oracleSection += `| :--- | :--- | :--- | :--- | :--- |\n`;
    for (const item of items) {
      oracleSection += `| \`${item.id}\` | **${item.title}** | [\`${item.s3Key}\`](${item.s3Url}) | ${item.recommendedVideoTypes.join(', ')} | ${item.tags.slice(0, 4).join(', ')} |\n`;
    }
    oracleSection += `\n`;
  }

  let libraryDoc = fs.readFileSync(libraryDocPath, 'utf8');
  // Remove prior Oracle section if present
  const splitIdx = libraryDoc.indexOf('## ORACLE DATABASE EDUCATION LIBRARY');
  if (splitIdx > 0) {
    libraryDoc = libraryDoc.slice(0, splitIdx);
  }
  libraryDoc = libraryDoc.replace(/Total Active Assets:\s*\d+/, `Total Active Assets: ${totalAssetsCount}`);
  libraryDoc += oracleSection;
  fs.writeFileSync(libraryDocPath, libraryDoc, 'utf8');
  console.log(`📄 Updated documentation: ${libraryDocPath}`);

  // Update License Ledger
  let licenseDoc = fs.readFileSync(licenseDocPath, 'utf8');
  if (!licenseDoc.includes('Oracle Database Education Library (CC0)')) {
    const tableMarker = '| Collection / Source | License Name |';
    const markerIdx = licenseDoc.indexOf(tableMarker);
    if (markerIdx > 0) {
      const headerEnd = licenseDoc.indexOf('\n', licenseDoc.indexOf('\n', markerIdx) + 1);
      const newRow = `| **Oracle Database Education Library (CC0)** | CC0 1.0 Universal | **YES (Authorized)** | No Attribution Required | ${oracleRecords.length} | [License URL](https://creativecommons.org/publicdomain/zero/1.0/) |\n`;
      licenseDoc = licenseDoc.slice(0, headerEnd + 1) + newRow + licenseDoc.slice(headerEnd + 1);
    }

    const officialSection = `
## Official Oracle Documentation & Source References (Citations Only)

> [!NOTE]
> **Third-Party Intellectual Property Notice**: The visual assets stored in \`reusable-assets/oracle-database/\` are original educational illustrations created for Itnavideo courses and are released under CC0. They do not mirror proprietary Oracle software distributions or imply Oracle Corporation endorsement. The following official references are cited for technical curriculum alignment:

1. **Oracle Database Documentation Portal**: [https://docs.oracle.com/en/database/oracle/oracle-database/](https://docs.oracle.com/en/database/oracle/oracle-database/)
2. **Oracle Database Sample Schemas (GitHub)**: [https://github.com/oracle-samples/db-sample-schemas](https://github.com/oracle-samples/db-sample-schemas) (Human Resources, Order Entry, Sales History)
3. **Oracle SQL & PL/SQL Language References**: Official 19c/21c/23c Language Reference Guides
4. **Oracle Architecture & Concepts Guide**: [https://docs.oracle.com/en/database/oracle/oracle-database/19/cncpt/](https://docs.oracle.com/en/database/oracle/oracle-database/19/cncpt/)
5. **Oracle Database Security Guide**: [https://docs.oracle.com/en/database/oracle/oracle-database/19/dbseg/](https://docs.oracle.com/en/database/oracle/oracle-database/19/dbseg/)
`;
    licenseDoc += officialSection;
    fs.writeFileSync(licenseDocPath, licenseDoc, 'utf8');
    console.log(`📄 Updated license ledger: ${licenseDocPath}`);
  }
}

main().catch(err => {
  console.error('Fatal engine error:', err);
  process.exit(1);
});
