import type { PlateWeight } from './calculatePlates'

// IPF Technical Rules Book準拠の色。1.25kg以下は出典が二次情報のため仮値
// （設計思想.md 2026-07-24参照。クロム説あり、実装時要最終確認のまま据え置き）
// 背景との分離は描画側の輪郭（--plate-edge）が担うので、ここは実物の色だけを持つ
export const PLATE_COLORS: Record<PlateWeight, string> = {
  25: '#dc2626',
  20: '#2563eb',
  15: '#eab308',
  10: '#16a34a',
  5: '#f8fafc',
  2.5: '#18181b',
  1.25: '#f97316',
  0.5: '#cbd5e1',
  0.25: '#d4af37',
}
