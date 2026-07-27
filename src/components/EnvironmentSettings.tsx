import type {
  BarWeight,
  CollarWeight,
  PlateWeight,
} from '../lib/calculatePlates'
import { PLATE_WEIGHTS } from '../lib/calculatePlates'

const BAR_WEIGHTS: BarWeight[] = [20, 15, 10]

type EnvironmentSettingsProps = {
  barWeight: BarWeight
  onBarWeightChange: (value: BarWeight) => void
  collarWeight: CollarWeight
  onCollarWeightChange: (value: CollarWeight) => void
  plateAvailability: Record<PlateWeight, boolean>
  onTogglePlate: (weight: PlateWeight) => void
}

// 選択中/未選択でボタンの見た目を出し分ける（3種の選択UIで共通）。
// ホバーは面の色を一段変えるだけにとどめ、選択中を示すaccent色とは競合させない
const toggleButtonClass = (active: boolean) =>
  `focus-ring rounded-full border px-3 py-1.5 text-sm transition ${
    active
      ? 'border-accent bg-accent-soft font-semibold text-accent hover:bg-accent-soft-hover'
      : 'border-border bg-surface-2 text-text-sub hover:border-text-sub hover:bg-surface-hover hover:text-text'
  }`

const EnvironmentSettings = ({
  barWeight,
  onBarWeightChange,
  collarWeight,
  onCollarWeightChange,
  plateAvailability,
  onTogglePlate,
}: EnvironmentSettingsProps) => {
  return (
    <details className="group rounded-2xl border border-border bg-surface p-4">
      <summary className="focus-ring flex w-fit cursor-pointer list-none items-center gap-1 rounded-md text-sm font-medium text-text-sub transition hover:text-text marker:content-none">
        環境設定
        <span className="transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="mt-4 flex flex-col gap-4">
        <fieldset>
          <legend className="mb-2 text-xs text-text-sub">バー</legend>
          <div className="flex flex-wrap gap-2">
            {BAR_WEIGHTS.map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => onBarWeightChange(weight)}
                aria-pressed={barWeight === weight}
                className={toggleButtonClass(barWeight === weight)}
              >
                {weight}kg
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs text-text-sub">カラー</legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCollarWeightChange(0)}
              aria-pressed={collarWeight === 0}
              className={toggleButtonClass(collarWeight === 0)}
            >
              なし
            </button>
            <button
              type="button"
              onClick={() => onCollarWeightChange(5)}
              aria-pressed={collarWeight === 5}
              className={toggleButtonClass(collarWeight === 5)}
            >
              2.5kg×2
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs text-text-sub">
            使用可能プレート
          </legend>
          <div className="flex flex-wrap gap-2">
            {PLATE_WEIGHTS.map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => onTogglePlate(weight)}
                aria-pressed={plateAvailability[weight]}
                className={toggleButtonClass(plateAvailability[weight])}
              >
                {weight}kg
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </details>
  )
}

export default EnvironmentSettings
