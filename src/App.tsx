import {
  Deck,
  Slide,
  Heading,
  Text,
  Appear,
  CodePane,
  Box,
  FlexBox,
  Grid,
  FullScreen,
  Progress,
  Notes,
} from 'spectacle';

// ─── Theme ───────────────────────────────────────────────────────────────────

const theme = {
  colors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    tertiary: '#0f3460',
    quaternary: '#e94560',
    quinary: '#f5f5f5',
  },
  fonts: {
    header: '"Inter", sans-serif',
    text: '"Inter", sans-serif',
    monospace: '"Fira Code", monospace',
  },
};

// ─── Bottom template ──────────────────────────────────────────────────────────

const template = () => (
  <FlexBox justifyContent="space-between" position="absolute" bottom={0} width={1} padding="0 16px 8px">
    <Box><FullScreen color="#e94560" /></Box>
    <Box><Progress color="#e94560" /></Box>
  </FlexBox>
);

// ─── Shared helpers ───────────────────────────────────────────────────────────

const accentBar = (
  <Box height="3px" width="40px" backgroundColor="quaternary" margin="3px 0 10px" borderRadius="2px" />
);

const sectionBadge = (label: string) => (
  <Box
    backgroundColor="quaternary"
    padding="2px 12px"
    borderRadius="20px"
    marginBottom="6px"
    style={{ display: 'inline-block', width: 'fit-content' }}
  >
    <Text fontSize="13px" color="quinary" margin={0} fontWeight="bold">{label}</Text>
  </Box>
);

// chip: use flexShrink so it doesn't stretch in FlexBox
const chip = (label: string) => (
  <Box
    backgroundColor="tertiary"
    padding="3px 9px"
    borderRadius="4px"
    style={{ display: 'inline-block', flexShrink: 0 }}
  >
    <Text fontSize="13px" color="quinary" margin={0}>{label}</Text>
  </Box>
);

// Custom bullet — avoids Spectacle's ListItem large default spacing
const bullet = (text: React.ReactNode, dim = false) => (
  <FlexBox alignItems="flex-start" marginBottom="3px">
    <Text color="quaternary" fontSize="12px" margin="1px 5px 0 0" style={{ flexShrink: 0 }}>•</Text>
    <Text color="quinary" fontSize="14px" margin={0} opacity={dim ? 0.8 : 1} lineHeight={1.3 as any}>{text}</Text>
  </FlexBox>
);

const aiTag = (
  <Box position="absolute" bottom="40px" right="20px" backgroundColor="secondary"
    padding="2px 8px" borderRadius="4px" opacity={0.7}>
    <Text fontSize="12px" color="quaternary" margin={0}>🤖 AI assisted</Text>
  </Box>
);

// ─── Code samples ─────────────────────────────────────────────────────────────

const useAuthCode = `// libs/auth/src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return {
    user: ctx.user,
    isAuthenticated: !!ctx.user,
    login: ctx.login,   // triggers OIDC redirect
    logout: ctx.logout,
  };
}

// Usage in any app inside the monorepo
// import { useAuth } from '@acme/auth';
// const { user, login, logout } = useAuth();`;

const reactQueryCode = `// hooks/useEpisodes.ts
import { useQuery } from '@tanstack/react-query';
import { fetchEpisodes } from '../api/episodes';
import type { Episode } from '../types';

export function useEpisodes(podcastId: string) {
  return useQuery<Episode[]>({
    queryKey: ['episodes', podcastId],
    queryFn: () => fetchEpisodes(podcastId),
    staleTime: 1000 * 60 * 5,  // 5 min cache
  });
}

// MSW handler (src/mocks/handlers.ts)
http.get('/api/podcasts/:id/episodes', ({ params }) => {
  return HttpResponse.json(mockEpisodes(params.id));
});`;

// ─── Slide wrapper with consistent padding ────────────────────────────────────
// Spectacle Slide fills viewport; we use absolute positioning so height is reliable
const slideBox = (children: React.ReactNode) => (
  <Box
    position="absolute"
    top={0}
    left={0}
    right={0}
    bottom={0}
    padding="20px 52px 48px"
    style={{ overflowY: 'hidden', boxSizing: 'border-box' }}
  >
    {children}
  </Box>
);

