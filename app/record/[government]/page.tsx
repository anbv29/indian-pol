import { notFound } from 'next/navigation';
import { DetailBlock, DetailShell } from '../../../components/detail-shell';
import { eventBySlug, sourceById, timeline, type Source } from '../../../lib/data/research';

export const dynamicParams = false;
export function generateStaticParams() { return timeline.map(event=>({government:event.slug})); }

export default async function RecordPage({ params }: { params:Promise<{ government:string }> }) {
  const { government }=await params; const event=eventBySlug(government); if(!event) notFound(); const eventSources=event.sourceIds.map(sourceById).filter((source):source is Source=>Boolean(source));
  return <DetailShell eyebrow={event.category} title={event.title} summary={event.summary} date={event.date} sources={eventSources}><DetailBlock title="What happened?" text={event.summary}/><DetailBlock title="What changed?" text={event.whatChanged}/><DetailBlock label="ATTRIBUTION" title="Government and coalition context" text={event.party==='bjp'?'This record falls within the BJP-led National Democratic Alliance central-government period. It is not attributed to the BJP alone where parliamentary, coalition, state or institutional action also mattered.':'This record falls within the Congress-led United Progressive Alliance central-government period. It is not attributed to Congress alone where parliamentary, coalition, state or institutional action also mattered.'}/></DetailShell>;
}
