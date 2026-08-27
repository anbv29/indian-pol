import type { Metadata } from 'next';
import { DossierExplorer } from '../../components/dossier-explorer';

export const metadata:Metadata={
  title:'Deep dossiers | India: The Record',
  description:'Source-backed deep reads on Indian laws, policies, treaties, defence pacts and trade agreements.',
  openGraph:{images:[]},
  twitter:{images:[]},
};

export default function DossiersPage(){ return <DossierExplorer/>; }
