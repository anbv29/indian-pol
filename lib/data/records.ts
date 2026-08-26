export type PartyKey = 'bjp' | 'congress';

export type TimelineItem = {
  id: string;
  year: number;
  date: string;
  category: string;
  title: string;
  summary: string;
  importance: 'major' | 'standard';
  sourceCount: number;
};

export const governments = {
  bjp: {
    party: 'BJP',
    label: 'BJP-led government',
    coalition: 'NDA',
    period: '2014 — 2024',
    years: Array.from({ length: 11 }, (_, index) => 2014 + index),
    chart: [100, 106, 104, 111, 115, 109, 113, 121, 128, 133],
  },
  congress: {
    party: 'CONGRESS',
    label: 'Congress-led government',
    coalition: 'UPA',
    period: '2004 — 2014',
    years: Array.from({ length: 11 }, (_, index) => 2004 + index),
    chart: [100, 103, 108, 107, 112, 117, 115, 120, 124, 126],
  },
} satisfies Record<PartyKey, {
  party: string;
  label: string;
  coalition: string;
  period: string;
  years: number[];
  chart: number[];
}>;

const categories = ['Government', 'Laws & Bills', 'Policies', 'Economy', 'Infrastructure', 'Social Policy', 'Foreign Policy'];

export function getTimeline(party: PartyKey): TimelineItem[] {
  return governments[party].years.flatMap((year, index) => [
    {
      id: `${party}-${year}-a`,
      year,
      date: `Term year ${index + 1}`,
      category: categories[index % categories.length],
      title: 'Illustrative public record entry',
      summary: 'A demonstration of how a verified government action, institutional record, and source trail will appear in the archive.',
      importance: index % 3 === 0 ? 'major' as const : 'standard' as const,
      sourceCount: 3,
    },
    ...(index % 2 === 0 ? [{
      id: `${party}-${year}-b`,
      year,
      date: 'Sample chronology',
      category: categories[(index + 2) % categories.length],
      title: 'Sample policy lifecycle record',
      summary: 'Placeholder content for a dated, categorized record. It is intentionally not presented as a verified historical claim.',
      importance: 'standard' as const,
      sourceCount: 2,
    }] : []),
  ]);
}

export const manifestoMetrics = [
  ['TOTAL IDENTIFIED', '120'],
  ['ASSESSED', '96'],
  ['SUBSTANTIALLY FULFILLED', '31'],
  ['PARTIALLY FULFILLED', '27'],
  ['IN PROGRESS', '18'],
  ['INSUFFICIENT EVIDENCE', '20'],
];

export const legislationSamples = [
  { name: 'Illustrative Public Institutions Bill', year: 'Term year 2', type: 'Bill', status: 'Sample', category: 'Institutions', sources: 3 },
  { name: 'Sample Social Policy Act', year: 'Term year 4', type: 'Act', status: 'Sample', category: 'Social Policy', sources: 4 },
  { name: 'Illustrative Finance Amendment', year: 'Term year 7', type: 'Amendment', status: 'Sample', category: 'Economy', sources: 2 },
];

export const sourceHierarchy = [
  ['01', 'Primary official sources', 'Acts, bills, rules, notifications and official documents.'],
  ['02', 'Official institutional data', 'Statistical releases and datasets from public institutions.'],
  ['03', 'Parliamentary records', 'Questions, debates, committee reports and legislative records.'],
  ['04', 'Independent institutional research', 'Methodologically transparent research used with clear attribution.'],
];
