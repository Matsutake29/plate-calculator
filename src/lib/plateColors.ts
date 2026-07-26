import type { PlateWeight } from './calculatePlates'

// IPFが色を規定しているのは25kg(赤)・20kg(青)・15kg(黄)の3つだけで、
// 10kg以下は "any color"（IPF Technical Rulebook 2.3(b)6）。
// 10kg以下はEleiko等の製品で事実上の標準になっている色を採用し、
// 規定のない1kg以下は互いに識別できることを優先して選んでいる。
// 背景との分離は描画側の輪郭（--plate-edge）が担うので、ここは実物の色だけを持つ
export const PLATE_COLORS: Record<PlateWeight, string> = {
  25: '#dc2626',
  20: '#2563eb',
  15: '#eab308',
  10: '#16a34a',
  5: '#f8fafc',
  2.5: '#18181b',
  1.25: '#f97316',
  1: '#94a3b8',
  0.5: '#cbd5e1',
  0.25: '#d4af37',
}
