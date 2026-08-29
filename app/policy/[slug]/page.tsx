import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DetailShell } from '../../../components/detail-shell';
import { LongformRecordArticle } from '../../../components/longform-record';
import { expandedSourcesFor } from '../../../lib/data/longform';
import { eventBySlug, policies } from '../../../lib/data/research';
export const dynamicParams = false;
export function generateStaticParams(){ return policies.map(event=>({slug:event.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const event=eventBySlug(slug);if(!event)return {};return {title:`${event.title} | India: The Record`,description:event.summary,openGraph:{images:[]},twitter:{images:[]}};}
export default async function PolicyPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const event=eventBySlug(slug); if(!event||!['Policies','Social Policy','Infrastructure'].includes(event.category)) notFound(); const recordSources=expandedSourcesFor(event); return <DetailShell party={event.party} eyebrow={event.category} title={event.title} summary={event.summary} date={event.date} evidence={`${recordSources.length} primary or institutional records`} sources={recordSources}><LongformRecordArticle event={event} sources={recordSources}/></DetailShell>; }
