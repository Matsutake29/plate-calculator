import { describe, expect, it } from 'vitest'
import { PLATE_WEIGHTS } from './calculatePlates'
import { getWeightStep, roundTargetWeight } from './weightStep'

describe('getWeightStep', () => {
  it('既定の在庫（最小1.25kg）では2.5kg刻みになる', () => {
    const step = getWeightStep(PLATE_WEIGHTS.filter((weight) => weight >= 1.25))
    expect(step).toBe(2.5)
  })

  it('0.25kgプレートをonにすると0.5kg刻みになる（IPFの記録更新の最小幅と一致）', () => {
    expect(getWeightStep(PLATE_WEIGHTS)).toBe(0.5)
  })

  it('最小が0.5kgなら1kg刻みになる', () => {
    const step = getWeightStep(PLATE_WEIGHTS.filter((weight) => weight >= 0.5))
    expect(step).toBe(1)
  })

  it('25kgしか使えないジムでは50kg刻みになる', () => {
    expect(getWeightStep([25])).toBe(50)
  })

  it('プレートが1枚も使えなくても0除算にならない', () => {
    expect(getWeightStep([])).toBe(2.5)
  })
})

describe('roundTargetWeight', () => {
  it('刻みに乗っている値はそのまま返す', () => {
    expect(roundTargetWeight(142.5, 25, 2.5)).toBe(142.5)
  })

  it('刻みに乗らない値は近い方へ丸める', () => {
    expect(roundTargetWeight(101, 25, 2.5)).toBe(100)
    expect(roundTargetWeight(101.5, 25, 2.5)).toBe(102.5)
  })

  it('両側対称では作れない0.25kg刻みの入力は0.5kg刻みに寄せる', () => {
    // 合計+0.25kgは片側+0.125kgとなり、そんなプレートは存在しない
    expect(roundTargetWeight(100.25, 20, 0.5)).toBe(100.5)
  })

  it('丸めるのはプレート分だけで、バー+カラーの重量は動かさない', () => {
    // バー15kg+カラーなし。基礎重量が刻みの倍数でなくても片側は必ず組める値になる
    expect(roundTargetWeight(100, 15, 2)).toBe(101)
  })

  it('下限（バー+カラー）を下回る値は下限に張り付く', () => {
    expect(roundTargetWeight(10, 25, 2.5)).toBe(25)
  })

  it('0.25kg単位を重ねても浮動小数点誤差が出ない', () => {
    expect(roundTargetWeight(200.5, 25, 0.5)).toBe(200.5)
    expect(roundTargetWeight(100.75, 25, 0.25)).toBe(100.75)
  })

  it('刻みのちょうど中間にある値は上側に丸める', () => {
    // 58.75kgは58.5kgと59kgのどちらからも0.25kg。重い側に倒す
    expect(roundTargetWeight(58.75, 20, 0.5)).toBe(59)
  })
})
