export type Row = {
  id: string
  title: string
  isRunning: boolean
  isMidTurn: boolean
  lastActivityAt: string
  prNumber?: number
  prState?: string
  prRepo?: string
  isPinned: boolean
  isSide: boolean
  parentTitle?: string
  link?: string
  status: string
  mentioned?: string
  parentId?: string
  isWaiting?: boolean
  brief?: string
  branch?: string
  isFromHub?: boolean
}

export type Jira = { status: string; category: string; summary: string }

export type Pr = {
  repo: string
  number: number
  title: string
  url: string
  headRefName: string
  state: string
  ci: string | null
  review: string | null
  mergeable: string
  isDraft: boolean
  openThreads: number
  failing: string[]
}

export type Release = { repo: string; tag: string; pending: { number: number; title: string }[] }

export type UsageWindow = { label: string; percentUsed: number; resetsIn: string }

export type Usage = {
  windows: UsageWindow[]
  extra?: { isEnabled: boolean; percentUsed: number; spent: string; monthlyLimit: string; currency: string }
}

export type Edit = { id: string; kind: 'tag' | 'message' } | null

export type Filter = 'working' | 'needs' | 'prs' | 'close' | null

export type View = 'state' | 'ticket'

export type Tab = 'sessions' | 'prs' | 'tickets' | 'releases'


export type Draft = { key: string; summary: string } | null

export type SessionName = { title: string; name: string; isApplied?: boolean }

export type ReviewAsk = { repo: string; number: number; title: string; url: string; author: string; updatedAt: string }

export type Meeting = { title: string; start: string; end: string; join?: string; tickets: string[] }

export type SearchGroup = 'sessions' | 'tickets' | 'prs' | 'docs'

export type SearchHit = {
  group: SearchGroup
  key: string
  title: string
  detail: string
  href?: string
  sessionId?: string
  ticket?: string
}

export type Search = { query: string; hits: SearchHit[]; errors: Record<string, string>; isRunning: boolean } | null

export type Seen = { at: number; sig: Record<string, string> } | null

export type Band = { at: number; items: string[] } | null

export type Handled = { sig: string; at: number; isProposed: boolean }

export type Owner = { id: string; title: string }

export type CcConfig = {
  tickets?: { server: string; toolPrefix?: string; cloudId: string; browseUrl: string }
  github?: { owner?: string; releaseRepos?: string[] }
  search?: { server: string; tool: string; args?: Record<string, unknown> }
  calendar?: { server: string }
  commands?: { ticket?: string; release?: string; services?: string }
  repoNote?: string
  hide?: string[]
}

declare module 'claude-code' {
  interface PluginState {
    'session-board': {
      rows: Shaped<Row[]>
      tags: Record<string, string>
      jira: Record<string, Jira | null>
      prs: Shaped<Pr[]>
      releases: Shaped<Release[]>
      usage: Shaped<Usage | null>
      sources: Record<string, string>
      edit: Edit
      armed: string | null
      filter: Filter
      view: View
      draft: Draft
      standup: string | null
      polledAt: number
      isOpen: boolean
      isUsageCollapsed: boolean
      suggestions: Record<string, string[]>
      suggesting: string | null
      reply: string
      busy: Record<string, string>
      names: Record<string, SessionName>
      openForks: string[]
      note: string
      isOpen2: boolean
      tab: Tab
      expanded: string[]
      groupsOpen: string[]
      isOpen3: boolean
      reviews: ReviewAsk[]
      meetings: Meeting[]
      searchByView: Record<string, Exclude<Search, null>>
      seen: Seen
      brief: string | null
      focusByView: Record<string, string>
      band: Band
      collapsed: string[]
      handled: Record<string, Handled>
      owners: Record<string, Owner>
      choices: Record<string, Owner[]>
      holders: Record<string, Owner[]>
      config: CcConfig
      isDemo: boolean
      flightView: 'lanes' | 'cards'
      isNoteOpen: boolean
    }
  }
}
