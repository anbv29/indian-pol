import { notFound } from 'next/navigation';
import { DetailBlock, DetailShell } from '../../../components/detail-shell';
import { eventBySlug, policies, sourceById, type Source } from '../../../lib/data/research';
export const dynamicParams = false;
export function generateStaticParams(){ return policies.map(event=>({slug:event.slug})); }
export default async function PolicyPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const event=eventBySlug(slug); if(!event||!['Policies','Social Policy','Infrastructure'].includes(event.category)) notFound(); const recordSources=event.sourceIds.map(sourceById).filter((source):source is Source=>Boolean(source)); return <DetailShell eyebrow={event.category} title={event.title} summary={event.summary} date={event.date} sources={recordSources}><DetailBlock title="Officially documented action" text={event.summary}/><DetailBlock title="Recorded change" text={event.whatChanged}/><DetailBlock label="OUTCOME NOTE" title="Policy launch is not an outcome" text="This record does not treat an announcement or launch as proof of coverage, quality, effectiveness or causation."/></DetailShell>; }
