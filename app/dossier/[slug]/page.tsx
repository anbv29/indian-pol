import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailBlock, DetailShell } from '../../../components/detail-shell';
import { dossierBySlug, dossiers, dossierSourceById } from '../../../lib/data/dossiers';
import { dossierSupplement } from '../../../lib/data/longform';
import type { Source } from '../../../lib/data/research';

export const dynamicParams=false;
export function generateStaticParams(){ return dossiers.map(dossier=>({slug:dossier.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const dossier=dossierBySlug(slug);
  if(!dossier)return {};
  return {title:`${dossier.title} | India: The Record`,description:dossier.deck,openGraph:{images:[]},twitter:{images:[]}};
}

export default async function DossierPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const dossier=dossierBySlug(slug); if(!dossier)notFound();
  const recordSources=dossier.sourceIds.map(dossierSourceById).filter((source):source is Source=>Boolean(source));
  const attribution=dossier.attribution==='cross'?'Cross-government record':dossier.attribution==='bjp'?'BJP-led NDA record':'Congress-led UPA record';
  const supplement=dossierSupplement(dossier);
  return <DetailShell eyebrow={`${dossier.kind} · ${dossier.sector}`} title={dossier.title} summary={dossier.deck} date={dossier.date} evidence={`${recordSources.length} primary or institutional records`} sources={recordSources}>
    <section className="dossier-factbar"><span>ATTRIBUTION<b>{attribution}</b></span><span>GOVERNMENT<b>{dossier.government}</b></span><span>STATUS<b>{dossier.status}</b></span><span>COUNTRIES / BLOC<b>{dossier.countries.join(' · ')}</b></span></section>
    <div className="article-standard"><span>LONG-FORM PUBLIC EXPLAINER</span><strong>{supplement.totalWordCount.toLocaleString('en-IN')} words</strong><small>≈ {supplement.readingMinutes} minute read · provisions, trade-offs and evidence limits included</small></div>
    <DetailBlock label="THE FULL PICTURE" title="What happened—and what it set in motion" text={dossier.overview}/>
    <section className="dossier-provisions"><div className="dossier-section-title"><span>WHAT THE TEXT CONTAINS</span><h2>The machinery<br/>inside the headline.</h2></div><div>{dossier.provisions.map((point,index)=><article key={point.title}><span>0{index+1}</span><h3>{point.title}</h3><p>{point.detail}</p></article>)}</div></section>
    <section className="dossier-balance"><div><span>THE UPSIDE</span><h2>What it enables.</h2>{dossier.benefits.map(item=><p key={item}>{item}</p>)}</div><div><span>THE DOWNSIDE</span><h2>Cost, risk and friction.</h2>{dossier.tradeoffs.map(item=><p key={item}>{item}</p>)}</div></section>
    <section className="dossier-underread"><div className="dossier-section-title"><span>PUBLIC, BUT UNDER-READ</span><h2>The clauses that<br/>change the story.</h2><p>These points are drawn from public records. They are highlighted because summaries often omit them—not because they were secret.</p></div><div>{dossier.underRead.map((point,index)=><article key={point.label}><span>CLAUSE {String(index+1).padStart(2,'0')}</span><h3>{point.label}</h3><p>{point.detail}</p><div><b>WHY IT MATTERS</b>{point.whyItMatters}</div></article>)}</div></section>
    <DetailBlock label="IMPLEMENTATION REALITY" title="A signed text is not the outcome" text={dossier.implementation}/>
    {supplement.paragraphs.length>0&&<section className="dossier-reader-guide"><span>HOW TO READ THIS RECORD</span><h2>From document<br/>to public judgment.</h2><div>{supplement.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></section>}
    <section className="dossier-evidence-note"><ShieldIcon/><div><b>WHAT THE EVIDENCE CAN SUPPORT</b><p>{dossier.evidenceNote}</p></div></section>
  </DetailShell>;
}

function ShieldIcon(){return <span aria-hidden="true">✓</span>}
