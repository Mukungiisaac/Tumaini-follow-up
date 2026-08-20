import React from 'react';

export default function RadarChart({ metrics, size = 260 }) {
  // 5 categories in order: Top (0°), Top-Right (72°), Bottom-Right (144°), Bottom-Left (216°), Top-Left (288°)
  const categories = [
    { key: 'computer', label: 'COMPUTER', val: metrics?.computer || 85 },
    { key: 'mathScience', label: 'MATH & SCI', val: metrics?.mathScience || 80 },
    { key: 'music', label: 'MUSIC', val: metrics?.music || 65 },
    { key: 'arts', label: 'ART', val: metrics?.arts || 50 },
    { key: 'bible', label: 'BIBLE', val: metrics?.bible || 70 }
  ];

  const center = size / 2;
  const radius = (size / 2) - 45; // Leave space for labels
  const numLevels = 4; // Grid concentric polygons

  // Helper to convert polar coords (angle in degrees, radius) to SVG Cartesian (x, y)
  // 0 degrees is straight UP: x = center + r * sin(angle), y = center - r * cos(angle)
  const getPoint = (angleDeg, r) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: center + r * Math.sin(rad),
      y: center - r * Math.cos(rad)
    };
  };

  const angles = [0, 72, 144, 216, 288];

  // Concentric grid polygons
  const gridPolygons = Array.from({ length: numLevels }, (_, i) => {
    const levelRadius = (radius / numLevels) * (i + 1);
    const points = angles.map(angle => {
      const pt = getPoint(angle, levelRadius);
      return `${pt.x},${pt.y}`;
    }).join(' ');
    return points;
  });

  // Data polygon points
  const dataPointsStr = categories.map((cat, i) => {
    const angle = angles[i];
    const r = (cat.val / 100) * radius;
    const pt = getPoint(angle, r);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Computed point objects for circles
  const dataPoints = categories.map((cat, i) => {
    const angle = angles[i];
    const r = (cat.val / 100) * radius;
    return getPoint(angle, r);
  });

  return (
    <div className="relative flex items-center justify-center p-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Grid Polygons */}
        {gridPolygons.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray={idx === numLevels - 1 ? "none" : "2,2"}
          />
        ))}

        {/* Axis Lines */}
        {angles.map((angle, idx) => {
          const outerPt = getPoint(angle, radius);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Data Area Polygon */}
        <polygon
          points={dataPointsStr}
          fill="rgba(139, 92, 246, 0.15)"
          stroke="#0f172a"
          strokeWidth="2.5"
        />

        {/* Data Dots */}
        {dataPoints.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r="4.5"
            fill="#0f172a"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {/* Category Labels */}
        {categories.map((cat, idx) => {
          const angle = angles[idx];
          const labelPt = getPoint(angle, radius + 22);
          
          let textAnchor = "middle";
          if (angle === 72 || angle === 144) textAnchor = "start";
          if (angle === 216 || angle === 288) textAnchor = "end";

          return (
            <text
              key={idx}
              x={labelPt.x}
              y={labelPt.y + 4}
              textAnchor={textAnchor}
              className="text-[11px] font-bold fill-slate-700 tracking-wider font-mono"
            >
              {cat.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
