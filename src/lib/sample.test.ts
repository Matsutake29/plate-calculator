import { describe, expect, it } from 'vitest'

// ツールチェーン動作確認用のサンプル。工程3でプレート計算ロジックの実テストに置き換える
const add = (a: number, b: number): number => a + b

describe('sample', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
})
