import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

type AnyOverlay = {
  text?: string;
  body?: string;
  label?: string;
  frameText?: string;
  frameValue?: string;
  frameItems?: string[];
  frameLabel?: string;
  visualType?: string;
  sceneType?: string;
  type?: string;
};

type VisualScene = {
  start?: number;
  end?: number;
  visualType?: string;
  frameText?: string;
  frameValue?: string;
  frameItems?: string[];
  frameLabel?: string;
  scriptText?: string;
  showWhat?: string;
};

type Props = {
  overlay?: AnyOverlay;
  visualPlan?: unknown;
  time?: number;
};

type Data = {
  visualType: string;
  main: string;
  items: string[];
};

const appear = (frame: number, start: number) =>
  interpolate(frame, [start, start + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const clean = (value: unknown) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

const short = (value: unknown, max = 34) => {
  const text = clean(value);
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1).trim() + '…' : text;
};

const splitItems = (text: string) => {
  return text
    .split(/(?:\n|\.|,|;|\||→|->| and | then | but | because )/i)
    .map((item) => short(item, 30))
    .filter((item) => item.length > 2)
    .slice(0, 6);
};

const extractStrongValue = (text: string) => {
  const strong =
    text.match(/[₹$]\s?\d[\d,]*(?:\.\d+)?\s?(?:crore|lakh|k|m|million|billion|rs|rupees)?/i) ||
    text.match(/\b\d[\d,]*(?:\.\d+)?\s?(?:%|percent|crore|lakh|k|m|million|billion|rs|rupees)\b/i);

  return strong?.[0] || '';
};

const getScenes = (visualPlan: unknown): VisualScene[] => {
  if (!visualPlan || typeof visualPlan !== 'object') return [];
  const scenes = (visualPlan as {scenes?: unknown}).scenes;
  return Array.isArray(scenes) ? (scenes.filter((item) => item && typeof item === 'object') as VisualScene[]) : [];
};

const getActiveScene = (visualPlan: unknown, time = 0): VisualScene | undefined => {
  const scenes = getScenes(visualPlan);
  return (
    scenes.find((scene) => {
      const start = Number(scene.start || 0);
      const end = Number(scene.end || 0);
      return time >= start && time < end;
    }) || scenes[0]
  );
};

const getDynamicData = ({overlay, visualPlan, time}: Props): Data => {
  const scene = getActiveScene(visualPlan, time);

  const sourceText = clean(
    [
      scene?.frameText,
      scene?.frameValue,
      scene?.scriptText,
      scene?.showWhat,
      overlay?.frameText,
      overlay?.frameValue,
      overlay?.text,
      overlay?.body,
      overlay?.label,
    ]
      .filter(Boolean)
      .join('. '),
  );

  const visualType = clean(scene?.visualType || overlay?.sceneType || overlay?.visualType || overlay?.type || 'ACCUMULATIVE_FLOWCHART');

  const main =
    short(scene?.frameText, 24) ||
    short(overlay?.frameText, 24) ||
    short(overlay?.text, 24) ||
    short(scene?.frameValue, 18) ||
    short(overlay?.frameValue, 18) ||
    short(extractStrongValue(sourceText), 18) ||
    'Key Point';

  const plannedItems = [
    ...(Array.isArray(scene?.frameItems) ? scene?.frameItems || [] : []),
    ...(Array.isArray(overlay?.frameItems) ? overlay?.frameItems || [] : []),
  ]
    .map((item) => short(item, 30))
    .filter(Boolean);

  const textItems = splitItems(clean([overlay?.body, scene?.showWhat, scene?.scriptText, overlay?.text].filter(Boolean).join('. ')));

  const items = Array.from(new Set([...plannedItems, ...textItems]))
    .filter((item) => item.toLowerCase() !== main.toLowerCase())
    .slice(0, 6);

  return {
    visualType,
    main,
    items,
  };
};

const Shell = ({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'flow' | 'steps' | 'compare' | 'warning' | 'stat';
}) => {
  const background =
    variant === 'warning'
      ? 'linear-gradient(135deg, #ef4444 0%, #f97316 48%, #991b1b 100%)'
      : variant === 'compare'
        ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 48%, #111827 100%)'
        : variant === 'steps'
          ? 'linear-gradient(135deg, #0f766e 0%, #0891b2 52%, #0f172a 100%)'
          : variant === 'stat'
            ? 'linear-gradient(135deg, #6d28d9 0%, #9333ea 52%, #111827 100%)'
            : 'linear-gradient(135deg, #16b981 0%, #23c08a 48%, #14a876 100%)';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1080,
        height: 1120,
        overflow: 'hidden',
        background,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 20%, rgba(255,255,255,.16), transparent 28%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.10), transparent 32%)',
        }}
      />
      {children}
    </div>
  );
};

const TextBlock = ({
  children,
  x,
  y,
  start,
  size = 44,
  color = '#ffffff',
  width = 300,
}: {
  children: React.ReactNode;
  x: number;
  y: number;
  start: number;
  size?: number;
  color?: string;
  width?: number;
}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, start);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        color,
        fontSize: size,
        lineHeight: 1.12,
        fontWeight: 900,
        fontStyle: 'italic',
        textAlign: 'center',
        opacity: p,
        transform: 'scale(' + (0.88 + p * 0.12) + ')',
        textShadow: '0 5px 10px rgba(0,0,0,.28)',
      }}
    >
      {children}
    </div>
  );
};

