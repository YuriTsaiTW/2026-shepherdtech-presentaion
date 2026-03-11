# TOPIC 3 — alphacast-frontend 架構設計

> 本文對應簡報 Topic 03，針對面試題目「了解你在寫程式的代碼風格和品質」與「技術選型的目的和原因」提供完整回覆。

---

## 背景說明

alphacast-frontend 是我在 ALPHACamp 擔任前端助教期間，從零到一設計的**學生畢業專案**。

**設計目標**：讓學生在一個接近業界的環境中，完整走過：
- 閱讀規格文件與設計稿
- 實作可通過測試案例的 UI 元件（Jest + Testing Library）
- 串接 Spotify Web API 與自訂後端 API
- 使用 Git Workflow（Conventional Commits、PR review）

專案公開於 GitHub（YuriTsaiTW/capstone-alphacast-starter），學生 fork 後在此基礎上進行開發。

---

## 一、代碼風格與品質

### 1.1 TypeScript — 嚴格模式

`tsconfig.json` 啟用 `"strict": true`，並加上額外限制：

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

**設計思路**：

- **不容許 `any`**：所有 API 回傳值都有對應的型別定義（`src/types/spotify.d.ts`、`src/types/server.d.ts`、`src/types/app.d.ts`）
- **命名空間型別**：Spotify 相關型別放在 `Spotify` 命名空間下（`Spotify.Profile`、`Spotify.Show`），避免名稱衝突
- `noUnusedLocals` / `noUnusedParameters`：保持程式碼乾淨，防止學生遺留未用的變數

### 1.2 ESLint + Prettier — 零警告政策

```bash
# package.json scripts
"lint": "eslint . --ext ts,tsx --max-warnings 0"
```

ESLint extends：
- `eslint:recommended`
- `plugin:@typescript-eslint/recommended`
- `plugin:react-hooks/recommended`（防止 hooks 使用錯誤）
- `plugin:storybook/recommended`

Prettier 設定（`.prettierrc`）：
- `singleQuote: true`、`trailingComma: "es5"`
- Import 自動排序（`@trivago/prettier-plugin-sort-imports`）：外部套件 → 應用模組 → 相對路徑
- `printWidth: 80` — 強制換行，提升可讀性

**零警告策略**的意義：CI 只要有警告就失敗，不讓技術債積累。

### 1.3 命名慣例

| 類別 | 慣例 | 範例 |
|------|------|------|
| 檔案 / 目錄 | kebab-case | `show-card/`, `auth-pkce.ts` |
| 元件 | PascalCase | `ShowCard`, `FavoriteButton` |
| Hook | `useXxx` camelCase | `useUserContext`, `useCategoryContext` |
| Context | PascalCase | `UserContext`, `CategoryContext` |
| 型別 / 介面 | PascalCase | `ShowCardProps`, `EpisodeItem` |
| 變數 / 函數 | camelCase | `currentCategoryId`, `syncCategories` |
| 常數 | camelCase | `modalTypes`, `flexColCenter` |

**目錄即元件原則**：每個元件一個目錄，包含 `index.tsx` + `styles.module.scss`：

```
src/components/show-card/
├── index.tsx
└── styles.module.scss
```

### 1.4 元件架構原則

每個元件遵循固定結構：

```typescript
// 1. 型別定義
export interface ShowCardProps {
  show: Spotify.Show;
  categoryId: string;
}

// 2. 元件本體
export function ShowCard({ show, categoryId }: ShowCardProps) {
  // logic
}

// 3. 預設匯出
export default ShowCard;
```

**Context + Custom Hook 模式**（取代 Redux 樣板）：

```typescript
// contexts/user/index.ts
export const useUserContext = () => useContext(UserContext);

// 使用端
const { user, spotifyProfile } = useUserContext();
```

每個 Context 對應一個 Provider 元件，統一在 `src/contexts/index.ts` 匯出，App.tsx 只需一次性套用。

### 1.5 Git Workflow 自動化

**三層防線**：

