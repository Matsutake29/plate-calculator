// バー・カラーは選択式なので、あり得る値だけをリテラル型で列挙している
export type BarWeight = 20 | 15 | 10
export type CollarWeight = 0 | 5 // 2.5kg×2 または なし
export type PlateWeight = 25 | 20 | 15 | 10 | 5 | 2.5 | 1.25 | 0.5 | 0.25

// IPF/JPA規定のプレートラインナップ（重い順）
export const PLATE_WEIGHTS: PlateWeight[] = [
  25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25,
]

// calculatePlatesへの入力
export type CalculatePlatesInput = {
  targetWeight: number
  barWeight: BarWeight
  collarWeight: CollarWeight
  availablePlates: PlateWeight[] // 在庫onになっている種別だけを渡す想定
}

// 片側の内訳の1行分（例: 25kg×2枚）
export type PlateBreakdownItem = {
  weight: PlateWeight
  count: number
}

// calculatePlatesの戻り値。okの値によって形が変わる「判別可能Union」という型
// - ok: true                      → 計算成功。片側重量・内訳・不足分を返す
// - ok: false, targetBelowMinimum → 目標重量がバー+カラーの合計未満で計算不能
// - ok: false, invalidInput      → 目標重量が不正な値（負数やNaNなど）
export type CalculatePlatesResult =
  | {
      ok: true
      achievedPerSideWeight: number // 実際に組めた片側重量（内訳の合計）
      breakdown: PlateBreakdownItem[]
      shortfall: number // 不足分（合計・0なら理論値ぴったり）
    }
  | {
      ok: false
      reason: 'targetBelowMinimum'
      minimumWeight: number // バー+カラーの合計（この重量未満は計算不能）
    }
  | {
      ok: false
      reason: 'invalidInput'
    }

// 0.25kg単位を1とする整数に変換し、浮動小数点誤差を避ける（例: 0.1+0.2の丸め誤差問題）
const UNIT_KG = 0.25
const toUnits = (kg: number): number => Math.round(kg / UNIT_KG)
const toKg = (units: number): number => units * UNIT_KG

export const calculatePlates = (
  input: CalculatePlatesInput,
): CalculatePlatesResult => {
  const { targetWeight, barWeight, collarWeight, availablePlates } = input

  // 入力バリデーション: 負数・NaN・Infinityは計算不能として弾く
  if (!Number.isFinite(targetWeight) || targetWeight < 0) {
    return { ok: false, reason: 'invalidInput' }
  }

  const targetUnits = toUnits(targetWeight)
  const minimumUnits = toUnits(barWeight) + toUnits(collarWeight)

  // 目標重量がバー+カラーの合計に届かない場合、両側対称の前提が崩れるためエラーにする
  if (targetUnits < minimumUnits) {
    return {
      ok: false,
      reason: 'targetBelowMinimum',
      minimumWeight: toKg(minimumUnits),
    }
  }

  // 両側対称の前提で片側分を算出。奇数単位分の端数は自動的にshortfallへ落ちる
  const perSideTargetUnits = Math.floor((targetUnits - minimumUnits) / 2)

  // 重い順に並べ替え、大きいプレートから「入るだけ入れる」貪欲法
  // IPF規定の「重い順に内側から」と一致する一方、在庫が歯抜けだと最適な組み合わせにならないことがある（仕様通りの挙動）
  const sortedPlates = [...availablePlates].sort((a, b) => b - a)
  let remainingUnits = perSideTargetUnits
  const breakdown: PlateBreakdownItem[] = []

  for (const plate of sortedPlates) {
    const plateUnits = toUnits(plate)
    if (plateUnits <= 0 || plateUnits > remainingUnits) continue // 残り以下のプレートだけ使う

    const count = Math.floor(remainingUnits / plateUnits)
    breakdown.push({ weight: plate, count })
    remainingUnits -= count * plateUnits
  }

  // 貪欲ループ後も余った分＝組めなかった分。合計（両側分）に換算してshortfallとする
  const achievedPerSideUnits = perSideTargetUnits - remainingUnits
  const shortfallUnits = targetUnits - minimumUnits - achievedPerSideUnits * 2

  return {
    ok: true,
    achievedPerSideWeight: toKg(achievedPerSideUnits),
    breakdown,
    shortfall: toKg(shortfallUnits),
  }
}
