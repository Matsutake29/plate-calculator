import { describe, expect, it } from 'vitest'
import { calculatePlates, PLATE_WEIGHTS } from './calculatePlates'

describe('calculatePlates', () => {
  it('正常系: 目標142.5kg・バー20kg・カラーありで正しく計算できる', () => {
    const result = calculatePlates({
      targetWeight: 142.5,
      barWeight: 20,
      collarWeight: 5,
      availablePlates: PLATE_WEIGHTS,
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.achievedPerSideWeight).toBe(58.75)
      expect(result.breakdown).toEqual([
        { weight: 25, count: 2 },
        { weight: 5, count: 1 },
        { weight: 2.5, count: 1 },
        { weight: 1.25, count: 1 },
      ])
      expect(result.shortfall).toBe(0)
    }
  })

  it('境界値: 目標がバー+カラーとちょうど同じ（25kg）で片側0kgになる', () => {
    const result = calculatePlates({
      targetWeight: 25,
      barWeight: 20,
      collarWeight: 5,
      availablePlates: PLATE_WEIGHTS,
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.achievedPerSideWeight).toBe(0)
      expect(result.breakdown).toEqual([])
      expect(result.shortfall).toBe(0)
    }
  })

  it('異常系: 目標がバー+カラー未満（20kg）で計算不能', () => {
    const result = calculatePlates({
      targetWeight: 10,
      barWeight: 20,
      collarWeight: 5,
      availablePlates: PLATE_WEIGHTS,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('targetBelowMinimum')
      if (result.reason === 'targetBelowMinimum') {
        expect(result.minimumWeight).toBe(25)
      }
    }
  })

  it('異常系: 目標が負数で計算不能', () => {
    const result = calculatePlates({
      targetWeight: -10,
      barWeight: 20,
      collarWeight: 5,
      availablePlates: PLATE_WEIGHTS,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('invalidInput')
    }
  })

  it('異常系: 目標がNaNで計算不能', () => {
    const result = calculatePlates({
      targetWeight: NaN,
      barWeight: 20,
      collarWeight: 5,
      availablePlates: PLATE_WEIGHTS,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('invalidInput')
    }
  })

  it('貪欲法の限界: 在庫が歯抜けだと理論上の最善にならず不足が出る', () => {
    // 25kgと20kgのみon。本当は20kg×2で片側40kgぴったり組めるが、
    // 貪欲法は25kgから使い切ろうとするため残り15kgが20kgでは埋まらず不足する（仕様通りの挙動）
    const result = calculatePlates({
      targetWeight: 100,
      barWeight: 20,
      collarWeight: 0,
      availablePlates: [25, 20],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.achievedPerSideWeight).toBe(25)
      expect(result.breakdown).toEqual([{ weight: 25, count: 1 }])
      expect(result.shortfall).toBe(30)
    }
  })

  it('小プレートoff: 0.25kg単位の端数を埋める手段がなくshortfallに残る', () => {
    // 143kgは0.25kg単位の値だが、片側の端数0.25kg分を埋めるには1.25kgより
    // 細かいプレートが要る。0.5kg・0.25kgをoffにするとそこで打ち止めになる
    const result = calculatePlates({
      targetWeight: 143,
      barWeight: 20,
      collarWeight: 5,
      availablePlates: PLATE_WEIGHTS.filter((weight) => weight >= 1.25),
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.breakdown).toEqual([
        { weight: 25, count: 2 },
        { weight: 5, count: 1 },
        { weight: 2.5, count: 1 },
        { weight: 1.25, count: 1 },
      ])
      expect(result.shortfall).toBe(0.5)
    }
  })
})
