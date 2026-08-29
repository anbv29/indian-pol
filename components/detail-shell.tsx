'use client';

import { ArrowLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Source } from '../lib/data/research';
import type { PartyKey } from '../lib/data/research';

export function DetailShell({ eyebrow, title, summary, date, evidence='Primary and official records', sources=[], party, children }: { eyebrow:string; title:string; summary:string; date?:string; evidence?:string; sources?:Source[]; party?:PartyKey|'cross'; children?:React.ReactNode }) {
  const [activeParty,setActiveParty]=useState<PartyKey>(party==='congress'?'congress':'bjp');
  useEffect(()=>{
    const requestedParty=new URLSearchParams(window.location.search).get('party');
    if(requestedParty==='bjp'||requestedParty==='congress')setActiveParty(requestedParty);
    else if(party==='bjp'||party==='congress')setActiveParty(party);
    else {
      const storedParty=sessionStorage.getItem('india-record-active-party');
      if(storedParty==='bjp'||storedParty==='congress')setActiveParty(storedParty);
    }
  },[party]);
  const backHref=`/?party=${activeParty}`;
  return <main className="detail-page" data-party={activeParty}><div className="detail-glow"/><header><Link href={backHref} prefetch={false}><span>INDIA</span><b>THE RECORD</b></Link><Link href={backHref} prefetch={false}><ArrowLeft size={14}/> Back to record</Link></header><article><p className="detail-eyebrow">SOURCE-BACKED RECORD · {eyebrow}</p><h1>{title}</h1><p className="detail-lead">{summary}</p><div className="detail-meta"><span>Category <b>{eyebrow}</b></span><span>Evidence <b>{evidence}</b></span><span>Record date <b>{date??'See source chronology'}</b></span></div>{children}<section className="detail-sources"><div><ShieldCheck size={18}/><span>SOURCE TRAIL</span></div><h2>Inspect the evidence<br/>behind the record.</h2>{sources.map((source,index)=><a href={source.url} target="_blank" rel="noreferrer" key={source.id}><span>{String(index+1).padStart(2,'0')}</span><b>{source.title}</b><small>{source.publisher} · {source.sourceType.replace('_',' ')}</small><ArrowUpRight size={14}/></a>)}</section><p className="detail-caveat">The archive documents government action and source material. It does not infer political motive, causation, success or failure unless an assessment states a method and evidence boundary.</p></article></main>;
}

export function DetailBlock({ title, text, label='FACTUAL LAYER' }: { title:string; text:string; label?:string }) { return <section className="detail-block"><span>{label}</span><h2>{title}</h2><p>{text}</p></section>; }
