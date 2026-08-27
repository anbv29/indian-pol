import { notFound } from 'next/navigation';
import { DetailBlock, DetailShell } from '../../../components/detail-shell';
import { eventBySlug, legislation, sourceById, type Source } from '../../../lib/data/research';
export const dynamicParams = false;
export function generateStaticParams(){ return legislation.map(event=>({slug:event.slug})); }
export default async function LegislationPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const event=eventBySlug(slug); if(!event||event.category!=='Laws & Bills') notFound(); const recordSources=event.sourceIds.map(sourceById).filter((source):source is Source=>Boolean(source)); return <DetailShell eyebrow="Legislation" title={event.title} summary={event.summary} date={event.date} sources={recordSources}><DetailBlock title="What the law did" text={event.whatChanged}/><DetailBlock label="SCOPE NOTE" title="What this record does not claim" text="Enactment does not by itself establish effective implementation or a measurable social or economic outcome. Those require separate evidence."/></DetailShell>; }
