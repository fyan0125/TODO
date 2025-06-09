# TODO 網站專案

## 專案目標
- 開發一個具備 CRUD（建立、讀取、更新、刪除）功能的 TODO 網站。
- 提供現代化、易用的 UI/UX。

## 使用技術
- Angular 20
- Angular Material
- Lodash
- TypeScript

## Coding 規範
- 優先採用 Angular 20 新語法（如 @if、@for 等）。
- 所有 API 呼叫統一由 API Service 管理，並提供可自訂 params 與路徑的彈性方法。
- 組件、服務、模組命名需語意明確，遵循 Angular 官方命名慣例。
- 變數、函式名稱採用 camelCase。
- 重要決策與技術選型需於 README 記錄。
- 盡量使用 Angular Material 元件實現 UI。
- 共用邏輯抽離為 Service 或 Utility，避免重複程式碼。

## API Service 設計原則
- 所有 API 請求統一由 API Service 處理。
- API Service 提供可傳入 params（查詢參數、body 等）與路徑的彈性方法。
- 方便未來擴充與維護。

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
          - 📄 app.module.ts (若之後完全使用Standalone就不會有此檔案）
          - 📄 app.routing-module.ts (若之後完全使用Standalone就不會有此檔案）
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