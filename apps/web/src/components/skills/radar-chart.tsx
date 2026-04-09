"use client";

interface RadarChartProps {
  data: { subject: string; value: number; target: number; fullMark?: number }[];
}

export function SimpleRadarChart({ data }: RadarChartProps) {
  const maxRadius = 90;
  const cx = 120;
  const cy = 120;
  const categories = data.length;
  const angleStep = (2 * Math.PI) / categories;
  const gridRings = [20, 40, 60, 80, 100];

  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = ((d.value / (d.fullMark || 100)) * maxRadius);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const targetPoints = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = ((d.target / (d.fullMark || 100)) * maxRadius);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <div className="w-full max-w-[240px] mx-auto">
      <svg viewBox="0 0 240 240" className="w-full">
        {gridRings.map((r) => (
          <polygon
            key={r}
            points={Array.from({ length: categories }, (_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              return `${cx + (r / 100) * maxRadius * Math.cos(angle)},${cy + (r / 100) * maxRadius * Math.sin(angle)}`;
            }).join(" ")}
            fill="none"
            stroke="#E8E8E6"
            strokeWidth="1"
          />
        ))}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={cx + maxRadius * Math.cos(angle)}
              y2={cy + maxRadius * Math.sin(angle)}
              stroke="#E8E8E6"
              strokeWidth="1"
            />
          );
        })}
        <polygon points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="#0D7377" fillOpacity="0.2" stroke="#0D7377" strokeWidth="2" />
        <polygon points={targetPoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#7C6BB2" strokeWidth="1.5" strokeDasharray="4 2" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#0D7377" />
        ))}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={p.y - 5} textAnchor="middle" fontSize="9" fill="#5C5C6D" fontWeight="500">
            {data[i].subject}
          </text>
        ))}
      </svg>
    </div>
  );
}