// ─── Slides ───────────────────────────────────────────────────────────────────

function App() {
  return (
    <Deck theme={theme} template={template}>

      {/* ── 0. Cover ─────────────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" alignItems="center" justifyContent="center">
          <Box style={{ display: 'inline-block' }} marginBottom="6px">
            {sectionBadge('Frontend Engineer')}
          </Box>
          <Heading color="quinary" fontSize="56px" textAlign="center" margin="0 0 8px">
            前端工程師技術簡報
          </Heading>
          <Box height="3px" width="60px" backgroundColor="quaternary" borderRadius="2px" margin="0 0 18px" />
          <Text color="quinary" fontSize="24px" textAlign="center" margin="0 0 6px">
            Shepherd Tech 牧羊人集團
          </Text>
          <Text color="quinary" fontSize="16px" opacity={0.6} margin="0 0 36px">2026</Text>
          <Text color="quinary" fontSize="18px" fontWeight="bold">蔡秀慧 · Yuri Tsai</Text>
        </FlexBox>
        <Notes>封面頁</Notes>
      </Slide>

      {/* ── 1. Self Introduction ─────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="34px" margin="0 0 2px">自我介紹</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr" gridGap="24px">
              {/* Left */}
              <Box>
                <Text color="quinary" fontSize="18px" fontWeight="bold" margin="0 0 2px">蔡秀慧 · Yuri Tsai</Text>
                <Text color="quinary" fontSize="13px" opacity={0.7} margin="0 0 12px">Senior Frontend Engineer（10+ 年）</Text>

                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 3px">現職</Text>
                <Text color="quinary" fontSize="13px" margin="0 0 12px">
                  ViewSonic 優派國際股份有限公司<br />資深前端工程師 | 2023 - Present
                </Text>

                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 3px">學歷</Text>
                <Text color="quinary" fontSize="13px" margin={0}>
                  國立中山大學 資訊管理系<br />大學部＆碩士班 | 2009 - 2015
                </Text>
              </Box>
              {/* Right */}
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">前端技術棧</Text>
                <FlexBox flexWrap="wrap" gap="5px" marginBottom="10px" alignItems="flex-start">
                  {['TypeScript', 'React', 'React Native', 'Next.js', 'TailwindCSS'].map(chip)}
                </FlexBox>

                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">工具 &amp; 基礎設施</Text>
                <FlexBox flexWrap="wrap" gap="5px" marginBottom="10px" alignItems="flex-start">
                  {['NX Monorepo', 'Storybook', 'MSW', 'AWS', 'Claude Code'].map(chip)}
                </FlexBox>

                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">其他專長</Text>
                <FlexBox flexWrap="wrap" gap="5px" alignItems="flex-start">
                  {['OIDC Auth', 'A11y', 'i18n', 'CI/CD', 'Agentic Programming'].map(chip)}
                </FlexBox>
              </Box>
            </Grid>
          </>
        )}
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 1
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 1-1. Context ─────────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目一')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">最困難的系統架構設計</Heading>
            {accentBar}
            <Text color="quinary" fontSize="15px" fontWeight="bold" margin="0 0 8px">背景 Context</Text>
            <Appear>
              <Box backgroundColor="secondary" borderRadius="8px" padding="10px 14px" marginBottom="8px" borderLeft="4px solid #e94560">
                <Text color="quinary" fontSize="14px" margin="0 0 5px">
                  <strong style={{ color: '#e94560' }}>ViewSonic 教育事業部</strong>：同時維護多個教育產品
                </Text>
                {bullet('Content Platform（內容管理）')}
                {bullet('Lesson Generator（AI 課程生成）')}
                {bullet('白板 Web App（協作白板）')}
              </Box>
            </Appear>
            <Appear>
              <Box backgroundColor="secondary" borderRadius="8px" padding="10px 14px" borderLeft="4px solid #f5c518">
                <Text color="quinary" fontSize="14px" fontWeight="bold" margin="0 0 5px">⚠️ 痛點</Text>
                {bullet(<>各產品<strong style={{ color: '#f5c518' }}>重複建置</strong> OIDC Auth → 版本不一致、難維護</>)}
                {bullet('基礎 UI 元件分散各 repo → 設計無法收斂')}
                {bullet('新產品接入成本高，估計 2-3 週起跳')}
              </Box>
            </Appear>
          </>
        )}
        <Notes>說明痛點</Notes>
      </Slide>

      {/* ── 1-2. Architecture Overview ───────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目一')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">架構全貌</Heading>
            {accentBar}
            <Box backgroundColor="secondary" borderRadius="10px" padding="14px 18px">
              <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 8px" textAlign="center">
                NX Monorepo Structure
              </Text>
              <Grid gridTemplateColumns="1fr 1fr" gridGap="10px" marginBottom="10px">
                <Box backgroundColor="tertiary" borderRadius="6px" padding="8px">
                  <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px" textAlign="center">apps/</Text>
                  {['content-platform', 'lesson-generator', 'whiteboard'].map((app) => (
                    <Box key={app} backgroundColor="primary" borderRadius="4px" padding="4px 8px" marginBottom="3px">
                      <Text color="quinary" fontSize="12px" margin={0} fontFamily="monospace">{app}</Text>
                    </Box>
                  ))}
                </Box>
                <Box backgroundColor="tertiary" borderRadius="6px" padding="8px">
                  <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px" textAlign="center">libs/ （分層）</Text>
                  {[
                    { name: 'auth-lib', color: '#e94560' },
                    { name: 'common-lib', color: '#f5c518' },
                    { name: 'foundation', color: '#4caf50' },
                    { name: 'component-lib', color: '#2196f3' },
                  ].map((lib) => (
                    <Box key={lib.name} backgroundColor="primary" borderRadius="4px" padding="4px 8px" marginBottom="3px" borderLeft={`3px solid ${lib.color}`}>
                      <Text color="quinary" fontSize="12px" margin={0} fontFamily="monospace">@acme/{lib.name}</Text>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <FlexBox justifyContent="center" gap="12px" flexWrap="wrap">
                {['🔗 REST API — Content Platform', '⚡ WebSocket — Lesson Generator', '☁️ Deploy on AWS'].map((label) => (
                  <Box key={label} backgroundColor="primary" borderRadius="4px" padding="4px 10px">
                    <Text color="quinary" fontSize="12px" margin={0}>{label}</Text>
                  </Box>
                ))}
              </FlexBox>
            </Box>
          </>
        )}
        {aiTag}
        <Notes>NX monorepo 架構圖</Notes>
      </Slide>

      {/* ── 1-3. Auth Library Technical Details ─────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目一')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">Auth Library 技術細節</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr" gridGap="20px">
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 6px">OIDC Implementation</Text>
                {bullet(<>Authorization Code Flow + <strong style={{ color: '#e94560' }}>PKCE</strong></>)}
                {bullet('Refresh Token 靜默更新')}
                {bullet('Session 持久化（BroadcastChannel 跨 Tab）')}
                <Box marginTop="12px">
                  <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 6px">Developer API</Text>
                  {bullet('useAuth() / useToken() hooks', false)}
                  {bullet('<AuthProvider>', false)}
                  {bullet('withAuth() HOC', false)}
                </Box>
              </Box>
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 6px">為什麼選 NX？</Text>
                {bullet(<><strong style={{ color: '#e94560' }}>affected commands</strong>：只跑受影響的 CI</>)}
                {bullet('Dependency Graph 視覺化')}
                {bullet('Code Generation（vs Turborepo 無 generator）')}
                {bullet('Lerna 已式微，NX 社群較活躍')}
                <Box marginTop="12px">
                  <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 6px">文件化</Text>
                  {bullet('Storybook 互動文件')}
                  {bullet('Figma MCP 對齊設計稿')}
                </Box>
              </Box>
            </Grid>
          </>
        )}
        <Notes>PKCE、NX 選型、文件化</Notes>
      </Slide>

      {/* ── 1-4. Trade-offs & Results ────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目一')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">挑戰與成果</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr" gridGap="16px">
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 6px">⚔️ 挑戰 Trade-offs</Text>
                {[
                  { title: 'CI 時間', desc: 'Monorepo 規模大後 CI 耗時增加，靠 NX Cloud 遠端緩存緩解', color: '#e94560' },
                  { title: '抽象粒度取捨', desc: '過早抽象反而增加耦合，需逐步從具體到抽象', color: '#f5c518' },
                  { title: '跨團隊推廣', desc: '需建立共識、提供文件，降低學習曲線', color: '#2196f3' },
                ].map((item) => (
                  <Appear key={item.title}>
                    <Box backgroundColor="secondary" borderRadius="6px" padding="8px 12px" marginBottom="6px" borderLeft={`3px solid ${item.color}`}>
                      <Text color="quinary" fontSize="13px" margin={0} fontWeight="bold">{item.title}</Text>
                      <Text color="quinary" fontSize="12px" margin="2px 0 0" opacity={0.8}>{item.desc}</Text>
                    </Box>
                  </Appear>
                ))}
              </Box>
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 6px">✅ 成果 Results</Text>
                {[
                  { icon: '🔌', title: '多產品接入', desc: '3 個產品接入同一 auth lib，行為一致' },
                  { icon: '⚡', title: '接入時間縮短', desc: '新產品接 auth：2-3 週 → 2-3 天' },
                  { icon: '🧹', title: '消除重複程式碼', desc: 'Auth 相關 LOC 從 ~3000 收斂至共用 ~800' },
                  { icon: '📘', title: 'Storybook 文件', desc: '100+ 元件有互動文件，設計師直接查閱' },
                ].map((item) => (
                  <Appear key={item.title}>
                    <Box backgroundColor="secondary" borderRadius="6px" padding="8px 12px" marginBottom="6px" borderLeft="3px solid #4caf50">
                      <Text color="quinary" fontSize="13px" margin={0} fontWeight="bold">{item.icon} {item.title}</Text>
                      <Text color="quinary" fontSize="12px" margin="2px 0 0" opacity={0.8}>{item.desc}</Text>
                    </Box>
                  </Appear>
                ))}
              </Box>
            </Grid>
          </>
        )}
        <Notes>挑戰與量化成果</Notes>
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 2
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 2-1. Current Status ──────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目二')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">dogcatstar.com 效能評估</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr" gridGap="16px">
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">技術棧觀察</Text>
                <Box backgroundColor="secondary" borderRadius="6px" padding="10px" marginBottom="10px">
                  <FlexBox flexWrap="wrap" gap="5px" alignItems="flex-start">
                    {['WordPress', 'WooCommerce', 'jQuery', 'PHP'].map(chip)}
                  </FlexBox>
                </Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">Core Web Vitals（Mobile）</Text>
                <Box backgroundColor="secondary" borderRadius="6px" padding="10px">
                  {[
                    { metric: 'LCP', value: '~ 8.2s', status: '🔴 Poor', color: '#e94560' },
                    { metric: 'CLS', value: '~ 0.28', status: '🔴 Poor', color: '#e94560' },
                    { metric: 'INP', value: '~ 380ms', status: '🟡 Needs Improvement', color: '#f5c518' },
                  ].map((item) => (
                    <FlexBox key={item.metric} justifyContent="space-between" alignItems="center" marginBottom="5px">
                      <Text color="quinary" fontSize="13px" margin={0} fontFamily="monospace" fontWeight="bold">{item.metric}</Text>
                      <Text color="quinary" fontSize="13px" margin={0}>{item.value}</Text>
                      <Text fontSize="12px" margin={0} style={{ color: item.color }}>{item.status}</Text>
                    </FlexBox>
                  ))}
                </Box>
              </Box>
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">PageSpeed Insights</Text>
                <Box backgroundColor="secondary" borderRadius="6px" padding="12px" marginBottom="10px"
                  style={{ minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text color="quinary" fontSize="13px" textAlign="center" opacity={0.5}>
                    📸 請貼入 PageSpeed Insights 截圖<br />（Mobile / Desktop 分數）
                  </Text>
                </Box>
                <Box backgroundColor="tertiary" borderRadius="6px" padding="8px 12px">
                  <Text color="quinary" fontSize="12px" margin={0} textAlign="center" opacity={0.8}>
                    💡 分析時間：2026-03
                  </Text>
                </Box>
              </Box>
            </Grid>
          </>
        )}
        <Notes>面試前更新實際數值並替換截圖</Notes>
      </Slide>

      {/* ── 2-2. Problem Diagnosis ───────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目二')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">問題診斷 Top 5</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr" gridGap="7px">
              {[
                { no: '01', title: 'LCP 偏慢', desc: '大量商品圖 + banner 未優化，WordPress TTFB 高（共用主機）', color: '#e94560' },
                { no: '02', title: '第三方腳本過多', desc: 'GA4、FB Pixel、LINE Tag、客服 widget → render-blocking', color: '#e94560' },
                { no: '03', title: 'Unused CSS / JS', desc: '多外掛 + 多站點樣式全部載入，Coverage < 30%', color: '#f5c518' },
                { no: '04', title: 'DOM 節點過多', desc: 'WooCommerce shop 頁節點 > 3000，影響 INP 互動延遲', color: '#f5c518' },
                { no: '05', title: 'CLS 不穩定', desc: '動態促銷 banner、庫存狀態造成版面位移', color: '#f5c518' },
              ].map((item) => (
                <Appear key={item.no}>
                  <Box backgroundColor="secondary" borderRadius="6px" padding="8px 12px" borderLeft={`4px solid ${item.color}`}>
                    <FlexBox alignItems="center" marginBottom="3px" gap="6px">
                      <Text fontSize="15px" fontWeight="bold" margin={0} style={{ color: item.color }} fontFamily="monospace">{item.no}</Text>
                      <Text color="quinary" fontSize="13px" fontWeight="bold" margin={0}>{item.title}</Text>
                    </FlexBox>
                    <Text color="quinary" fontSize="12px" margin={0} opacity={0.8}>{item.desc}</Text>
                  </Box>
                </Appear>
              ))}
            </Grid>
          </>
        )}
        <Notes>五大問題</Notes>
      </Slide>

      {/* ── 2-3. Improvement Plan ────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目二')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">改善方案</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1.2fr 1.8fr 1.8fr" gridGap="2px">
              <Box backgroundColor="quaternary" padding="7px 10px" borderRadius="5px 0 0 0">
                <Text color="primary" fontSize="13px" fontWeight="bold" margin={0}>問題</Text>
              </Box>
              <Box backgroundColor="quaternary" padding="7px 10px">
                <Text color="primary" fontSize="13px" fontWeight="bold" margin={0}>短期（WordPress 內）</Text>
              </Box>
              <Box backgroundColor="quaternary" padding="7px 10px" borderRadius="0 5px 0 0">
                <Text color="primary" fontSize="13px" fontWeight="bold" margin={0}>長期（Next.js 重構）</Text>
              </Box>
              {[
                { issue: 'LCP', short: 'fetchpriority + WebP 轉換', long: '<Image> 元件 + ISR 快取' },
                { issue: '第三方腳本', short: 'async / defer 載入', long: 'next/script lazyOnload' },
                { issue: 'Unused CSS', short: 'PurgeCSS 整合', long: 'StyleX zero-runtime atomic CSS' },
                { issue: 'DOM 過大', short: '清除廢棄外掛', long: 'React 虛擬化列表' },
                { issue: 'CLS', short: '預留 banner 最小高度', long: 'Server Component 預載佈局' },
              ].map((row, i) => (
                <>
                  <Box key={`i-${i}`} backgroundColor={i % 2 === 0 ? 'secondary' : 'tertiary'} padding="8px 10px">
                    <Text color="quaternary" fontSize="12px" fontWeight="bold" margin={0} fontFamily="monospace">{row.issue}</Text>
                  </Box>
                  <Box key={`s-${i}`} backgroundColor={i % 2 === 0 ? 'secondary' : 'tertiary'} padding="8px 10px">
                    <Text color="quinary" fontSize="12px" margin={0}>{row.short}</Text>
                  </Box>
                  <Box key={`l-${i}`} backgroundColor={i % 2 === 0 ? 'secondary' : 'tertiary'} padding="8px 10px">
                    <Text color="quinary" fontSize="12px" margin={0}>{row.long}</Text>
                  </Box>
                </>
              ))}
            </Grid>
          </>
        )}
        {aiTag}
        <Notes>短期 vs 長期改善策略</Notes>
      </Slide>

      {/* ── 2-4. Architecture Vision ─────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目二')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">架構願景</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap="10px">
              {[
                { icon: '⚛️', title: 'Next.js App Router', color: '#2196f3',
                  items: ['Server Components（零 JS bundle）', 'Streaming SSR', 'React Server Actions'] },
                { icon: '🌍', title: 'CDN & Edge', color: '#4caf50',
                  items: ['CloudFront / Vercel Edge', '全球多站點加速', 'Image Optimization at Edge'] },
                { icon: '📦', title: 'Headless Stack', color: '#e94560',
                  items: ['Headless CMS（Sanity / Contentful）', 'StyleX zero-runtime CSS', 'WooCommerce REST API'] },
              ].map((card) => (
                <Appear key={card.title}>
                  <Box backgroundColor="secondary" borderRadius="8px" padding="12px 14px" borderTop={`4px solid ${card.color}`}>
                    <Text fontSize="20px" margin="0 0 4px">{card.icon}</Text>
                    <Text color="quinary" fontSize="13px" fontWeight="bold" margin="0 0 6px">{card.title}</Text>
                    {card.items.map((item) => bullet(item, true))}
                  </Box>
                </Appear>
              ))}
            </Grid>
            <Appear>
              <Box backgroundColor="secondary" borderRadius="6px" padding="8px 16px" marginTop="8px" borderLeft="4px solid #e94560">
                <Text color="quinary" fontSize="13px" margin={0} textAlign="center">
                  🎯 目標：LCP &lt; 2.5s · CLS &lt; 0.1 · INP &lt; 200ms（Core Web Vitals 全綠）
                </Text>
              </Box>
            </Appear>
          </>
        )}
        {aiTag}
        <Notes>理想架構方向</Notes>
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 3
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 3-1. Project Introduction ───────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目三')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">alphacast-frontend</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr" gridGap="16px">
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">專案背景</Text>
                <Box backgroundColor="secondary" borderRadius="6px" padding="10px" marginBottom="10px">
                  <Text color="quinary" fontSize="13px" margin="0 0 4px">程式助教設計的練習用專案（公開 repo）</Text>
                  <Text color="quinary" fontSize="12px" opacity={0.8} margin={0}>
                    模擬真實產品開發流程：UI 實作、API 整合、測試策略一次到位
                  </Text>
                </Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">技術選型</Text>
                <Box backgroundColor="secondary" borderRadius="6px" padding="10px">
                  <FlexBox flexWrap="wrap" gap="5px" alignItems="flex-start">
                    {['React 18', 'TypeScript', 'Vite', 'React Query', 'MSW', 'Storybook'].map(chip)}
                  </FlexBox>
                </Box>
              </Box>
              <Box>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">選型理由</Text>
                {[
                  { title: 'React Query', desc: '伺服器狀態 vs UI 狀態分離，快取/重試/loading 開箱即用', color: '#e94560' },
                  { title: 'MSW', desc: 'Service Worker 層攔截，前後端可完全並行開發，同一 handler 用於測試', color: '#f5c518' },
                  { title: 'Storybook', desc: '元件隔離開發，視覺 regression 測試，設計師可直接驗收', color: '#4caf50' },
                ].map((item) => (
                  <Appear key={item.title}>
                    <Box backgroundColor="secondary" borderRadius="6px" padding="8px 12px" marginBottom="6px" borderLeft={`3px solid ${item.color}`}>
                      <Text color="quinary" fontSize="13px" fontWeight="bold" margin="0 0 2px">{item.title}</Text>
                      <Text color="quinary" fontSize="12px" margin={0} opacity={0.8}>{item.desc}</Text>
                    </Box>
                  </Appear>
                ))}
              </Box>
            </Grid>
          </>
        )}
        <Notes>練習專案目標與技術選型</Notes>
      </Slide>

      {/* ── 3-2. Code Style ──────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目三')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">Code Style 原則</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr" gridGap="10px">
              {[
                { icon: '🔷', title: 'TypeScript Strict', color: '#2196f3',
                  items: ['strict mode 開啟，no any', 'Proper generics 避免重複型別', 'Discriminated unions 處理狀態'] },
                { icon: '🪝', title: 'Custom Hooks 設計', color: '#e94560',
                  items: ['單一職責：一個 hook 做一件事', '邏輯與 UI 完全解耦', '回傳 tuple 或具名物件'] },
                { icon: '🧪', title: 'MSW 測試策略', color: '#4caf50',
                  items: ['API 層完全 mock，不依賴後端', '同一 handler 開發 + 單元測試共用', '模擬 loading / error / empty state'] },
                { icon: '🤖', title: 'Git Workflow', color: '#f5c518',
                  items: ['Husky + lint-staged：commit 前自動 lint', 'commitlint：強制 conventional commits', 'PR 前 Storybook snapshot diff'] },
              ].map((card) => (
                <Box key={card.title} backgroundColor="secondary" borderRadius="8px" padding="10px 14px" borderLeft={`4px solid ${card.color}`}>
                  <Text color="quinary" fontSize="13px" fontWeight="bold" margin="0 0 6px">{card.icon} {card.title}</Text>
                  {card.items.map((item) => bullet(item, true))}
                </Box>
              ))}
            </Grid>
          </>
        )}
        <Notes>四大 Code Style 原則</Notes>
      </Slide>

      {/* ── 3-3. Code Highlights ─────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            {sectionBadge('題目三')}
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">程式碼亮點</Heading>
            {accentBar}
            <Grid gridTemplateColumns="1fr 1fr" gridGap="14px" style={{ overflow: 'hidden' }}>
              <Box style={{ overflow: 'hidden' }}>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">
                  Auth Library — useAuth() Hook
                </Text>
                <Box style={{ fontSize: '11px', lineHeight: 1.4, overflow: 'hidden' }}>
                  <CodePane language="typescript">{useAuthCode}</CodePane>
                </Box>
              </Box>
              <Box style={{ overflow: 'hidden' }}>
                <Text color="quaternary" fontSize="13px" fontWeight="bold" margin="0 0 5px">
                  alphacast — useEpisodes() + MSW
                </Text>
                <Box style={{ fontSize: '11px', lineHeight: 1.4, overflow: 'hidden' }}>
                  <CodePane language="typescript">{reactQueryCode}</CodePane>
                </Box>
              </Box>
            </Grid>
          </>
        )}
        <Notes>Auth Library hook + React Query / MSW 整合</Notes>
      </Slide>

      {/* ── Closing ──────────────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" alignItems="center" justifyContent="center">
          <Heading color="quinary" fontSize="48px" textAlign="center" margin="0 0 8px">感謝聆聽</Heading>
          <Box height="3px" width="56px" backgroundColor="quaternary" borderRadius="2px" margin="0 0 22px" />
          <Text color="quinary" fontSize="20px" textAlign="center" margin="0 0 28px">Q &amp; A</Text>
          <FlexBox gap="12px" flexWrap="wrap" justifyContent="center">
            {[
              { label: 'GitHub', value: 'github.com/YuriTsaiTW' },
              { label: 'LinkedIn', value: 'linkedin.com/in/hsiuhuitsai' },
              { label: 'Blog', value: 'yuritsaitw.github.io/blog' },
            ].map((item) => (
              <Box key={item.label} backgroundColor="secondary" borderRadius="8px" padding="10px 18px" textAlign="center">
                <Text color="quaternary" fontSize="12px" fontWeight="bold" margin="0 0 3px">{item.label}</Text>
                <Text color="quinary" fontSize="13px" margin={0} fontFamily="monospace">{item.value}</Text>
              </Box>
            ))}
          </FlexBox>
          <Text color="quinary" fontSize="14px" opacity={0.5} margin="28px 0 0" textAlign="center">
            蔡秀慧 · Yuri Tsai · 2026
          </Text>
        </FlexBox>
        <Notes>開放 Q&A</Notes>
      </Slide>

    </Deck>
  );
}

export default App;
