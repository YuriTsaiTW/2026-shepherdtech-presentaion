# dogcatstar.com 效能分析報告

> 資料來源：PageSpeed Insights（行動裝置）
> 報告時間：2026-03-10
> URL：https://www.dogcatstar.com/
> 分析工具：Lighthouse 13.0.1 / Moto G Power / 4G 網速

---

## 一、評估（Current State）

### 整體分數

| 類別 | 分數 | 評等 |
|------|------|------|
| **效能 Performance** | **30** | 🔴 Poor |
| 無障礙功能 Accessibility | 67 | 🟠 Needs Improvement |
| 最佳做法 Best Practices | 96 | 🟢 Good |
| 搜尋引擎最佳化 SEO | 92 | 🟢 Good |

### Core Web Vitals（Field Data，實際使用者資料）

> 資料期間：過去 28 天，多種行動設備、多種網路連線

| 指標 | 數值 | 評等 | 標準門檻 |
|------|------|------|----------|
| **LCP** Largest Contentful Paint | 2.8 秒 | 🟡 Needs Improvement | < 2.5s Good |
| **INP** Interaction to Next Paint | 302 毫秒 | 🟡 Needs Improvement | < 200ms Good |
| **CLS** Cumulative Layout Shift | 0.02 | 🟢 Good | < 0.1 Good |
| **FCP** First Contentful Paint | 2.4 秒 | 🟡 Needs Improvement | < 1.8s Good |
| **TTFB** Time to First Byte | 1.8 秒 | 🔴 Poor | < 0.8s Good |

> ⚠️ **CWV 評估結果：失敗**（LCP、INP 未達標）

### Lab Data（Lighthouse 模擬測量）

| 指標 | 數值 | 評等 |
|------|------|------|
| FCP | 3.5 秒 | 🔴 Poor |
| **LCP** | **7.2 秒** | 🔴 Poor |
| **TBT** Total Blocking Time | **3,080 毫秒** | 🔴 Poor |
| CLS | 0.041 | 🟢 Good |
| **Speed Index** | **23.4 秒** | 🔴 Poor |

> Lab data 與 Field data 有落差，LCP field 2.8s vs lab 7.2s，推測 CDN cache hit 對真實用戶有部分幫助，但 lab 場景（冷啟動 4G）顯示底層問題仍嚴重。

---

## 二、診斷（Root Cause Analysis）

### Opportunities（可量化的改善機會）

| # | 問題 | 預估節省 | 影響指標 |
|---|------|----------|----------|
| 1 | **使用有效的快取生命週期** | 5,324 KiB | 重複訪問速度 |
| 2 | **轉譯封鎖要求**（Render-blocking resources） | 2,090 毫秒 | FCP、LCP |
| 3 | **提升圖片傳送效能**（未壓縮 / 非 WebP） | 2,900 KiB | LCP |
| 4 | **舊版 JavaScript**（Legacy JS polyfills） | 57 KiB | TBT、INP |
| 5 | 字型顯示（font-display 未設定） | 40 毫秒 | FCP |
| 6 | 強制自動重排（Forced reflow） | — | INP |
| 7 | LCP 細目 / LCP 要求探索 | — | LCP |
| 8 | 網路依附元件樹狀結構（Request chains） | — | FCP、LCP |
| 9 | 版面配置位移主因 | — | CLS |
| 10 | 最佳化 DOM 大小 | — | INP、TBT |
| 11 | 第三方資源 | — | TBT、FCP |

### Diagnostics（深層診斷）

| # | 診斷項目 | 數值 | 影響指標 |
|---|----------|------|----------|
| 1 | **減少 JavaScript 執行時間** | 9.8 秒 | TBT、INP |
| 2 | **將主執行緒工作降到最低** | 16.6 秒（20 項長任務） | TBT、INP |
| 3 | 減少無用的 JavaScript | 1,024 KiB | TBT |
| 4 | 減少無用的 CSS | 144 KiB | FCP |
| 5 | 壓縮 JavaScript | 14 KiB | — |
| 6 | **避免耗用大量網路資源** | 總大小 7,823 KiB | 整體速度 |
| 7 | 避免長時間主執行緒任務 | 20 項 | INP |

### 問題根因彙整

基於以上數據，核心瓶頸可分為三類：

#### 🔴 Critical（直接導致 CWV 失敗）
1. **TTFB 1.8s（Server 回應慢）**
   WordPress + PHP 共用主機，無伺服器端快取（Redis/Varnish），每次請求都觸發 DB 查詢。這是 LCP 慢的根本原因。

2. **Render-blocking 資源 2,090ms**
   多個 CSS/JS（外掛、主題）在 `<head>` 中同步載入，阻塞首次渲染。

3. **JS 執行時間 9.8s + 主執行緒 16.6s**
   jQuery + 多個 WooCommerce 外掛 JS、GA4、FB Pixel、LINE Tag、客服 widget，全部在初始載入時執行，產生大量 Long Tasks，直接造成 INP 302ms。

#### 🟡 High Impact（量大、好處理）
4. **圖片未優化（2,900 KiB 可節省）**
   商品圖與 banner 使用原始尺寸 JPEG，未轉換 WebP，無 `loading="lazy"`，無 `fetchpriority="high"` 在 LCP 元素。

