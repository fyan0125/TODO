# TODO 網站專案

## 專案目標

- 開發一個具備 CRUD（建立、讀取、更新、刪除）功能的 TODO 網站。
- 提供現代化、易用的 UI/UX。
- 串接 Firestore API 專注於前端開發。

## 使用技術

- Angular 20
- Angular Material
- lodash-es
- TypeScript

## Coding 規範

- 優先採用 Angular 新語法（如 @if、@for 等）。
- 變數、函式名稱採用 camelCase。
- 盡量使用 Angular Material 元件實現 UI。
- 共用邏輯抽離為 Service 或 Utility，避免重複程式碼。

## 使用方式

1. 建立 Firebase 專案
2. 於[Config 檔](./src/app/app.config.ts)中替換 firebaseConfig
3. 開啟 Firestore 服務，並將資料庫名從 `(default)` 改為 `todos`
4. 開啟 Authencation 服務，於登入方式選擇 `電子郵件/密碼` 及 `Google`

## 專案資料夾結構

```
- 📂 my-angular-app
  - 📂 e2e
  - 📂 node_modules (引用套件)
  - 📂 src
      - 📂 app
          - 📂 core（共用工具模組)
               - 📂 enums (列舉宣告)
               - 📂 guards (路由守衛)
               - 📂 utils （輔助工具）
                   - 📄 common.utils.ts
               - 📂 models (通用資料模型)
                   - 📄 a.model.ts
                   - 📄 b.model.ts
               - 📂 services (通用服務: 如Storage)
               - 📂 validators (驗證器)
               - 📂 constants (常數宣告)
               - 📂 interceptors
          - 📂 features（各功能模組）
               - 📂 feature-a
                    - 📄 feature-a.component.html
                    - 📄 feature-a.component.scss
                    - 📄 feature-a.component.ts
                    - 📄 feature-a.component.spec.ts
                    - 📂 models(該功能會使用到的資料模型）
          - 📂 shared (共用元件)
               - 📂 components
               - 📂 pipes
               - 📂 directives
               - 📂 layout (畫面框架元件)
          - 📄 app.component.html
          - 📄 app.component.scss
          - 📄 app.component.ts
     - 📂 assets(靜態資源)
         - 📂 data (API假資料)
         - 📂 scripts (外部js)
         - 📂 images (圖片)
         - 📂 icons
     - 📂 styles(樣式檔案）
          - 📄 _custom.scss （外部套件樣式）
          - 📄 styles.scss
     - 📂 environments(環境變數)
          - 📄 environment.ts
          - 📄 environment.prod.ts
     - 📄 index.html
     - 📄 main.ts
     - 📄 polyfills.ts
  - 📄 .gitignore
  - 📄 angular.json
  - 📄 package.json
  - 📄 tsconfig.json
  - 📄 README.md

```
