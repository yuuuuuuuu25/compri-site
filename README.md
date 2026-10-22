# Compri Support Site

Compriの公式サポート・法務サイトです。Astroで生成する静的サイトとして構成し、日本語版と英語版を収録しています。

## 開発

```sh
npm install
npm run dev
```

型・構文チェックと本番ビルド:

```sh
npm run check
npm run build
```

`npm run build` はAstroの検査・静的ビルドに続き、内部リンク、canonical、日英hreflang、sitemap、ドラフト制御、文書改訂日を自動検証します。

## ページ構成

- `/`、`/en/`: 公式トップ
- `/support/`、`/en/support/`: FAQ・問い合わせ
- `/privacy/`、`/en/privacy/`: プライバシーポリシー
- `/terms/`、`/en/terms/`: 利用規約
- `/account-deletion/`、`/en/account-deletion/`: アカウント削除案内

内部運用資料:

- `docs/publication-checklist.md`: 独自ドメイン、法務、Apple、公開作業のチェックリスト
- `docs/app-store-connect-privacy-matrix.md`: App Store Connect、Privacy Manifest、実装の照合表

## 公開前に確定する項目

正式情報は `src/config/site.ts` に集約しています。次の項目を確定し、`draft` を `false` にしてから公開してください。

- 運営者名（個人名・屋号・法人名）
- 独自ドメイン: `compri.jp`（取得済み）
- ドメインの問い合わせ用メールアドレス
- 対象年齢と未成年者の扱い
- 準拠法・合意管轄
- 日本語・英語ドラフトの法務確認
- App Store Connectのプライバシー回答との最終照合

`draft: true` の間は全ページにドラフト表示と `noindex, nofollow` を付け、生成する`robots.txt`でもクロールを拒否します。

## GitHub Pages

`.github/workflows/deploy.yml` は `main` へのpushでビルド・デプロイします。公開先は `https://compri.jp` です。

```yaml
SITE_URL: https://compri.jp
BASE_PATH: /
```

GitHub Pages側のCustom domainは設定済みです。XServerドメインのDNS設定とHTTPS発行確認が残っています。
