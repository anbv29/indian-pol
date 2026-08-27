import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { buildPromiseLongform, buildRecordLongform } from '../lib/data/longform';
import type { PromiseRecord, Source, TimelineItem } from '../lib/data/research';

export function LongformRecordArticle({event,sources}:{event:TimelineItem;sources:Source[]}){
  const article=buildRecordLongform(event,sources);
  return <>
    <div className="article-standard"><span>LONG-FORM PUBLIC EXPLAINER</span><strong>{article.wordCount.toLocaleString('en-IN')} words</strong><small>≈ {article.readingMinutes} minute read · facts and analysis labelled separately</small></div>
    <nav className="article-contents" aria-label="Article contents"><span>IN THIS ARTICLE</span>{article.sections.map((section,index)=><a href={`#section-${index+1}`} key={section.title}>{String(index+1).padStart(2,'0')} {section.title}</a>)}</nav>
    <div className="longform-article">{article.sections.map((section,index)=><section id={`section-${index+1}`} key={section.title}><div><span>{section.label}</span><h2>{section.title}</h2></div><div>{section.paragraphs.map((paragraph,pIndex)=><p key={pIndex}>{paragraph}</p>)}</div></section>)}</div>
    {article.relatedDossier&&<Link className="related-dossier-link" href={`/dossier/${article.relatedDossier.slug}`} prefetch={false}><span>RELATED DEEP DOSSIER</span><div><h2>{article.relatedDossier.title}</h2><p>{article.relatedDossier.deck}</p></div><ArrowUpRight size={18}/></Link>}
  </>;
}

export function LongformPromiseArticle({promise,sources}:{promise:PromiseRecord;sources:Source[]}){
  const article=buildPromiseLongform(promise,sources);
  return <><div className="article-standard"><span>LONG-FORM MANIFESTO ASSESSMENT</span><strong>{article.wordCount.toLocaleString('en-IN')} words</strong><small>≈ {article.readingMinutes} minute read · commitment, delivery and evidence separated</small></div><nav className="article-contents" aria-label="Assessment contents"><span>IN THIS ASSESSMENT</span>{article.sections.map((section,index)=><a href={`#section-${index+1}`} key={section.title}>{String(index+1).padStart(2,'0')} {section.title}</a>)}</nav><div className="longform-article">{article.sections.map((section,index)=><section id={`section-${index+1}`} key={section.title}><div><span>{section.label}</span><h2>{section.title}</h2></div><div>{section.paragraphs.map((paragraph,pIndex)=><p key={pIndex}>{paragraph}</p>)}</div></section>)}</div></>;
}
