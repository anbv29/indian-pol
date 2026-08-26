'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, BookOpen, Building2, FileSearch, Globe2, Landmark, LineChart as LineIcon, Scale, Search, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { EconomyChart } from './economy-chart';
import { getTimeline, governments, legislationSamples, manifestoMetrics, sourceHierarchy, type PartyKey } from '../lib/data/records';

const filters = ['All', 'Laws & Bills', 'Policies', 'Economy', 'Infrastructure', 'Social Policy', 'Foreign Policy'];
const chapters = [
  { icon: BookOpen, label: 'Timeline', detail: 'Year-by-year record', href: '#timeline' },
  { icon: FileSearch, label: 'Manifesto tracker', detail: 'Promises & outcomes', href: '#manifesto' },
  { icon: Scale, label: 'Laws & bills', detail: 'Legislation explorer', href: '#legislation' },
  { icon: LineIcon, label: 'Economy', detail: 'Term-wide analysis', href: '#economy' },
  { icon: Building2, label: 'Policies', detail: 'Initiatives & schemes', href: '#policies' },
  { icon: Globe2, label: 'Foreign policy', detail: 'Global engagements', href: '#foreign-policy' },
];

function Intro() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || sessionStorage.getItem('record-intro-seen')) return;
    setVisible(true);
    sessionStorage.setItem('record-intro-seen', '1');
    const timer = window.setTimeout(() => setVisible(false), 1500);
    return () => window.clearTimeout(timer);
  }, [reduced]);
  return <AnimatePresence>{visible && <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}><motion.div className="intro-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .7 }} /><motion.h2 initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ delay: .2, duration: .6 }}>INDIA<span>THE RECORD</span></motion.h2></motion.div>}</AnimatePresence>;
}