```
git commit
  ├─ husky (pre-commit hook)
  │   └─ lint-staged
  │       ├─ *.{ts,tsx} → eslint + prettier + jest
  │       └─ *.{css,scss,json,md} → prettier
  └─ commitlint (commit-msg hook)
      └─ Conventional Commits 格式驗證
```

Commit 訊息規範（`commitlint.config.cjs`）：

```
feat: 新增搜尋節目功能
fix: 修正 OAuth callback 重複呼叫問題
test: 補充 getGreeting helper 測試
chore: 升級 @tanstack/react-query 至 v4
```

**設計意圖**：讓學生從一開始就養成業界標準的 commit 習慣，而非事後補救。

### 1.6 測試策略 — 三個層面

```
src/
├─ apis/__tests__/
│   ├─ spotify.test.ts     # Axios 函數單元測試（mock axios）
│   └─ server.test.ts      # Server API 函數測試
└─ helpers/__tests__/
    ├─ transformDuration.test.ts  # 純函數測試
    ├─ categoryName.test.ts       # split/merge 工具函數
    └─ getGreeting.test.ts        # 時間判斷邏輯
```

**MSW（Mock Service Worker）**：
在 `src/mocks/handlers.ts` 定義所有後端 REST endpoint 的攔截規則，用 `npm run dev:mock-api` 啟動。同一組 handlers 可在開發環境和測試環境共用，讓前後端真正並行開發。

**Storybook**：
元件在隔離環境下開發與文件化，設計師可直接在 Storybook 驗收，不需啟動完整應用。

---

## 二、技術選型的目的和原因

### 2.1 核心框架：React 18 + TypeScript 5 + Vite 4

| 選型 | 原因 |
|------|------|
| React 18 | 業界主流，學生學完可直接銜接職場；Concurrent Features 為未來做好準備 |
| TypeScript 5 | 強型別讓學生在編譯期就能發現 API 串接錯誤，而非 runtime 才炸 |
| Vite 4 | HMR 極快，學習體驗好；native ESM，不需複雜 webpack 配置 |

### 2.2 伺服器狀態：TanStack Query v4（React Query）

**核心理由**：

> 「伺服器狀態」和「UI 狀態」是完全不同的問題。

伺服器狀態需要：快取、背景重新驗證、競態條件處理、loading/error 狀態。這些 Redux 做起來需要大量樣板，TanStack Query 開箱即用：

```typescript
// useQuery 自動處理快取 + loading + error
const { data: shows, isLoading } = useQuery(
  ['getShows', categoryId],
  () => getShows({ ids: showIds, country: 'TW' })
);

// useMutation 自動處理寫入 + 樂觀更新
const { mutate: addFavorite } = useMutation(addFavoriteApi, {
  onSuccess: () => queryClient.invalidateQueries(['favorites']),
});
```

**教學價值**：學生可以直接體會「不用自己管 loading state 是什麼感覺」，之後回頭理解 Redux 的設計動機會更清晰。

### 2.3 UI 狀態：React Context API（非 Redux）

五個 Context 管理 UI 狀態：

| Context | 職責 |
|---------|------|
| `UserContext` | 使用者身份、Spotify Token |
| `CategoryContext` | 分類選單、當前選中分類 |
| `FavoriteContext` | 收藏的 episode ID 清單 |
| `PlayerContext` | 播放器狀態、嵌入式控制器 |
| `ModalContext` | Modal 開關與 props 傳遞 |

**不用 Redux 的原因**：這個專案規模不需要跨多層元件的複雜狀態流，Context 足夠且學習曲線低；搭配 TanStack Query 處理伺服器狀態後，剩下的 UI 狀態用 Context 管理已非常清晰。

### 2.4 HTTP 客戶端：Axios（雙實例設計）

```typescript
// Server API（自訂後端）
const serverAxios = axios.create({ baseURL: VITE_SERVER_BASE_URL });

// Spotify API
const spotifyAxios = axios.create({ baseURL: VITE_SPOTIFY_BASE_URL });

// 分別注入不同的 Bearer token
injectAuthHeader(serverAxios, serverToken);
injectAuthHeader(spotifyAxios, spotifyToken);
```

