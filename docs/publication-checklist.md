# Compri サポートサイト公開チェックリスト

最終更新: 2026-10-22

## 1. 運営方針を確定する

- [ ] 運営者の正式表記を個人名、屋号、法人名のどれにするか決める
- [ ] 独自ドメインを取得する
- [ ] ドメインメールを契約し、問い合わせ用アドレスを作成する
- [ ] SPF、DKIM、DMARCを設定する
- [ ] 対象年齢と未成年者の扱いを決める
- [ ] 準拠法、合意管轄、海外利用者向けの強行法規の扱いを専門家と確認する
- [ ] 将来の課金方法、返金、解約、責任上限をマネタイズ開始前に設計する

## 2. Supabaseと国外移転を確認する

- [ ] 本番SupabaseプロジェクトのリージョンをDashboardで確認する
- [ ] 契約主体、DPA、最新のsubprocessor一覧を確認する
- [ ] 選択リージョン外で行われる処理と国外移転の説明を確定する
- [ ] 日本の個人情報保護法上、Supabaseを委託先としてどう表示するか専門家に確認する
- [ ] 海外向け提供について、GDPR、UK GDPR、米国州法等の適用可能性を確認する

Supabaseは、選択リージョンが主データの保存場所を決める一方、サポートや運用等の限定的な処理がリージョン外で行われ得ると説明しています。リージョン選択だけで法令準拠を意味するものではありません。

公式情報:

- [Supabase Available regions](https://supabase.com/docs/guides/platform/regions)
- [Supabase Data Residency and Transfers FAQ](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq)
- [Supabase Data Processing Addendum](https://supabase.com/legal/customer-resources/data-processing-addendum)
- [Supabase Security](https://supabase.com/docs/guides/security)
- [個人情報保護委員会 法令・ガイドライン等](https://www.ppc.go.jp/personalinfo/legal/)

## 3. 公開文書を確定する

- [ ] `src/config/site.ts`の空欄を正式情報で埋める
- [ ] プライバシーポリシーを専門家に確認してもらう
- [ ] 利用規約を専門家に確認してもらう
- [ ] 日本語版と英語版の意味が一致していることを確認する
- [ ] Supabaseリージョン、国外移転、委託先の説明を確定する
- [ ] 対象年齢と保護者同意の説明を追加する
- [ ] 問い合わせ対応時間や返信方針を決める場合はサポートページへ追加する
- [ ] `draft`を`false`に変更する
- [ ] ドラフト表示、`noindex`、robotsの拒否が解除されることをビルドで確認する

## 4. 独自ドメインへ切り替える

- [ ] GitHub PagesのCustom domainを設定する
- [ ] DNSのA/AAAAまたはCNAMEをGitHubの案内に従って設定する
- [ ] HTTPS Enforceを有効にする
- [ ] `.github/workflows/deploy.yml`の`SITE_URL`を独自ドメインへ変更する
- [ ] `BASE_PATH`を`/`へ変更する
- [ ] 必要に応じて`public/CNAME`を追加する
- [ ] canonical、hreflang、sitemapが独自ドメインを指すことを確認する

## 5. CompriアプリへURLを設定する

`Compri/Compri/Features/Settings/AppAbout.swift`へ、公開確認済みのURLだけを設定します。

```swift
static let privacyPolicyURLString = "https://<domain>/privacy/"
static let termsURLString = "https://<domain>/terms/"
static let contactURLString = "https://<domain>/support/"
```

- [ ] 3 URLがHTTPSで200を返す
- [ ] 設定画面に3行が表示される
- [ ] 実機で各リンクが正しいページを開く
- [ ] VoiceOverラベルとヒントを確認する
- [ ] 日本語以外の端末で開くページの方針を決める

## 6. App Store Connectを更新する

- [ ] Privacy Policy URL
- [ ] User Privacy Choices URL
- [ ] Support URL
- [ ] App Privacyのデータ種類・目的・linked・tracking回答
- [ ] 年齢区分質問
- [ ] 輸出コンプライアンス質問
- [ ] App Review Notesに匿名認証、Apple連携、共有、アカウント削除の確認手順を記載する
- [ ] アカウント削除がアプリ内から開始できることをレビュー用アカウントまたは手順で示す

Appleはアカウントを作成できるアプリに、アプリ内からアカウント削除を開始できる機能を求めています。匿名・自動生成アカウントも対象です。Compriの現行実装はアプリ内削除を備えています。

公式情報:

- [Apple: Account deletion guideline 5.1.1(v)](https://developer.apple.com/jp/help/app-review/guideline-reference/5-1-1-account-deletion/)
- [Apple: App privacy reference](https://developer.apple.com/help/app-store-connect/reference/app-privacy/)
- [Apple: Manage app privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy)

## 7. EULAの選択

- [ ] Apple標準EULAを利用するか、Custom EULAを登録するか決める
- [ ] Custom EULAを使う場合、Appleの最低条件、運営者氏名、住所、連絡先を追加する
- [ ] Custom EULAは専門家確認後にApp Store Connectへ登録する

独自の利用規約をサイトやアプリ内に掲示することと、App Store ConnectへCustom EULAとして登録することは分けて判断します。Custom EULAを登録しない場合、App Store上のライセンスにはApple標準EULAが適用されます。

- [Apple Developer Program License Agreement: minimum EULA terms](https://developer.apple.com/support/downloads/terms/exhibits/Exhibits-to-Schedule-2-and-3-20250331-English.pdf)

## 8. 最終QA

- [ ] `npm ci && npm run build`
- [ ] 320px、390px、768px、デスクトップで表示確認
- [ ] ライト・ダークモード確認
- [ ] キーボード操作、フォーカス表示、VoiceOver確認
- [ ] Safari、Chromeで確認
- [ ] 全リンク、メールリンク、404を確認
- [ ] 印刷またはPDF保存時に法務文書が読みやすいことを確認
- [ ] App Store Connect、Privacy Manifest、公開ポリシーの内容を最終照合
- [ ] 公開後にURLをアプリへ設定してCompriを再ビルドする

## 専門家確認を推奨する箇所

- 日本の個人情報保護法上の公表事項と国外移転
- 海外向け提供時の適用法令、対象年齢、保護者同意
- 消費者契約法上の免責・責任制限
- 準拠法、管轄、紛争解決
- 収益化時の特定商取引法、課金、解約、返金
- Custom EULAを採用する場合のApple最低条件
