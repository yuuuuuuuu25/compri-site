# App Store Connect プライバシー申告 照合表

最終更新: 2026-10-22

この文書は、Compriの現行実装、`PrivacyInfo.xcprivacy`、公開用プライバシーポリシー、App Store Connectの回答を一致させるための内部チェック資料です。法律相談ではなく、App Store Connectへそのまま転記する最終回答でもありません。

## 現時点の推奨整理

| App Storeのデータ種類 | 収集 | 利用者にリンク | 目的 | トラッキング | 根拠・確認事項 |
|---|---:|---:|---|---:|---|
| User ID | はい | はい | App Functionality | いいえ | Supabase AuthのUUID、匿名認証、Apple連携識別子。買い物記録と世帯membershipのアクセス制御に使用。 |
| Name | はい | はい | App Functionality | いいえ | Apple氏名ではなく、利用者が共有機能用に任意設定する表示名。最大2人の共有相手に表示される。 |
| Email Address | 要確認 | 要確認 | App Functionality | いいえ | 現行iOS実装はAppleの`.email` scopeを要求していない。一方、App側Privacy ManifestはEmail Addressを申告済み。本番のApple認証後にSupabase Authのuser/identityへメールclaimが保存されるか確認して最終判断する。 |
| Other User Content | はい | はい | App Functionality | いいえ | 品目名、絵文字、店舗名、価格、数量、単位、記録日。householdとmembershipを通じて利用者に関連付く。 |
| Photos or Videos | いいえ | — | — | いいえ | OCR対象画像はApple Visionで端末内処理し、画像自体のアップロード実装はない。確定して保存した文字・価格はOther User Contentとして扱う。 |
| Purchases | いいえ | — | — | いいえ | 現在は課金実装なし。マネタイズ追加時に再評価する。 |
| Location | いいえ | — | — | いいえ | 位置情報APIの利用なし。店舗名は利用者入力のOther User Content。 |
| Contacts | いいえ | — | — | いいえ | 連絡先アクセスなし。 |
| Identifiers / Device ID | いいえ | — | — | いいえ | 広告IDや端末IDの取得実装なし。User IDは上記で別途申告する。 |
| Usage Data | いいえ | — | — | いいえ | Analytics SDKや行動分析の実装なし。 |
| Diagnostics | いいえ | — | — | いいえ | クラッシュ解析・診断SDKの実装なし。AppleがOS/App Store運営者として独自に扱う情報はCompriによる収集とは分けて考える。 |

## 実装との対応

- `Compri/Compri/PrivacyInfo.xcprivacy`
  - User ID / Email Address / Name / Other User Content
  - linked = true
  - purpose = App Functionality
  - tracking = false
- `Compri/CompriWidgets/PrivacyInfo.xcprivacy`
  - collected dataなし
  - UserDefaults required reason `CA92.1`
- `Compri/Compri/Features/Auth/AppleAuthorizationButton.swift`
  - `request.requestedScopes = []`
  - 氏名・メールscopeを要求していない
- `supabase/migrations/20261014120659_sharing_display_names.sql`
  - Appleアカウントの氏名・メールを転記せず、共有用表示名を別途保存
- OCR
  - Apple Visionによる端末内処理
  - 元画像をSupabase Storage等へ送る実装なし
- Widget
  - App Group UserDefaultsに表示用の限定スナップショットのみ保存
  - 認証情報や編集用データは保存しない

## App Store Connectへ設定するURL

独自ドメイン確定後、次を設定する想定です。

| フィールド | URL案 |
|---|---|
| Privacy Policy URL | `https://<domain>/privacy/` |
| User Privacy Choices URL | `https://<domain>/account-deletion/` |
| Support URL | `https://<domain>/support/` |
| Marketing URL | `https://<domain>/`（必要な場合） |

英語ローカライズでは、それぞれ `/en/` 配下のURLを使用します。

## 公開前に必ず行う実機確認

1. 新規AppleアカウントまたはApple側の連携解除後に、Sign in with Appleを実行する。
2. アプリが氏名・メール共有の同意UIを表示しないことを確認する。
3. Supabase DashboardのAuth user/identityで、`email`、`user_metadata`、`identity_data`に何が保存されたか確認する。
4. メールが保存されないなら、App側Privacy ManifestのEmail Address削除とApp Store Connectの非申告を検討する。
5. メールが保存されるなら、公開ポリシーへ保存内容・目的・削除方法を追記し、申告を維持する。
6. 匿名、Apple新規、匿名からApple連携の3経路で結果を比較する。

## 公式一次情報

- [Apple: App privacy reference](https://developer.apple.com/help/app-store-connect/reference/app-privacy/)
- [Apple: Manage app privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy)
- [Apple: Describing data use in privacy manifests](https://developer.apple.com/documentation/BundleResources/describing-data-use-in-privacy-manifests)
- [Apple: Sign in with Apple scopes](https://developer.apple.com/documentation/AuthenticationServices/ASAuthorization/Scope)
- [Apple: Account deletion guideline 5.1.1(v)](https://developer.apple.com/jp/help/app-review/guideline-reference/5-1-1-account-deletion/)

Appleは、Privacy Policy URLを全アプリに必須とし、App Store Connectの回答にはアプリ自身だけでなく組み込んだ第三者パートナーの取扱いも含め、変更時に最新化するよう求めています。