const Pill = ({
  children,
  x,
  y,
  start,
  bg,
  width,
  size = 48,
}: {
  children: React.ReactNode;
  x: number;
  y: number;
  start: number;
  bg: string;
  width: number;
  size?: number;
}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, start);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        minHeight: 82,
        borderRadius: 26,
        background: bg,
        color: '#ffffff',
        fontSize: size,
        lineHeight: 1,
        fontWeight: 1000,
        fontStyle: 'italic',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 22px',
        textAlign: 'center',
        opacity: p,
        transform: 'scale(' + (0.86 + p * 0.14) + ')',
        boxShadow: '0 14px 28px rgba(0,0,0,.25)',
        textShadow: '0 4px 8px rgba(0,0,0,.28)',
      }}
    >
      {children}
    </div>
  );
};

const Line = ({x, y, h, start}: {x: number; y: number; h: number; start: number}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, start);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 5,
        height: h * p,
        background: '#ffffff',
        borderRadius: 99,
        boxShadow: '0 3px 8px rgba(0,0,0,.18)',
      }}
    />
  );
};

const HLine = ({x, y, w, start}: {x: number; y: number; w: number; start: number}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, start);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w * p,
        height: 5,
        background: '#ffffff',
        borderRadius: 99,
        boxShadow: '0 3px 8px rgba(0,0,0,.18)',
      }}
    />
  );
};

const Arrow = ({x, y, start}: {x: number; y: number; start: number}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, start);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        color: '#ffffff',
        fontSize: 56,
        fontWeight: 900,
        opacity: p,
        transform: 'translateY(' + (10 - p * 10) + 'px)',
        textShadow: '0 4px 8px rgba(0,0,0,.25)',
      }}
    >
      ↓
    </div>
  );
};

const FlowchartLayout = ({data}: {data: Data}) => {
  const itemCount = data.items.length;

  return (
    <Shell variant="flow">
      <TextBlock x={420} y={70} start={0} width={240} size={60}>
        💡
      </TextBlock>

      <Pill x={310} y={170} start={5} bg="#8b5cf6" width={460} size={46}>
        {data.main}
      </Pill>

      {itemCount > 0 ? <Line x={540} y={270} h={120} start={25} /> : null}
      {itemCount > 1 ? <HLine x={260} y={390} w={560} start={38} /> : null}

      {data.items[0] ? <Arrow x={250} y={385} start={50} /> : null}
      {data.items[1] ? <Arrow x={805} y={385} start={50} /> : null}

      {data.items[0] ? <TextBlock x={70} y={480} start={65} width={370} size={42}>{data.items[0]}</TextBlock> : null}
      {data.items[1] ? <TextBlock x={640} y={480} start={82} width={370} size={42}>{data.items[1]}</TextBlock> : null}

      {data.items[2] ? <Arrow x={255} y={610} start={100} /> : null}
      {data.items[2] ? <TextBlock x={55} y={700} start={115} width={420} size={40}>{data.items[2]}</TextBlock> : null}

      {data.items[3] ? <TextBlock x={620} y={700} start={135} width={420} size={40}>{data.items[3]}</TextBlock> : null}

      {data.items[4] ? <Arrow x={270} y={850} start={165} /> : null}
      {data.items[4] ? <Pill x={70} y={940} start={180} bg="#ef4444" width={420} size={38}>{data.items[4]}</Pill> : null}
      {data.items[5] ? <Pill x={590} y={940} start={200} bg="#4f46e5" width={420} size={38}>{data.items[5]}</Pill> : null}
    </Shell>
  );
};

const StepListLayout = ({data}: {data: Data}) => {
  return (
    <Shell variant="steps">
      <TextBlock x={360} y={70} start={0} width={360} size={54}>
        🧭 STEPS
      </TextBlock>

      <Pill x={190} y={170} start={5} bg="#0f172a" width={700} size={42}>
        {data.main}
      </Pill>

      {(data.items.length ? data.items : [data.main]).slice(0, 5).map((item, index) => (
        <div
          key={item + index}
          style={{
            position: 'absolute',
            left: 130,
            top: 330 + index * 125,
            width: 820,
            minHeight: 88,
            borderRadius: 26,
            background: 'rgba(255,255,255,0.14)',
            border: '2px solid rgba(255,255,255,0.26)',
            display: 'grid',
            gridTemplateColumns: '86px 1fr',
            alignItems: 'center',
            padding: '12px 26px',
            color: '#ffffff',
            fontSize: 36,
            fontWeight: 900,
            boxShadow: '0 14px 34px rgba(0,0,0,.22)',
            opacity: appear(useCurrentFrame(), 35 + index * 20),
            transform: 'translateY(' + (20 - appear(useCurrentFrame(), 35 + index * 20) * 20) + 'px)',
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: '#facc15',
              color: '#0f172a',
              display: 'grid',
              placeItems: 'center',
              fontSize: 30,
              fontWeight: 1000,
            }}
          >
            {index + 1}
          </div>
          <div>{item}</div>
        </div>
      ))}
    </Shell>
  );
};

