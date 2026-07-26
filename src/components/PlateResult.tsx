import type { CalculatePlatesResult, PlateWeight } from '../lib/calculatePlates'
import { PLATE_COLORS } from '../lib/plateColors'

type PlateResultProps = {
  result: CalculatePlatesResult
}

// 重量が大きいほど高さを大きくする。IPF規定の実寸比ではなく見た目上の大小表現
const plateHeight = (weight: PlateWeight): string => {
  if (weight >= 20) return '64px'
  if (weight >= 10) return '56px'
  if (weight >= 5) return '44px'
  if (weight >= 2.5) return '36px'
  if (weight >= 1.25) return '28px'
  return '22px'
}

const PlateResult = ({ result }: PlateResultProps) => {
  if (!result.ok) {
    const message =
      result.reason === 'targetBelowMinimum'
        ? `目標重量が軽すぎます。バーとカラーの合計 ${result.minimumWeight}kg 以上を入力してください。`
        : '0以上の重量を入力してください。'

    return (
      <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-text-sub">
        {message}
      </div>
    )
  }

  const { achievedPerSideWeight, breakdown, shortfall } = result

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs text-text-sub">片側</p>
      <p className="text-2xl font-bold text-accent tabular-nums">
        {achievedPerSideWeight}
        <span className="ml-1 text-sm font-medium text-text-sub">kg</span>
      </p>

      {shortfall > 0 && (
        <p className="mt-1 text-xs text-text-sub">
          あと{shortfall}kg分、組める在庫がありません
        </p>
      )}

      <div
        className="mt-4 flex h-16 items-end gap-[3px] border-b-2 border-text-sub px-1"
        aria-hidden="true"
      >
        {breakdown.flatMap((item) =>
          Array.from({ length: item.count }, (_, i) => (
            <span
              key={`${item.weight}-${i}`}
              className="w-3.5 rounded-t-sm border border-plate-edge"
              style={{
                height: plateHeight(item.weight),
                background: PLATE_COLORS[item.weight],
              }}
            />
          )),
        )}
      </div>

      <p className="mt-3 text-xs text-text-sub">
        {breakdown.length > 0
          ? breakdown.map((item) => `${item.weight}kg×${item.count}`).join('　')
          : '装着なし'}
      </p>
    </div>
  )
}

export default PlateResult