export default function RecordExperience() {
  const [party, setParty] = useState<PartyKey>('bjp');
  const [filter, setFilter] = useState('All');
  const [activeYear, setActiveYear] = useState(governments.bjp.years[0]);
  const [query, setQuery] = useState('');
  const government = governments[party];
  const timeline = useMemo(() => getTimeline(party), [party]);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, .2], [0, reduced ? 0 : 90]);

  useEffect(() => setActiveYear(governments[party].years[0]), [party]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveYear(Number((visible.target as HTMLElement).dataset.year));
    }, { rootMargin: '-35% 0px -50% 0px', threshold: [0, .5, 1] });
    document.querySelectorAll('[data-year]').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [party]);

  const filteredLegislation = legislationSamples.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="site-shell" data-party={party}>
      <Intro />
      <motion.div className="ambient ambient-a" style={{ y: parallaxY }} />
      <div className="ambient ambient-b" /><div className="grid-field" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="India: The Record home"><span>INDIA</span><span>THE RECORD</span></a>
        <nav aria-label="Primary navigation"><a href="#about">About</a><a href="/methodology">Methodology</a><a href="/sources">Sources</a><a className="nav-cta" href="#timeline">Explore data <ArrowUpRight size={13} /></a></nav>
      </header>

      <section className="hero" id="top">
        <motion.div className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }}><span /> Public archive · Demo prototype</motion.div>
        <AnimatePresence mode="wait">
          <motion.div className="hero-main" key={party} initial={{ opacity: 0, y: 12, filter: 'blur(7px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(5px)' }} transition={{ duration: .45 }}>
            <p className="eyebrow">Choose your government record</p>
            <div className="party-switch" role="group" aria-label="Choose government record">
              <button className={party === 'bjp' ? 'party-label active' : 'party-label'} onClick={() => setParty('bjp')} aria-pressed={party === 'bjp'}>BJP</button>
              <button type="button" className="switch-track" aria-label={`Switch to ${party === 'bjp' ? 'Congress' : 'BJP'} record`} aria-pressed={party === 'congress'} onClick={() => setParty(party === 'bjp' ? 'congress' : 'bjp')}><motion.span className="switch-thumb" layout transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }} /></button>
              <button className={party === 'congress' ? 'party-label active' : 'party-label'} onClick={() => setParty('congress')} aria-pressed={party === 'congress'}>CONGRESS</button>
            </div>
            <h1><span>Switch the government.</span><br />Explore the record.</h1>
            <p className="hero-copy">Promises. Policies. Laws. Economy. Foreign affairs.<br />A source-backed interactive record of Indian central governments.</p>
          </motion.div>
        </AnimatePresence>
        <div className="term-card" aria-live="polite"><div><span>{government.label.toUpperCase()}</span><strong>{government.coalition}</strong></div><div><span>GOVERNING PERIOD</span><strong>{government.period}</strong></div><div><span>TERM LENGTH</span><strong>10 Years</strong></div><a href="#timeline" aria-label="Begin exploring the term"><ArrowDown size={18} /></a></div>
        <div className="chapter-strip" aria-label="Explore sections">{chapters.slice(0, 4).map((chapter, index) => <a href={chapter.href} key={chapter.label}><span>0{index + 1}</span><div><strong>{chapter.label}</strong><small>{chapter.detail}</small></div><ArrowUpRight size={13} /></a>)}</div>
      </section>

      <section className="chapter-nav" aria-label="Record sections">{chapters.map(({ icon: Icon, ...chapter }) => <a href={chapter.href} key={chapter.label}><Icon size={17} /><span><strong>{chapter.label}</strong><small>{chapter.detail}</small></span><ArrowUpRight size={12} /></a>)}</section>

      <section className="timeline-section" id="timeline">
        <aside className="year-rail"><p>TIMELINE</p><div className="rail-line" /><div className="year-list">{government.years.map((year) => <button key={year} className={activeYear === year ? 'active' : ''} onClick={() => document.getElementById(`year-${year}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })}><span />{year}</button>)}</div></aside>
        <div className="timeline-content">
          <div className="section-intro"><span>THE DOCUMENTED RECORD</span><h2>A decade, arranged<br />year by year.</h2><p>A structured view of significant government actions, legislation, policy developments and relevant national events.</p></div>
          <div className="demo-notice"><b>DEMO / SAMPLE DATA</b> All timeline entries, counts, and chart values in this prototype are illustrative interface content—not verified historical conclusions.</div>
          <div className="filters" role="group" aria-label="Filter timeline">{filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
          {government.years.map((year) => {
            const entries = timeline.filter((event) => event.year === year && (filter === 'All' || event.category === filter));
            return <article className="year-chapter" id={`year-${year}`} data-year={year} key={`${party}-${year}`}><div className="giant-year" aria-hidden="true">{year}</div><div className="year-heading"><span>YEAR {String(government.years.indexOf(year) + 1).padStart(2, '0')}</span><h3>{year}</h3><p>Major events · Sample record</p></div><div className="record-list">{entries.length ? entries.map((event) => <motion.a href="/record/sample" className={`record-card ${event.importance}`} key={event.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }}><div className="record-meta"><span>{event.category}</span><i>{event.date}</i></div><h4>{event.title}</h4><p>{event.summary}</p><div className="source-row"><ShieldCheck size={13} /> Sources: {event.sourceCount}<ArrowUpRight size={14} /></div></motion.a>) : <div className="empty-record">No sample entries in this category for {year}.</div>}</div></article>;
          })}
        </div>
      </section>

      <section className="manifesto-section" id="manifesto">
        <div className="section-label"><span>02 / MANIFESTO TRACKER</span><p>Promises vs documented record</p></div>
        <div className="manifesto-head"><h2>The distance between<br /><em>said</em> and <em>done.</em></h2><p>Each promise preserves its original wording, source, assessment method and evidence strength. Values below are demo data.</p></div>
        <div className="metric-grid">{manifestoMetrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>DEMO</small></div>)}</div>
        <div className="promise-journey"><div className="journey-copy"><span>SAMPLE PROMISE JOURNEY</span><h3>Evidence accumulates<br />stage by stage.</h3><p>Only stages present in the source record should be shown. This sample visual demonstrates the model.</p><a href="/promise/sample">Inspect sample promise <ArrowUpRight size={14} /></a></div><div className="journey-track">{['Promise documented','Policy announced','Implementation recorded','Outcome data available','Assessment completed'].map((stage, index) => <div key={stage}><i>{String(index + 1).padStart(2, '0')}</i><span /><p><b>{stage}</b><small>Illustrative stage</small></p></div>)}</div></div>
      </section>

      <section className="observatory" id="economy">
        <div className="observatory-grid" /><div className="section-label"><span>04 / ECONOMIC RECORD</span><p>Term-wide indicator explorer</p></div>
        <div className="economy-head"><div><h2>A wider lens on<br />the economy.</h2><p>Growth, prices, employment, public finances, trade and investment—kept in their methodological context.</p></div><div className="economy-index"><span>NORMALIZED DEMO INDEX</span><strong>{government.chart.at(-1)}</strong><small>BASE 100 · ILLUSTRATIVE ONLY</small></div></div>
        <EconomyChart values={government.chart} years={government.years} />
        <div className="chart-foot"><span>UNIT: Normalized demonstration index</span><span>SOURCE: Interface sample only</span><span>METHODOLOGY: Not historical data</span></div>
        <div className="indicator-tabs">{['Growth','Prices','Employment','Public finances','Trade','Investment'].map((item, index) => <button className={index === 0 ? 'active' : ''} key={item}><span>0{index + 1}</span>{item}</button>)}</div>
      </section>

      <section className="legislation-section" id="legislation">
        <div className="section-label"><span>03 / LAWS & BILLS</span><p>Legislation explorer</p></div><div className="legislation-head"><h2>Read the text.<br />Trace the change.</h2><label><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sample records" aria-label="Search legislation" /></label></div>
        <div className="record-table"><div className="table-head"><span>NAME</span><span>TYPE</span><span>STATUS</span><span>SOURCES</span></div>{filteredLegislation.map((item) => <a href="/legislation/sample" key={item.name}><div><b>{item.name}</b><small>{item.year} · {item.category}</small></div><span>{item.type}</span><span>{item.status}</span><span>{item.sources} <ArrowUpRight size={13} /></span></a>)}</div>
      </section>

      <section className="policies-section" id="policies"><div className="section-label"><span>05 / POLICY RECORD</span><p>Initiatives and schemes</p></div><h2>From introduction<br />to recorded status.</h2><div className="policy-grid">{['Public institutions','Social policy','Infrastructure','Environment'].map((name, index) => <a href="/policy/sample" key={name}><span>0{index + 1}</span><Building2 size={20} /><h3>Illustrative {name} record</h3><p>Sample factual description with lifecycle and source metadata.</p><div>Introduced <i /> Implemented <i /> Recorded status</div></a>)}</div></section>

      <section className="methodology-section" id="methodology"><div className="section-label"><span>06 / METHODOLOGY</span><p>How the record is built</p></div><div className="methodology-layout"><div><h2>Evidence first.<br />Always traceable.</h2><p>Facts are separated from objectives, outcomes and assessments. Both government records use the same evidence framework.</p><a href="/methodology">Read the full methodology <ArrowUpRight size={14} /></a></div><div>{sourceHierarchy.map(([number, title, copy]) => <div className="source-tier" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section>

      <section className="end-record" id="about"><p>THE 10-YEAR RECORD</p><h2>Not a verdict.<br /><em>A record.</em></h2><div className="end-grid">{['Manifesto commitments','Legislation','Policies & schemes','Economic indicators','Foreign affairs'].map((item) => <a href="#timeline" key={item}><span>{item}</span><strong>Explore</strong><ArrowUpRight size={14} /></a>)}</div></section>
      <footer id="sources"><div className="footer-mark"><span>INDIA</span><b>THE RECORD</b></div><div className="footer-principles"><div><b>TRACEABLE</b><span>Every substantive record links to sources.</span></div><div><b>NO PARTY NARRATIVES</b><span>Facts and methodology over political opinion.</span></div><div><b>TRANSPARENT</b><span>Inspect the evidence behind the record.</span></div></div><div className="footer-bottom"><span>DEMO PROTOTYPE · NOT A VERIFIED HISTORICAL DATASET</span><a href="#top">BACK TO TOP ↑</a></div></footer>
    </main>
  );
}
