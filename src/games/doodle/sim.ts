/**
 * Doodle catcher simulation. Pure: step(state, input, dt, rng) returns the
 * next state and never touches the screen, so it can be tested with a seeded
 * random source. Drawing lives in draw.ts.
 *
 * Units: the play area is a fixed logical size (WORLD); speeds are in
 * logical pixels per second; times are in seconds.
 */

export const WORLD = { width: 360, height: 480 } as const
export const DOODLE = {
  width: 76,
  height: 56,
  bottomGap: 14,
  speed: 340,
  followSpeed: 1400,
} as const
export const ITEM_RADIUS = 24
/** Larger frame gaps (a slow device, a background tab) are clamped so items never jump. */
export const MAX_DT = 0.05
/** Seconds before the first item appears. */
export const FIRST_SPAWN = 0.6

export type ItemKind = 'positive' | 'negative'

export interface DoodleConfig {
  startSpeed: number
  speedRamp: number
  maxSpeed: number
  spawnInterval: number
  negativeShare: number
}

export interface FallingItem {
  id: number
  /** Index into the item catalogue (content/doodle-items.json). */
  item: number
  kind: ItemKind
  x: number
  y: number
}

export interface Catch {
  item: number
  /** Simulation time of the catch. */
  at: number
}

export interface SimState {
  phase: 'playing' | 'over'
  time: number
  speed: number
  spawnIn: number
  doodleX: number
  items: FallingItem[]
  score: number
  nextId: number
  lastCatch: Catch | null
  /** The negative item that ended the run. */
  hit: number | null
  config: DoodleConfig
  /** Kind of each catalogue item, by index. */
  kinds: ItemKind[]
}

export interface SimInput {
  /** Pointer drag: the doodle follows this x (logical pixels). */
  targetX: number | null
  /** Arrow keys, A/D, or holding one half of the play area: -1 left, 1 right. */
  dir: -1 | 0 | 1
}

export const NO_INPUT: SimInput = { targetX: null, dir: 0 }

export type Rng = () => number

/** Small seeded random source (mulberry32), for tests and replays. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createState(config: DoodleConfig, kinds: ItemKind[]): SimState {
  return {
    phase: 'playing',
    time: 0,
    speed: config.startSpeed,
    spawnIn: FIRST_SPAWN,
    doodleX: WORLD.width / 2,
    items: [],
    score: 0,
    nextId: 1,
    lastCatch: null,
    hit: null,
    config,
    kinds,
  }
}

/** The doodle's catching box, in logical pixels. */
export function doodleBox(x: number) {
  const top = WORLD.height - DOODLE.bottomGap - DOODLE.height
  return {
    left: x - DOODLE.width / 2,
    right: x + DOODLE.width / 2,
    top,
    bottom: top + DOODLE.height,
  }
}

function touches(item: FallingItem, doodleX: number): boolean {
  const box = doodleBox(doodleX)
  const nearestX = Math.max(box.left, Math.min(item.x, box.right))
  const nearestY = Math.max(box.top, Math.min(item.y, box.bottom))
  const dx = item.x - nearestX
  const dy = item.y - nearestY
  return dx * dx + dy * dy <= ITEM_RADIUS * ITEM_RADIUS
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function pick(rng: Rng, kinds: ItemKind[], kind: ItemKind): number {
  const choices = kinds.flatMap((k, i) => (k === kind ? [i] : []))
  return choices[Math.floor(rng() * choices.length)] ?? 0
}

export function step(state: SimState, input: SimInput, rawDt: number, rng: Rng): SimState {
  if (state.phase !== 'playing') return state
  const dt = clamp(rawDt, 0, MAX_DT)
  const { config, kinds } = state
  const time = state.time + dt
  const speed = Math.min(config.maxSpeed, config.startSpeed + config.speedRamp * time)

  // Move the doodle: follow the finger when dragging, otherwise steer by direction.
  let doodleX = state.doodleX
  if (input.targetX !== null) {
    const gap = input.targetX - doodleX
    doodleX += Math.sign(gap) * Math.min(Math.abs(gap), DOODLE.followSpeed * dt)
  } else {
    doodleX += input.dir * DOODLE.speed * dt
  }
  doodleX = clamp(doodleX, DOODLE.width / 2, WORLD.width - DOODLE.width / 2)

  // Spawn new items.
  let spawnIn = state.spawnIn - dt
  let nextId = state.nextId
  const items = state.items.map((it) => ({ ...it, y: it.y + speed * dt }))
  const hasNegative = kinds.includes('negative')
  while (spawnIn <= 0) {
    const kind: ItemKind = hasNegative && rng() < config.negativeShare ? 'negative' : 'positive'
    items.push({
      id: nextId++,
      item: pick(rng, kinds, kind),
      kind,
      x: ITEM_RADIUS + rng() * (WORLD.width - 2 * ITEM_RADIUS),
      y: -ITEM_RADIUS,
    })
    spawnIn += config.spawnInterval
  }

  // Catch, hit or miss.
  let score = state.score
  let lastCatch = state.lastCatch
  const kept: FallingItem[] = []
  for (const it of items) {
    if (touches(it, doodleX)) {
      if (it.kind === 'negative') {
        return {
          ...state,
          phase: 'over',
          time,
          speed,
          spawnIn,
          doodleX,
          items,
          nextId,
          hit: it.item,
        }
      }
      score += 1
      lastCatch = { item: it.item, at: time }
      continue
    }
    if (it.y - ITEM_RADIUS > WORLD.height) continue // missed: costs nothing
    kept.push(it)
  }

  return { ...state, time, speed, spawnIn, doodleX, items: kept, score, nextId, lastCatch }
}
