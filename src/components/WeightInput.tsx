import { useState } from 'react'

// ステッパーの増減幅。ウォームアップで多用する刻みに合わせている。
// 実際に適用される値は親側でその環境の刻みに丸められる
const STEP_BUTTON_DELTA = 2.5

type WeightInputProps = {
  value: number
  onChange: (value: number) => void
  step: number // その環境で実現できる刻み幅（使えるいちばん軽いプレートの2倍）
  min: number // バー+カラーの合計。これ未満は組めない
  max: number
}

const WeightInput = ({ value, onChange, step, min, max }: WeightInputProps) => {
  // 入力途中の文字列。確定前は数値に変換せず持っておく。
  // nullのあいだは確定済みの値（props.value）を表示する
  const [draft, setDraft] = useState<string | null>(null)

  // 確定処理。不正な入力は捨てて元の値に戻す（NaNを親のstateに流さない）
  const commit = () => {
    if (draft !== null) {
      const parsed = Number(draft)
      if (draft.trim() !== '' && Number.isFinite(parsed)) {
        onChange(parsed)
      }
      setDraft(null)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor="target-weight" className="text-sm text-text-sub">
          目標重量
        </label>
        <span className="text-xs text-text-sub tabular-nums">{step}kg単位</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onChange(value - STEP_BUTTON_DELTA)}
          disabled={value <= min}
          aria-label={`${STEP_BUTTON_DELTA}kg減らす`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-lg text-text transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          −
        </button>

        <div className="flex items-baseline gap-1">
          <input
            id="target-weight"
            type="number"
            inputMode="decimal"
            step={step}
            min={min}
            max={max}
            value={draft ?? value}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
            className="w-28 border-none bg-transparent text-right text-3xl font-bold text-text tabular-nums outline-none"
          />
          <span className="text-base text-text-sub">kg</span>
        </div>

        <button
          type="button"
          onClick={() => onChange(value + STEP_BUTTON_DELTA)}
          disabled={value >= max}
          aria-label={`${STEP_BUTTON_DELTA}kg増やす`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-lg text-text transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          ＋
        </button>
      </div>
    </div>
  )
}

export default WeightInput
