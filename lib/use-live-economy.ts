'use client';

import { useEffect, useState } from 'react';
import { economyIndicators, type EconomyIndicatorMap, type Observation } from './data/research';

type DataStatus = 'loading' | 'live' | 'fallback';
type WorldBankRow = { date:string; value:number | null };
type WorldBankMeta = { lastupdated?:string };

export function useLiveEconomy() {
  const [indicators,setIndicators] = useState<EconomyIndicatorMap>(economyIndicators);
  const [status,setStatus] = useState<DataStatus>('loading');
  const [lastUpdated,setLastUpdated] = useState('2026-07-13');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(),8000);

    async function load() {
      try {
        const entries = await Promise.all(Object.entries(economyIndicators).map(async ([key,indicator]) => {
          const url = `https://api.worldbank.org/v2/country/IND/indicator/${indicator.apiCode}?format=json&per_page=100&date=2004:2030`;
          const response = await fetch(url,{signal:controller.signal,cache:'no-store'});
          if (!response.ok) throw new Error(`World Bank request failed: ${response.status}`);
          const payload = await response.json() as [WorldBankMeta,WorldBankRow[]];
          const values:Observation[] = (payload[1] ?? [])
            .filter(row => row.value !== null)
            .map(row => ({year:Number(row.date),value:Number(row.value)}))
            .filter(row => Number.isFinite(row.year) && Number.isFinite(row.value))
            .sort((a,b) => a.year-b.year);
          if (!values.length) throw new Error('World Bank response contained no observations');
          return [key,{...indicator,values},payload[0]?.lastupdated] as const;
        }));

        if (controller.signal.aborted) return;
        setIndicators(Object.fromEntries(entries.map(([key,indicator]) => [key,indicator])));
        setLastUpdated(entries.find(([, ,date]) => date)?.[2] ?? 'latest release');
        setStatus('live');
      } catch {
        if (!controller.signal.aborted) setStatus('fallback');
      } finally {
        window.clearTimeout(timeout);
      }
    }

    load();
    return () => { controller.abort(); window.clearTimeout(timeout); };
  },[]);

  return { indicators, status, lastUpdated };
}
