const STEP = 2.5

type WeightInputProps = {
  value: number
  onChange: (value: number) => void
}

const WeightInput = ({ value, onChange }: WeightInputProps) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <label htmlFor="target-weight" className="text-sm text-text-sub">
        目標重量
      </label>
      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onChange(value - STEP)}
          aria-label={`${STEP}kg減らす`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-lg text-text transition active:scale-95"
        >
          −
        </button>

        <div className="flex items-baseline gap-1">
          <input
            id="target-weight"
            type="number"
            inputMode="decimal"
            step={0.25}
            value={value}
            onChange={(e) => onChange(e.target.valueAsNumber)}
            className="w-28 border-none bg-transparent text-right text-3xl font-bold text-text tabular-nums outline-none"
          />
          <span className="text-base text-text-sub">kg</span>
        </div>

        <button
          type="button"
          onClick={() => onChange(value + STEP)}
          aria-label={`${STEP}kg増やす`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-lg text-text transition active:scale-95"
        >
          ＋
        </button>
      </div>
    </div>
  )
}

export default WeightInput
