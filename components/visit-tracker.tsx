'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useSyncExternalStore } from 'react';

const VISITS_KEY='india-record-browser-visits';
const ACTIVE_TIME_KEY='india-record-active-time-ms';
const EVENT_NAME='india-record-visit-stats';

type VisitStats={visits:number;activeMs:number};

function readStats():VisitStats {
  if(typeof window==='undefined')return {visits:0,activeMs:0};
  return {
    visits:Number.parseInt(localStorage.getItem(VISITS_KEY)??'0',10)||0,
    activeMs:Number.parseInt(sessionStorage.getItem(ACTIVE_TIME_KEY)??'0',10)||0,
  };
}

function announce(stats:VisitStats){ window.dispatchEvent(new CustomEvent<VisitStats>(EVENT_NAME,{detail:stats})); }

export function SiteVisitTracker(){
  const pathname=usePathname();
  const lastCountedPath=useRef<string|null>(null);

  useEffect(()=>{
    if(lastCountedPath.current===pathname)return;
    lastCountedPath.current=pathname;
    const stats=readStats();
    const nextStats={...stats,visits:stats.visits+1};
    localStorage.setItem(VISITS_KEY,String(nextStats.visits));
    announce(nextStats);
  },[pathname]);

  useEffect(()=>{
    let stats=readStats();
    let activeMs=stats.activeMs;
    let lastTick=performance.now();
    const flush=()=>{
      const now=performance.now();
      if(document.visibilityState==='visible'&&document.hasFocus())activeMs+=now-lastTick;
      lastTick=now;
      sessionStorage.setItem(ACTIVE_TIME_KEY,String(Math.round(activeMs)));
      announce({visits:stats.visits,activeMs});
    };
    announce({visits:stats.visits,activeMs});
    const timer=window.setInterval(flush,1000);
    window.addEventListener('pagehide',flush);
    document.addEventListener('visibilitychange',flush);
    window.addEventListener('focus',flush);
    window.addEventListener('blur',flush);
    const syncFromAnotherTab=(event:StorageEvent)=>{
      if(event.key===VISITS_KEY)announce(readStats());
    };
    window.addEventListener('storage',syncFromAnotherTab);
    return()=>{
      flush(); window.clearInterval(timer); window.removeEventListener('pagehide',flush); document.removeEventListener('visibilitychange',flush); window.removeEventListener('focus',flush); window.removeEventListener('blur',flush); window.removeEventListener('storage',syncFromAnotherTab);
    };
  },[]);
  return null;
}

export function VisitorStats(){
  const snapshot=useSyncExternalStore(
    callback=>{
      window.addEventListener(EVENT_NAME,callback);
      const syncFromAnotherTab=(event:StorageEvent)=>{if(event.key===VISITS_KEY)callback();};
      window.addEventListener('storage',syncFromAnotherTab);
      return()=>{window.removeEventListener(EVENT_NAME,callback);window.removeEventListener('storage',syncFromAnotherTab);};
    },
    ()=>{const stats=readStats();return `${stats.visits}|${stats.activeMs}`;},
    ()=>'0|0',
  );
  const [visits,activeMs]=snapshot.split('|').map(Number);
  const totalSeconds=Math.floor(activeMs/1000);
  const hours=Math.floor(totalSeconds/3600);
  const minutes=Math.floor((totalSeconds%3600)/60);
  const seconds=totalSeconds%60;
  const duration=[hours,minutes,seconds].map(value=>String(value).padStart(2,'0')).join(':');
  return <div className="visitor-stats" aria-live="polite"><div><span>TOTAL VISITS</span><strong>{visits.toLocaleString('en-IN')}</strong></div><div><span>ACTIVE TIME THIS VISIT</span><strong>{duration}</strong><small>Counts while this tab is active</small></div></div>;
}