const ComparisonSplitLayout = ({data}: {data: Data}) => {
  const left = data.items[0] || 'Option A';
  const right = data.items[1] || 'Option B';
  const leftDetails = data.items.slice(2, 4);
  const rightDetails = data.items.slice(4, 6);

  return (
    <Shell variant="compare">
      <TextBlock x={360} y={74} start={0} width={360} size={58}>
        ⚖️ COMPARE
      </TextBlock>

      <Pill x={190} y={170} start={5} bg="#111827" width={700} size={40}>
        {data.main}
      </Pill>

      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 340,
          width: 430,
          height: 520,
          borderRadius: 36,
          background: 'rgba(255,255,255,0.14)',
          border: '3px solid rgba(255,255,255,0.24)',
          padding: 34,
          color: '#ffffff',
          boxShadow: '0 18px 44px rgba(0,0,0,.25)',
        }}
      >
        <TextBlock x={110} y={385} start={40} width={350} size={46}>{left}</TextBlock>
        {leftDetails.map((item, index) => (
          <TextBlock key={item} x={110} y={520 + index * 95} start={70 + index * 20} width={350} size={32}>
            ✓ {item}
          </TextBlock>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 580,
          top: 340,
          width: 430,
          height: 520,
          borderRadius: 36,
          background: 'rgba(255,255,255,0.14)',
          border: '3px solid rgba(255,255,255,0.24)',
          padding: 34,
          color: '#ffffff',
          boxShadow: '0 18px 44px rgba(0,0,0,.25)',
        }}
      >
        <TextBlock x={620} y={385} start={50} width={350} size={46}>{right}</TextBlock>
        {rightDetails.map((item, index) => (
          <TextBlock key={item} x={620} y={520 + index * 95} start={80 + index * 20} width={350} size={32}>
            ✓ {item}
          </TextBlock>
        ))}
      </div>

      <Pill x={465} y={560} start={60} bg="#f97316" width={150} size={44}>
        VS
      </Pill>
    </Shell>
  );
};

const WarningMapLayout = ({data}: {data: Data}) => {
  return (
    <Shell variant="warning">
      <TextBlock x={370} y={70} start={0} width={340} size={66}>
        ⚠️ ALERT
      </TextBlock>

      <Pill x={160} y={180} start={5} bg="#7f1d1d" width={760} size={42}>
        {data.main}
      </Pill>

      {(data.items.length ? data.items : [data.main]).slice(0, 4).map((item, index) => (
        <div
          key={item + index}
          style={{
            position: 'absolute',
            left: index % 2 === 0 ? 90 : 560,
            top: 370 + Math.floor(index / 2) * 230,
            width: 430,
            minHeight: 150,
            borderRadius: 32,
            background: 'rgba(0,0,0,0.22)',
            border: '3px solid rgba(255,255,255,0.24)',
            color: '#ffffff',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            padding: 24,
            fontSize: 34,
            fontWeight: 950,
            boxShadow: '0 18px 44px rgba(0,0,0,.28)',
            opacity: appear(useCurrentFrame(), 40 + index * 25),
          }}
        >
          ✕ {item}
        </div>
      ))}
    </Shell>
  );
};

const StatCardLayout = ({data}: {data: Data}) => {
  const value = extractStrongValue([data.main, ...data.items].join(' ')) || data.main;
  const detail = data.items[0] || data.main;

  return (
    <Shell variant="stat">
      <TextBlock x={350} y={90} start={0} width={380} size={54}>
        📊 KEY NUMBER
      </TextBlock>

      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 240,
          width: 900,
          height: 520,
          borderRadius: 50,
          background: 'rgba(255,255,255,0.14)',
          border: '3px solid rgba(255,255,255,0.24)',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          padding: 40,
          boxShadow: '0 26px 70px rgba(0,0,0,.28)',
        }}
      >
        <TextBlock x={140} y={340} start={15} width={800} size={96} color="#ffffff">
          {value}
        </TextBlock>
        <TextBlock x={170} y={520} start={50} width={740} size={42} color="#fef3c7">
          {detail}
        </TextBlock>
      </div>

      {data.items[1] ? <Pill x={230} y={850} start={80} bg="#f97316" width={620} size={42}>{data.items[1]}</Pill> : null}
    </Shell>
  );
};

export const AccumulativeFlowchart = (props: Props) => {
  const data = getDynamicData(props);
  const type = data.visualType.toLowerCase();

  if (/warning|risk|fraud|scam|mistake|reject/i.test(type)) {
    return <WarningMapLayout data={data} />;
  }

  if (/comparison|compare|split/i.test(type)) {
    return <ComparisonSplitLayout data={data} />;
  }

  if (/step|list|timeline|process/i.test(type)) {
    return <StepListLayout data={data} />;
  }

  if (/stat|number|amount/i.test(type)) {
    return <StatCardLayout data={data} />;
  }

  return <FlowchartLayout data={data} />;
};
