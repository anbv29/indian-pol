'use client';

import { ArrowUpRight, Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { dossiers, dossierSectors, type DossierAttribution } from '../lib/data/dossiers';

const attributionLabels:Record<DossierAttribution,string> = {
  bjp:'BJP-led NDA',
  congress:'Congress-led UPA',
  cross:'Cross-government',
};

export function DossierExplorer() {
  const [query,setQuery]=useState('');
  const [sector,setSector]=useState('All sectors');
  const [attribution,setAttribution]=useState<'all'|DossierAttribution>('all');
  const filtered=useMemo(()=>dossiers.filter(dossier=>{
    const haystack=[dossier.title,dossier.deck,dossier.sector,dossier.kind,dossier.government,...dossier.countries].join(' ').toLowerCase();
    return (sector==='All sectors'||dossier.sector===sector)&&(attribution==='all'||dossier.attribution===attribution)&&haystack.includes(query.toLowerCase().trim());
  }),[query,sector,attribution]);

  return <main className="dossier-index-page">
    <header className="dossier-index-nav"><Link href="/"><span>INDIA</span><b>THE RECORD</b></Link><Link href="/">← Back to record</Link></header>
    <section className="dossier-index-hero"><p>DEEP RESEARCH ARCHIVE · REVIEWED 28 AUGUST 2026</p><h1>Beyond the<br/><em>headline.</em></h1><div><p>What the law, treaty or policy actually contains. Who gains, who carries the risk, what implementation changed—and which consequential clauses were public but easy to miss.</p><strong>{dossiers.length} dossiers<br/>{dossierSectors.length} sectors<br/>{new Set(dossiers.flatMap(item=>item.countries)).size} countries or blocs</strong></div></section>
    <section className="dossier-scope"><ShieldCheck size={18}/><div><b>Evidence boundary</b><p>This is a curated Union-level archive from 2004 onward, not every Gazette notification or classified record. “Public but under-read” means the point appears in an official document but rarely survives into the headline. It does not mean secret or unlawfully obtained information.</p></div></section>
    <section className="dossier-controls" aria-label="Filter dossiers"><label><Search size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search law, country, pact or clause" aria-label="Search dossiers"/></label><select value={attribution} onChange={event=>setAttribution(event.target.value as 'all'|DossierAttribution)} aria-label="Filter by government"><option value="all">All governments</option><option value="bjp">BJP-led NDA</option><option value="congress">Congress-led UPA</option><option value="cross">Cross-government</option></select><select value={sector} onChange={event=>setSector(event.target.value)} aria-label="Filter by sector"><option>All sectors</option>{dossierSectors.map(item=><option key={item}>{item}</option>)}</select></section>
    <section className="dossier-results"><div className="dossier-result-count"><span>{String(filtered.length).padStart(2,'0')} RESULTS</span><i/></div><div className="dossier-grid">{filtered.map(dossier=><Link className="dossier-card" href={`/dossier/${dossier.slug}`} key={dossier.id}><div className="dossier-card-top"><span>{dossier.kind} · {dossier.year}</span><b>{attributionLabels[dossier.attribution]}</b></div><h2>{dossier.title}</h2><p>{dossier.deck}</p><div className="dossier-tags"><span>{dossier.sector}</span>{dossier.countries.slice(0,3).map(country=><span key={country}>{country}</span>)}</div><div className="dossier-card-foot"><span>{dossier.underRead.length} under-read clauses · {dossier.sourceIds.length} primary sources</span><ArrowUpRight size={16}/></div></Link>)}</div>{filtered.length===0&&<div className="dossier-empty">No dossier matches these filters.</div>}</section>
  </main>;
}
