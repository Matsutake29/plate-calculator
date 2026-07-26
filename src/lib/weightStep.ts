import type { PlateWeight } from './calculatePlates'
import { toKg, toUnits } from './calculatePlates'

// プレートが1枚も使えない場合の便宜上の刻み。実際にはバー+カラーから動かせないので
// 丸めの結果には影響しないが、0除算を避けるために値を持たせている
const FALLBACK_STEP = 2.5

/**
 * その環境で実現できる目標重量の刻み幅を返す。
 *
 * バーベルは両側対称なので、合計重量は「片側に足した分の2倍」でしか動かない。
 * つまり使えるいちばん軽いディスクの2倍が、動かせる最小の単位になる。
 * 0.25kgディスクをonにすると合計0.5kg刻みになり、これはIPFの記録更新の
 * 最小幅（新記録は既存記録より最低0.5kg上）と一致する。
 */
export const getWeightStep = (availablePlates: PlateWeight[]): number => {
  if (availablePlates.length === 0) return FALLBACK_STEP
  return Math.min(...availablePlates) * 2
}

/**
 * 目標重量をその環境で実現できる値に丸める。
 *
 * 丸めるのはバー+カラーを差し引いた「プレートで積む分」で、バー重量そのものは動かさない。
 * 入力値と計算結果がズレないよう、UIから受け取った値は必ずここを通す。
 */
export const roundTargetWeight = (
  targetWeight: number,
  baseWeight: number,
  step: number,
): number => {
  const baseUnits = toUnits(baseWeight)
  const plateUnits = toUnits(targetWeight) - baseUnits
  if (plateUnits <= 0) return baseWeight

  const stepUnits = toUnits(step)
  return toKg(baseUnits + Math.round(plateUnits / stepUnits) * stepUnits)
}
