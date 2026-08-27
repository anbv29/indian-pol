import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DetailShell } from '../../../components/detail-shell';
import { LongformRecordArticle } from '../../../components/longform-record';
import { expandedSourcesFor } from '../../../lib/data/longform';
import { eventBySlug, timeline } from '../../../lib/data/research';

export const dynamicParams = false;
export function generateStaticParams() { return timeline.map(event=>({government:event.slug})); }
export async function generateMetadata({params}:{params:Promise<{government:string}>}):Promise<Metadata>{const {government}=await params;const event=eventBySlug(government);if(!event)return {};return {title:`${event.title} | India: The Record`,description:event.summary,openGraph:{images:[]},twitter:{images:[]}};}

export default async function RecordPage({ params }: { params:Promise<{ government:string }> }) {
  const { government }=await params; const event=eventBySlug(government); if(!event) notFound(); const eventSources=expandedSourcesFor(event);
  return <DetailShell eyebrow={event.category} title={event.title} summary={event.summary} date={event.date} evidence={`${eventSources.length} primary or institutional records`} sources={eventSources}><LongformRecordArticle event={event} sources={eventSources}/></DetailShell>;
}
