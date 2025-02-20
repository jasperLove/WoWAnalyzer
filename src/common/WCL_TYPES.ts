import { AnyEvent, CastEvent, DeathEvent } from 'parser/core/Events';
import { WCLReport } from 'parser/core/Report';

export interface WCLGuildReport {
  id: string;
  title: string;
  owner: string;
  zone: number;
  start: number;
  end: number;
}

export type WCLGuildReportsResponse = WCLGuildReport[];

export type WCLFightsResponse = WCLReport;

export interface WCLEventsResponse {
  events: AnyEvent[];
  nextPageTimestamp?: number;
}

export interface WCLRankingsResponse {
  page: number;
  hasMorePages: boolean;
  count: number;
  rankings: WCLRanking[];
}

export interface WCLRanking {
  name: string;
  class: number;
  spec: number;
  total: number;
  duration: number;
  startTime: number;
  fightID: number;
  reportID: string;
  guildName: string;
  serverName: string;
  regionName: string;
  hidden: boolean;
  itemLevel: number;
}

export interface WCLHealing {
  total: number;
  overheal?: number;
}

export interface WCLHealingTableResponse {
  entries: WCLHealing[];
}

export interface WCLDamageTakenTableResponse {
  entries: WCLDamageTaken[];
  totalTime: number;
}

export interface WCLDamageDoneTableResponse {
  entries: WCLDamageDone[];
  totalTime: number;
}

// These should be the same data. Im just making it so things are logical
// Worst comes to worse we unextend it and just define it. But from my testing
// It works perfectly fine
export type WCLDamageDone = WCLDamageTaken;

export interface WCLDamageTaken {
  abilities: Array<{ name: string; total: number; totalReduced: number; type: number }>;
  sources: Array<{ name: string; total: number; totalReduced: number; type: string }>;
  activeTime: number;
  activeTimeReduced: number;
  efftmi: number;
  blocked: number;
  name: string;
  id: number;
  guid: number;
  total: number;
  overheal?: number;
}

export interface HeroismEvent {
  startTime: number;
  endTime: number;
  startEvent: CastEvent;
}

export interface BossSeries {
  name: string;
  id: number;
  guid: number;
  type: 'Boss';
  currentValues: number[];
  data: number[][];
  events: any[];
  maxValues: number[];
}

export interface WCLBossResources {
  deaths: DeathEvent[];
  heroism: HeroismEvent[];
  series: BossSeries[];
}

export type WCLResponseJSON =
  | WCLGuildReportsResponse
  | WCLFightsResponse
  | WCLEventsResponse
  | WCLHealingTableResponse
  | WCLDamageTakenTableResponse
  | WCLRankingsResponse
  | WCLBossResources
  | WCLDamageDoneTableResponse;

export interface WclOptions {
  timeout: number;

  [key: string]: number | string | boolean;
}
