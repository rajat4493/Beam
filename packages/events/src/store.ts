import type { Interaction } from "../../core/src/interaction.ts";

/** In-memory local store. Production adapter must use Postgres unique(provider,event_id). */
export class EventStore {
  private events = new Set<string>(); private interactions: Interaction[] = []; private subscribers = new Set<(i: Interaction) => void>();
  recordEvent(id: string) { if (this.events.has(id)) return false; this.events.add(id); return true; }
  add(i: Interaction) { this.interactions.push(i); this.subscribers.forEach(f => f(i)); }
  list(creatorId: string) { return this.interactions.filter(x => x.creatorId === creatorId); }
  subscribe(fn: (i: Interaction) => void) { this.subscribers.add(fn); return () => this.subscribers.delete(fn); }
}
