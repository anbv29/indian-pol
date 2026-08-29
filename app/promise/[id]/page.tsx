import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DetailShell } from '../../../components/detail-shell';
import { LongformPromiseArticle } from '../../../components/longform-record';
import { promiseById, promises, sourceById, type Source } from '../../../lib/data/research';
export const dynamicParams = false;
export function generateStaticParams(){ return promises.map(promise=>({id:promise.id})); }
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{const {id}=await params;const promise=promiseById(id);if(!promise)return {};return {title:`${promise.commitment} | India: The Record`,description:promise.assessment,openGraph:{images:[]},twitter:{images:[]}};}
export default async function PromisePage({params}:{params:Promise<{id:string}>}) { const {id}=await params; const promise=promiseById(id); if(!promise) notFound(); const recordSources=promise.sourceIds.map(sourceById).filter((source):source is Source=>Boolean(source)); return <DetailShell party={promise.party} eyebrow="Manifesto assessment" title={promise.commitment} summary={promise.assessment} evidence={`Grade ${promise.evidenceStrength} · ${recordSources.length} sources`} sources={recordSources}><LongformPromiseArticle promise={promise} sources={recordSources}/></DetailShell>; }
