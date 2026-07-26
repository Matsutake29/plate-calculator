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

const INITIAL_BAR_WEIGHT: BarWeight = 20
const INITIAL_COLLAR_WEIGHT: CollarWeight = 0

// 要件定義の既定値: 25〜1.25kgはon、0.5/0.25kg（記録挑戦用の小プレート）はoff
const INITIAL_PLATE_AVAILABILITY: Record<PlateWeight, boolean> = {
  25: true,
  20: true,
  15: true,
  10: true,
  5: true,
  2.5: true,
  1.25: true,
  0.5: false,
  0.25: false,
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

  const availablePlates = PLATE_WEIGHTS.filter(
    (weight) => plateAvailability[weight],
  )

  const result = calculatePlates({
    targetWeight,
    barWeight,
    collarWeight,
    availablePlates,
  })

  const handleTogglePlate = (weight: PlateWeight) => {
    setPlateAvailability((prev) => ({ ...prev, [weight]: !prev[weight] }))
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-4 p-4">
      <h1 className="text-lg font-bold text-text">プレート計算機</h1>

      <WeightInput value={targetWeight} onChange={setTargetWeight} />

      <EnvironmentSettings
        barWeight={barWeight}
        onBarWeightChange={setBarWeight}
        collarWeight={collarWeight}
        onCollarWeightChange={setCollarWeight}
        plateAvailability={plateAvailability}
        onTogglePlate={handleTogglePlate}
      />

      <PlateResult result={result} />
    </main>
  )
}

export default App
