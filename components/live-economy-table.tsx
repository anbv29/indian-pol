'use client';

import { useLiveEconomy } from '../lib/use-live-economy';

export function LiveEconomyTable() {
  const {indicators,status,lastUpdated}=useLiveEconomy();

  return <>
    <div className={`live-data-status detail-live-status ${status}`}><span/>{status==='live'?`LIVE OFFICIAL API · RELEASE ${lastUpdated}`:status==='loading'?'CONNECTING TO WORLD BANK API…':'OFFICIAL FALLBACK · WORLD BANK RELEASE 2026-07-13'}</div>
    <section className="economy-data-table">
      <div><b>Indicator</b><b>2004</b><b>2014</b><b>Latest</b><b>Unit</b></div>
      {Object.values(indicators).map(item=>{
        const latest=item.values.at(-1);
        return <div key={item.label}>
          <strong>{item.label}</strong>
          <span>{item.values.find(row=>row.year===2004)?.value.toFixed(2)}</span>
          <span>{item.values.find(row=>row.year===2014)?.value.toFixed(2)}</span>
          <span>{latest?.value.toFixed(2)} <small>({latest?.year})</small></span>
          <span>{item.unit}</span>
        </div>;
      })}
    </section>
  </>;
}
