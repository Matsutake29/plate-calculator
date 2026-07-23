# plate-calculator

パワーリフティング／ウエイトトレーニング向けのプレート計算アプリ。目標重量からバーベル片側のプレート構成を計算する。DB不要・フロントエンド完結。

## 技術スタック

Vite / React / TypeScript / Tailwind CSS / Vitest / GitHub Actions（CI）/ husky / Vercel

## 開発コマンド

- `npm run dev` — 開発サーバー
- `npm test` — テスト（Vitest）
- `npm run lint` / `npm run format:check` — ESLint / Prettier
- `npm run build` — 型チェック込みの本番ビルド

## Git運用（GitHub Flow）

- **mainは常にデプロイ可能**。main直pushしない。作業はfeatureブランチ＋PR
- **Conventional Commits**: feat / fix / docs / refactor / test / chore / ci
- コミットメッセージ: subjectは英語（小文字始まり・動詞の原形・50字目安）、bodyは日本語で「なぜ」を書く。絵文字は使わない
- PRの説明には「何を・なぜ・確認方法」を書く。タスクはGitHub Issuesと紐づける

## 設計方針

- 計算ロジックはUIから分離した純粋関数として実装し、Vitestでエッジケースをテストする
- push/PR時にESLint + Prettier check + Vitest + buildをCIで実行。huskyのpre-commitと二段構え
