import { useState } from 'react'
import EnvironmentSettings from './components/EnvironmentSettings'
import PlateResult from './components/PlateResult'
import WeightInput from './components/WeightInput'
import type {
  BarWeight,
  CollarWeight,
  PlateWeight,
} from './lib/calculatePlates'
import { calculatePlates, PLATE_WEIGHTS } from './lib/calculatePlates'
import { getWeightStep, roundTargetWeight } from './lib/weightStep'

const INITIAL_BAR_WEIGHT: BarWeight = 20
const INITIAL_COLLAR_WEIGHT: CollarWeight = 0

// 現実的な上限。全種目の世界記録でも単一種目は500kg台なので十分な余裕がある。
// 上限がないと極端な入力でプレートの描画要素が青天井に増える
const MAX_TARGET_WEIGHT = 1000

// 要件定義の既定値: 25〜1.25kgはon、1kg以下（記録挑戦用の小プレート）はoff
const INITIAL_PLATE_AVAILABILITY: Record<PlateWeight, boolean> = {
  25: true,
  20: true,
  15: true,
  10: true,
  5: true,
  2.5: true,
  1.25: true,
  1: false,
  0.5: false,
  0.25: false,
}

const availablePlatesOf = (availability: Record<PlateWeight, boolean>) =>
  PLATE_WEIGHTS.filter((weight) => availability[weight])

// 目標重量を「その環境で実際に組める値」に揃える。下限・上限で挟んでから刻みに丸める。
// 入力欄の表示と計算結果がズレないよう、目標重量を変える経路はすべてここを通す
const normalizeTargetWeight = (
  weight: number,
  baseWeight: number,
  availablePlates: PlateWeight[],
) => {
  const clamped = Math.min(Math.max(weight, baseWeight), MAX_TARGET_WEIGHT)
  return roundTargetWeight(clamped, baseWeight, getWeightStep(availablePlates))
}

function App() {
  const [targetWeight, setTargetWeight] = useState(
    INITIAL_BAR_WEIGHT + INITIAL_COLLAR_WEIGHT,
  )
  const [barWeight, setBarWeight] = useState<BarWeight>(INITIAL_BAR_WEIGHT)
  const [collarWeight, setCollarWeight] = useState<CollarWeight>(
    INITIAL_COLLAR_WEIGHT,
  )
  const [plateAvailability, setPlateAvailability] = useState(
    INITIAL_PLATE_AVAILABILITY,
  )

  const availablePlates = availablePlatesOf(plateAvailability)
  const minimumWeight = barWeight + collarWeight

  const result = calculatePlates({
    targetWeight,
    barWeight,
    collarWeight,
    availablePlates,
  })

  // 環境設定を変えると下限も刻みも変わるため、目標重量を新しい環境に合わせ直す。
  // 1つのイベントで複数のstateを整合させる必要があるので、updater functionではなく
  // 「次の環境」を先に組み立ててから両方を更新している
  const handleBarWeightChange = (nextBarWeight: BarWeight) => {
    setBarWeight(nextBarWeight)
    setTargetWeight(
      normalizeTargetWeight(
        targetWeight,
        nextBarWeight + collarWeight,
        availablePlates,
      ),
    )
  }

  const handleCollarWeightChange = (nextCollarWeight: CollarWeight) => {
    setCollarWeight(nextCollarWeight)
    setTargetWeight(
      normalizeTargetWeight(
        targetWeight,
        barWeight + nextCollarWeight,
        availablePlates,
      ),
    )
  }

  const handleTogglePlate = (weight: PlateWeight) => {
    const nextAvailability = {
      ...plateAvailability,
      [weight]: !plateAvailability[weight],
    }
    setPlateAvailability(nextAvailability)
    setTargetWeight(
      normalizeTargetWeight(
        targetWeight,
        minimumWeight,
        availablePlatesOf(nextAvailability),
      ),
    )
  }

  const handleTargetWeightChange = (nextTargetWeight: number) => {
    setTargetWeight(
      normalizeTargetWeight(nextTargetWeight, minimumWeight, availablePlates),
    )
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-4 p-4">
      <h1 className="text-lg font-bold text-text">プレート計算機</h1>

      <WeightInput
        value={targetWeight}
        onChange={handleTargetWeightChange}
        step={getWeightStep(availablePlates)}
        min={minimumWeight}
        max={MAX_TARGET_WEIGHT}
      />

      <EnvironmentSettings
        barWeight={barWeight}
        onBarWeightChange={handleBarWeightChange}
        collarWeight={collarWeight}
        onCollarWeightChange={handleCollarWeightChange}
        plateAvailability={plateAvailability}
        onTogglePlate={handleTogglePlate}
      />

      <PlateResult result={result} />
    </main>
  )
}

export default App
