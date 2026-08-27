'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function EconomyChart({ data, label, unit }: { data: { year:number; value:number }[]; label:string; unit:string }) {
  return (
    <div className="chart-wrap" role="img" aria-label={`${label}, ${unit}, by calendar year. Exact values are available in the chart tooltip.`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 24, right: 16, left: -20, bottom: 0 }}>
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill:'#777', fontSize:10 }} interval="preserveStartEnd" />
          <YAxis domain={['auto','auto']} axisLine={false} tickLine={false} tick={{ fill:'#666', fontSize:10 }} width={48} />
          <Tooltip contentStyle={{ background:'#0d1117', border:'1px solid rgba(255,255,255,.14)', borderRadius:0, fontSize:11 }} labelStyle={{ color:'#aaa' }} formatter={(value) => [`${Number(value).toFixed(2)} ${unit}`, label]} />
          <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={{ r:3, fill:'var(--accent)', strokeWidth:0 }} activeDot={{ r:5, stroke:'#fff', strokeWidth:1 }} isAnimationActive animationDuration={700} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