**設計理由**：兩個 API 使用不同的 token 和 base URL，分開的 axios 實例讓 auth header 的管理互不干擾，也讓學生理解「攔截器」（interceptor）的實際應用場景。

### 2.5 OAuth 安全：Spotify PKCE 流程

選擇 PKCE（Proof Key for Code Exchange）而非傳統 Authorization Code：
- SPA 無法安全保存 client secret（前端程式碼可被任何人讀取）
- PKCE 透過動態產生的 `code_verifier` 和 `code_challenge` 替代 secret
- 這是 Spotify 對 SPA 的官方推薦認證方式

實作在 `src/apis/spotify/auth-pkce.ts`，讓學生接觸業界實際的安全認證流程。

### 2.6 Mock API：MSW 1.2（Mock Service Worker）

**傳統 mock 問題**：直接在程式碼裡 `if (isDev) return mockData` 會讓 production 和 development 行為不一致。

**MSW 的優勢**：在 Service Worker 層攔截真實的 HTTP request，應用程式本身完全不知道自己在使用 mock：

```typescript
// src/mocks/handlers.ts
http.get('/api/categories', () => {
  return HttpResponse.json(mockCategories);
});
```

同一組 handlers 在開發環境（瀏覽器）和測試環境（jest）都能使用，大幅減少重複的 mock 程式碼。

**教學設計**：學生可以先讓所有功能在 mock 環境跑通，確認 UI 正確，再換成真實 API，大幅降低「後端還沒好」造成的阻塞。

### 2.7 元件文件：Storybook 7

每個元件在 `src/stories/` 下有對應的 story：
- 視覺隔離開發，不需要啟動整個應用
- 可以測試各種 props 組合（正常、loading、error、empty）
- 設計師直接在 Storybook 驗收，減少設計和實作的落差

### 2.8 樣式：Bootstrap 5 + SCSS Modules

**Bootstrap 5**：提供響應式網格和基礎元件，讓學生專注在業務邏輯而非 CSS 基礎。

**SCSS Modules**（`styles.module.scss`）：
元件樣式有 scope 隔離，不會互相污染。TypeScript 可以 import 並使用（`import styles from './styles.module.scss'`），享有型別提示。

**`src/bootstrap/classnames.ts`**：
統一定義重複使用的 Bootstrap class 組合（如 `flexColCenter`），避免在 JSX 裡寫落落長的 className 字串。

### 2.9 工具鏈總覽

```
代碼品質    │ ESLint（零警告）+ Prettier（自動格式化）+ TypeScript strict
測試        │ Jest 29 + ts-jest + MSW（API mock）
元件開發    │ Storybook 7
Git 管理    │ Husky + lint-staged + commitlint（Conventional Commits）
建置        │ Vite 4（開發）+ tsc（型別檢查）
部署        │ Vite build → 靜態檔案
開發伺服器  │ port 4200，/api → 代理到後端
```

---

## 三、設計給學生的刻意安排

| 設計 | 目的 |
|------|------|
| MSW handlers 已預先定義 | 學生專注在實作元件，不被 API 串接問題卡住 |
| TypeScript 型別已定義 | 強迫學生看清楚 API 回傳的資料結構 |
| ESLint 零警告 | 不讓壞習慣累積，第一天就是最高標準 |
| Conventional Commits | 從第一個 commit 開始練習業界規範 |
| Storybook stories 已有骨架 | 降低門檻，學生照範例擴充即可 |
| Context 已架好骨架 | 學生理解怎麼「用」Context，進階再學「怎麼設計」 |

---

## 四、一句話總結

> **選型原則：讓工具處理複雜度，讓學生專注在真正重要的事情上。**
> — Vite 讓建置不是問題，MSW 讓後端不是瓶頸，TypeScript 讓型別錯誤在編譯期就浮現，TanStack Query 讓 loading/error 狀態不需手動管理。每一個選型都有明確的「解決什麼問題」的答案。
