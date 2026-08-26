'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function EconomyChart({ values, years }: { values: number[]; years: number[] }) {
  const data = values.map((value, index) => ({ year: years[index], value }));
  return (
    <div className="chart-wrap" role="img" aria-label="Demo normalized indicator chart. Values are illustrative and are not historical statistics.">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 24, right: 16, left: -20, bottom: 0 }}>
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#777', fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={['dataMin - 8', 'dataMax + 8']} axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
          <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,.14)', borderRadius: 0, fontSize: 11 }} labelStyle={{ color: '#aaa' }} formatter={(value) => [`${value} (demo index)`, 'Normalized indicator']} />
          <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 1 }} isAnimationActive animationDuration={700} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
