import { describe, expect, it } from 'vitest'
import {
  DOODLE,
  FIRST_SPAWN,
  ITEM_RADIUS,
  MAX_DT,
  NO_INPUT,
  WORLD,
  createState,
  doodleBox,
  seededRng,
  step,
  type DoodleConfig,
  type SimState,
} from './sim'

const config: DoodleConfig = {
  startSpeed: 100,
  speedRamp: 10,
  maxSpeed: 150,
  spawnInterval: 1,
  negativeShare: 0.3,
}
const kinds = ['positive', 'positive', 'negative'] as const

function fresh(): SimState {
  return createState(config, [...kinds])
}

function run(state: SimState, seconds: number, rng = seededRng(1), input = NO_INPUT): SimState {
  let s = state
  for (let t = 0; t < seconds; t += 1 / 60) s = step(s, input, 1 / 60, rng)
  return s
}

/** Place one item straight above the doodle, just about to touch it. */
function withItemOnDoodle(kind: 'positive' | 'negative'): SimState {
  const s = fresh()
  const top = doodleBox(s.doodleX).top
  return {
    ...s,
    spawnIn: 99,
    items: [
      { id: 1, item: kind === 'positive' ? 0 : 2, kind, x: s.doodleX, y: top - ITEM_RADIUS - 1 },
    ],
  }
}

describe('doodle simulation step()', () => {
  it('is deterministic with a seeded random source', () => {
    const a = run(fresh(), 10, seededRng(42))
    const b = run(fresh(), 10, seededRng(42))
    expect(a).toEqual(b)
  })

  it('spawns the first item after a short pause, then one per spawnInterval', () => {
    let s = run(fresh(), FIRST_SPAWN - 0.05)
    expect(s.nextId).toBe(1)
    s = run(fresh(), FIRST_SPAWN + 2.01)
    expect(s.nextId - 1).toBe(3)
  })

  it('raises the speed from startSpeed by speedRamp and caps it at maxSpeed', () => {
    expect(run(fresh(), 2).speed).toBeCloseTo(120, 0)
    expect(run(fresh(), 20, seededRng(3), { targetX: null, dir: 0 }).speed).toBeLessThanOrEqual(150)
  })

  it('adds a point and records the word when a positive item is caught', () => {
    const s = step(withItemOnDoodle('positive'), NO_INPUT, 0.02, seededRng(1))
    expect(s.score).toBe(1)
    expect(s.items).toHaveLength(0)
    expect(s.lastCatch?.item).toBe(0)
    expect(s.phase).toBe('playing')
  })

  it('ends the run when a negative item touches the doodle, and remembers which', () => {
    const s = step(withItemOnDoodle('negative'), NO_INPUT, 0.02, seededRng(1))
    expect(s.phase).toBe('over')
    expect(s.hit).toBe(2)
    expect(step(s, NO_INPUT, 0.02, seededRng(1))).toBe(s) // nothing changes after game over
  })

  it('lets missed items fall away at no cost', () => {
    const s0 = fresh()
    const s = run(
      {
        ...s0,
        spawnIn: 99,
        items: [{ id: 1, item: 0, kind: 'positive', x: 20, y: WORLD.height - 5 }],
      },
      1,
      seededRng(1),
      {
        targetX: WORLD.width - 10,
        dir: 0,
      },
    )
    expect(s.items).toHaveLength(0)
    expect(s.score).toBe(0)
    expect(s.phase).toBe('playing')
  })

  it('moves by direction and follows a drag, staying inside the play area', () => {
    const left = run(fresh(), 3, seededRng(1), { targetX: null, dir: -1 })
    expect(left.doodleX).toBe(DOODLE.width / 2)
    const s = step({ ...fresh(), spawnIn: 99 }, { targetX: 300, dir: 0 }, 0.05, seededRng(1))
    expect(s.doodleX).toBe(250) // 180 + 1400 * 0.05 = 250, still heading to 300
    expect(
      run({ ...fresh(), spawnIn: 99 }, 1, seededRng(1), { targetX: 300, dir: 0 }).doodleX,
    ).toBe(300)
  })

  it('clamps large time gaps so nothing jumps', () => {
    const s = step({ ...fresh(), spawnIn: 99 }, { targetX: null, dir: 1 }, 5, seededRng(1))
    expect(s.time).toBeCloseTo(MAX_DT)
    expect(s.doodleX).toBeCloseTo(WORLD.width / 2 + DOODLE.speed * MAX_DT)
  })

  it('spawns roughly negativeShare negative items', () => {
    const rng = seededRng(7)
    let s = { ...fresh(), config: { ...config, spawnInterval: 0.01 } }
    let negatives = 0
    let total = 0
    for (let i = 0; i < 2000; i++) {
      const before = s.nextId
      s = step({ ...s, items: [] }, NO_INPUT, 0.01, rng)
      total += s.nextId - before
      negatives += s.items.filter((it) => it.kind === 'negative').length
    }
    expect(negatives / total).toBeGreaterThan(0.25)
    expect(negatives / total).toBeLessThan(0.35)
  })
})