5. **無效快取（5,324 KiB 可節省）**
   靜態資源（外掛 CSS/JS）快取有效期過短，重複訪問仍需重新下載。

6. **無用 JS 1,024 KiB + 無用 CSS 144 KiB**
   多外掛樣式全局載入，Coverage 極低（推測 < 30%）。

#### 🟠 Secondary
7. **DOM 節點過大**（WooCommerce shop 頁，推估 > 2,000 節點）→ 影響 INP
8. **舊版 JS polyfills 57 KiB**
9. **字型 font-display 未設定** → FCP 延遲 40ms

---

## 三、改善方案（Improvement Plan）

### 短期（WordPress 框架內可執行，2-4 週）

| 優先級 | 項目 | 預期效益 | 作法 |
|--------|------|----------|------|
| P0 | **啟用頁面快取** | TTFB 從 1.8s → < 0.5s | WP Rocket / W3 Total Cache，開啟全頁 HTML 快取 |
| P0 | **LCP 圖片 fetchpriority** | LCP 顯著改善 | 首屏 hero image 加 `fetchpriority="high"` + 移除 `loading="lazy"` |
| P1 | **圖片 WebP 轉換** | 節省 2,900 KiB | Imagify / Smush 自動壓縮，或 Cloudflare Polish |
| P1 | **defer / async 第三方腳本** | TBT -500ms+ | GA4、FB Pixel 改 `async`；客服 widget 改 lazy load |
| P1 | **font-display: swap** | FCP -40ms | 在主題 functions.php 加入字型載入優化 |
| P2 | **靜態資源長效快取** | 節省 5,324 KiB | `.htaccess` 設定 Cache-Control max-age=31536000 |
| P2 | **停用非必要外掛** | JS/CSS 減少 | 清查外掛，只保留必要，使用 Asset CleanUp 按頁載入 |
| P2 | **預留 banner 最小高度** | CLS 改善 | CSS `min-height` 避免促銷 banner 造成版面位移 |

### 長期（Next.js 現代架構重構，3-6 個月）

| 層次 | 方案 | 解決的問題 |
|------|------|-----------|
| **Frontend** | Next.js App Router + Server Components | 零 client-side JS bundle for static content，LCP < 2s |
| **Images** | `next/image` 自動 WebP + lazy load + blur placeholder | LCP、CLS |
| **Scripts** | `next/script strategy="lazyOnload"` | TBT、INP |
| **Styles** | StyleX zero-runtime atomic CSS | 無用 CSS 問題根治 |
| **Data** | ISR (Incremental Static Regeneration) | TTFB → Edge cache hit < 100ms |
| **CDN** | Cloudflare / Vercel Edge Network | 全球 TTFB 均一化 |
| **CMS** | Headless WooCommerce REST API + Sanity/Contentful | 去除 PHP 渲染瓶頸 |
| **Lists** | React 虛擬化（TanStack Virtual） | DOM 大小、INP |

---

## 四、願景（Target Architecture）

### 目標指標

| 指標 | 現況 | 短期目標 | 長期目標 |
|------|------|----------|----------|
| Performance Score | 30 | ≥ 60 | ≥ 90 |
| LCP | 2.8s (field) / 7.2s (lab) | < 2.5s | < 1.5s |
| INP | 302ms | < 200ms | < 100ms |
| CLS | 0.02 | < 0.1 ✅ | < 0.05 |
| TTFB | 1.8s | < 0.8s | < 0.2s (Edge) |
| TBT | 3,080ms | < 500ms | < 100ms |
| 總資源大小 | 7,823 KiB | < 4,000 KiB | < 1,500 KiB |

### 理想架構圖（文字描述）

```
用戶請求
  ↓
Cloudflare Edge / Vercel Edge（全球 CDN）
  ↓ cache hit → HTML 直接回應（TTFB < 100ms）
  ↓ cache miss
Next.js App Router（Server Component）
  ↓
WooCommerce REST API / Headless CMS
  ↓
Static Generation (ISR) → 靜態 HTML + partial hydration
  ↓
客戶端：最小化 JS bundle（只有互動元件）
         next/image 自動優化
         next/script lazyOnload（GA4, Pixel）
```

### 遷移策略（漸進式）

1. **Phase 1（現況優化）**：WordPress 上啟用快取 + 圖片優化 → CWV 達標
2. **Phase 2（前端解耦）**：Next.js 接管前台頁面，WordPress 僅作 headless API
3. **Phase 3（全面現代化）**：StyleX + Server Components + Edge ISR

---

## 附錄：原始數據快照

截圖存放於 `docs/` 目錄：
- `pagespeed-1-top.png` — 實際用戶 CWV 數據
- `pagespeed-2.png` — 整體分數（Performance 30）
- `pagespeed-3.png` — Lab metrics
- `pagespeed-3b.png` — Opportunities 清單
- `pagespeed-4.png` — Diagnostics 清單
- `pagespeed-4b.png` — Diagnostics 詳細數值
- `pagespeed-5.png` — 網路資源總大小
