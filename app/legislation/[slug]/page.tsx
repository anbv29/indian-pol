import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DetailShell } from '../../../components/detail-shell';
import { LongformRecordArticle } from '../../../components/longform-record';
import { expandedSourcesFor } from '../../../lib/data/longform';
import { eventBySlug, legislation } from '../../../lib/data/research';
export const dynamicParams = false;
export function generateStaticParams(){ return legislation.map(event=>({slug:event.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const event=eventBySlug(slug);if(!event)return {};return {title:`${event.title} | India: The Record`,description:event.summary,openGraph:{images:[]},twitter:{images:[]}};}
export default async function LegislationPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const event=eventBySlug(slug); if(!event||event.category!=='Laws & Bills') notFound(); const recordSources=expandedSourcesFor(event); return <DetailShell eyebrow="Legislation" title={event.title} summary={event.summary} date={event.date} evidence={`${recordSources.length} primary or institutional records`} sources={recordSources}><LongformRecordArticle event={event} sources={recordSources}/></DetailShell>; }
