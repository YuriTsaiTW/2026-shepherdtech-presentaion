import {
  Deck,
  Slide,
  Heading,
  Text,
  UnorderedList,
  ListItem,
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

// ─── Bottom template (FullScreen + Progress) ─────────────────────────────────

const template = () => (
  <FlexBox
    justifyContent="space-between"
    position="absolute"
    bottom={0}
    width={1}
    padding="0 16px 8px"
  >
    <Box>
      <FullScreen color="#e94560" />
    </Box>
    <Box>
      <Progress color="#e94560" />
    </Box>
  </FlexBox>
);

// ─── Shared style helpers ─────────────────────────────────────────────────────

const accentBar = (
  <Box
    height="4px"
    width="60px"
    backgroundColor="quaternary"
    margin="8px 0 24px"
    borderRadius="2px"
  />
);

const sectionBadge = (label: string) => (
  <Box
    backgroundColor="quaternary"
    padding="4px 16px"
    borderRadius="20px"
    display="inline-block"
    marginBottom="16px"
  >
    <Text fontSize="18px" color="quinary" margin={0} fontWeight="bold">
      {label}
    </Text>
  </Box>
);

const chip = (label: string) => (
  <Box
    backgroundColor="tertiary"
    padding="6px 14px"
    borderRadius="6px"
    display="inline-block"
    margin="4px"
  >
    <Text fontSize="18px" color="quinary" margin={0}>
      {label}
    </Text>
  </Box>
);

const aiTag = (
  <Box
    position="absolute"
    bottom="40px"
    right="24px"
    backgroundColor="secondary"
    padding="4px 10px"
    borderRadius="4px"
    opacity={0.7}
  >
    <Text fontSize="14px" color="quaternary" margin={0}>
      🤖 AI assisted
    </Text>
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

// ─── Slides ───────────────────────────────────────────────────────────────────

function App() {
  return (
    <Deck theme={theme} template={template}>

      {/* ── 0. Cover ─────────────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" alignItems="center" justifyContent="center">
          <Box marginBottom="8px">
            {sectionBadge('Frontend Engineer')}
          </Box>
          <Heading
            color="quinary"
            fontSize="64px"
            textAlign="center"
            margin="0 0 8px"
          >
            前端工程師技術簡報
          </Heading>
          <Box height="4px" width="80px" backgroundColor="quaternary" borderRadius="2px" margin="0 0 24px" />
          <Text color="quinary" fontSize="28px" textAlign="center" margin="0 0 8px">
            Shepherd Tech 牧羊人集團
          </Text>
          <Text color="quinary" fontSize="20px" opacity={0.6} margin="0 0 48px">
            2026
          </Text>
          <Text color="quinary" fontSize="22px" fontWeight="bold">
            蔡秀慧 · Yuri Tsai
          </Text>
        </FlexBox>
        <Notes>封面頁：開場白，簡單自我介紹</Notes>
      </Slide>

      {/* ── 1. Self Introduction ──────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          <Heading color="quinary" fontSize="44px" margin="0 0 4px">
            自我介紹
          </Heading>
          {accentBar}
          <Grid gridTemplateColumns="1fr 1fr" gridGap="24px" width="100%">
            <Box>
              <Text color="quinary" fontSize="22px" fontWeight="bold" margin="0 0 8px">
                蔡秀慧 · Yuri Tsai
              </Text>
              <Text color="quinary" fontSize="18px" opacity={0.8} margin="0 0 24px">
                Senior Frontend Engineer（10+ 年前端經驗）
              </Text>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                現職
              </Text>
              <Text color="quinary" fontSize="17px" opacity={0.9} margin="0 0 24px">
                ViewSonic 優派國際股份有限公司<br />
                資深前端工程師 | 2023 - Present
              </Text>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                學歷
              </Text>
              <Text color="quinary" fontSize="17px" opacity={0.9}>
                國立中山大學 資訊管理系<br />
                大學部＆碩士班 | 2009 - 2015
              </Text>
            </Box>
            <Box>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                前端技術棧
              </Text>
              <FlexBox flexWrap="wrap" gap="8px" marginBottom="20px">
                {['TypeScript', 'React', 'React Native', 'Next.js', 'TailwindCSS'].map((t) => chip(t))}
              </FlexBox>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                工具 &amp; 基礎設施
              </Text>
              <FlexBox flexWrap="wrap" gap="8px" marginBottom="20px">
                {['NX Monorepo', 'Storybook', 'MSW', 'AWS', 'Claude Code'].map((t) => chip(t))}
              </FlexBox>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                其他專長
              </Text>
              <FlexBox flexWrap="wrap" gap="8px">
                {['OIDC Auth', 'A11y', 'i18n', 'CI/CD', 'Agentic Programming'].map((t) => chip(t))}
              </FlexBox>
            </Box>
          </Grid>
        </FlexBox>
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 1：最困難的系統架構
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 1-1. Context ─────────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目一')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            最困難的系統架構設計
          </Heading>
          {accentBar}
          <Text color="quinary" fontSize="22px" fontWeight="bold" margin="0 0 16px">
            背景 Context
          </Text>
          <Appear>
            <Box
              backgroundColor="secondary"
              borderRadius="12px"
              padding="20px 24px"
              marginBottom="16px"
              borderLeft="4px solid #e94560"
            >
              <Text color="quinary" fontSize="18px" margin={0}>
                <strong style={{ color: '#e94560' }}>ViewSonic 教育事業部</strong>
                ：同時維護多個教育產品
              </Text>
              <UnorderedList margin="8px 0 0" fontSize="17px">
                <ListItem>
                  <Text color="quinary" fontSize="17px" margin={0}>Content Platform（內容管理）</Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="17px" margin={0}>Lesson Generator（AI 課程生成）</Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="17px" margin={0}>白板 Web App（協作白板）</Text>
                </ListItem>
              </UnorderedList>
            </Box>
          </Appear>
          <Appear>
            <Box
              backgroundColor="secondary"
              borderRadius="12px"
              padding="20px 24px"
              borderLeft="4px solid #f5c518"
            >
              <Text color="quinary" fontSize="18px" fontWeight="bold" margin="0 0 8px">
                ⚠️ 痛點
              </Text>
              <UnorderedList margin={0} fontSize="17px">
                <ListItem>
                  <Text color="quinary" fontSize="17px" margin={0}>
                    各產品<strong style={{ color: '#f5c518' }}>重複建置</strong> OIDC Auth 邏輯 → 版本不一致、難維護
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="17px" margin={0}>
                    基礎 UI 元件分散各 repo → 設計無法收斂
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="17px" margin={0}>
                    新產品接入成本高，估計 2-3 週起跳
                  </Text>
                </ListItem>
              </UnorderedList>
            </Box>
          </Appear>
        </FlexBox>
        <Notes>說明為什麼需要解決這個問題，痛點具體化</Notes>
      </Slide>

      {/* ── 1-2. Architecture Overview ───────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目一')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            架構全貌
          </Heading>
          {accentBar}

          {/* NX Monorepo diagram */}
          <Box
            backgroundColor="secondary"
            borderRadius="12px"
            padding="20px 24px"
            width="100%"
          >
            <Text color="quaternary" fontSize="16px" fontWeight="bold" margin="0 0 12px" textAlign="center">
              NX Monorepo Structure
            </Text>
            <Grid
              gridTemplateColumns="1fr 1fr"
              gridGap="16px"
              marginBottom="16px"
            >
              {/* Apps column */}
              <Box backgroundColor="tertiary" borderRadius="8px" padding="12px">
                <Text color="quaternary" fontSize="15px" fontWeight="bold" margin="0 0 8px" textAlign="center">
                  apps/
                </Text>
                {['content-platform', 'lesson-generator', 'whiteboard'].map((app) => (
                  <Box
                    key={app}
                    backgroundColor="primary"
                    borderRadius="6px"
                    padding="6px 10px"
                    marginBottom="6px"
                  >
                    <Text color="quinary" fontSize="14px" margin={0} fontFamily="monospace">
                      {app}
                    </Text>
                  </Box>
                ))}
              </Box>

              {/* Libs column */}
              <Box backgroundColor="tertiary" borderRadius="8px" padding="12px">
                <Text color="quaternary" fontSize="15px" fontWeight="bold" margin="0 0 8px" textAlign="center">
                  libs/ （分層）
                </Text>
                {[
                  { name: 'auth-lib', color: '#e94560' },
                  { name: 'common-lib', color: '#f5c518' },
                  { name: 'foundation', color: '#4caf50' },
                  { name: 'component-lib', color: '#2196f3' },
                ].map((lib) => (
                  <Box
                    key={lib.name}
                    backgroundColor="primary"
                    borderRadius="6px"
                    padding="6px 10px"
                    marginBottom="6px"
                    borderLeft={`3px solid ${lib.color}`}
                  >
                    <Text color="quinary" fontSize="14px" margin={0} fontFamily="monospace">
                      @acme/{lib.name}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Communication */}
            <FlexBox justifyContent="center" gap="24px">
              <Box backgroundColor="primary" borderRadius="6px" padding="6px 16px">
                <Text color="quinary" fontSize="14px" margin={0}>
                  🔗 REST API <span style={{ color: '#e94560' }}>Content Platform</span>
                </Text>
              </Box>
              <Box backgroundColor="primary" borderRadius="6px" padding="6px 16px">
                <Text color="quinary" fontSize="14px" margin={0}>
                  ⚡ WebSocket <span style={{ color: '#e94560' }}>Lesson Generator</span>
                </Text>
              </Box>
              <Box backgroundColor="primary" borderRadius="6px" padding="6px 16px">
                <Text color="quinary" fontSize="14px" margin={0}>
                  ☁️ Deploy on <span style={{ color: '#e94560' }}>AWS</span>
                </Text>
              </Box>
            </FlexBox>
          </Box>
        </FlexBox>
        {aiTag}
        <Notes>架構圖說明 monorepo 結構，libs 分層由底至上：foundation → component-lib → common-lib → auth-lib</Notes>
      </Slide>

      {/* ── 1-3. Auth Library Technical Details ─────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目一')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            Auth Library 技術細節
          </Heading>
          {accentBar}

          <Grid gridTemplateColumns="1fr 1fr" gridGap="24px" width="100%">
            <Box>
              <Text color="quaternary" fontSize="17px" fontWeight="bold" margin="0 0 10px">
                OIDC Implementation
              </Text>
              <UnorderedList margin="0 0 20px" fontSize="16px">
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    Authorization Code Flow + <strong style={{ color: '#e94560' }}>PKCE</strong>
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    Refresh Token 靜默更新
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    Session 持久化（BroadcastChannel 跨 Tab）
                  </Text>
                </ListItem>
              </UnorderedList>

              <Text color="quaternary" fontSize="17px" fontWeight="bold" margin="0 0 10px">
                Developer API
              </Text>
              <UnorderedList margin="0 0 20px" fontSize="16px">
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0} fontFamily="monospace">
                    useAuth() / useToken() hooks
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0} fontFamily="monospace">
                    {'<AuthProvider>'}
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0} fontFamily="monospace">
                    withAuth() HOC
                  </Text>
                </ListItem>
              </UnorderedList>
            </Box>
            <Box>
              <Text color="quaternary" fontSize="17px" fontWeight="bold" margin="0 0 10px">
                為什麼選 NX？
              </Text>
              <UnorderedList margin="0 0 20px" fontSize="16px">
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    <strong style={{ color: '#e94560' }}>affected commands</strong>：只跑受影響的 CI
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    Dependency Graph 視覺化
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    Code Generation（vs Turborepo 無 generator）
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    Lerna 已式微，NX 社群較活躍
                  </Text>
                </ListItem>
              </UnorderedList>

              <Text color="quaternary" fontSize="17px" fontWeight="bold" margin="0 0 10px">
                文件化
              </Text>
              <UnorderedList margin={0} fontSize="16px">
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    Storybook 互動文件
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="quinary" fontSize="16px" margin={0}>
                    Figma MCP 對齊設計稿
                  </Text>
                </ListItem>
              </UnorderedList>
            </Box>
          </Grid>
        </FlexBox>
        <Notes>強調 PKCE 安全性、NX 選型理由（vs Turborepo/Lerna），以及文件化策略</Notes>
      </Slide>

      {/* ── 1-4. Trade-offs & Results ────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目一')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            挑戰與成果
          </Heading>
          {accentBar}

          <Grid gridTemplateColumns="1fr 1fr" gridGap="24px" width="100%">
            <Box>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                ⚔️ 挑戰 Trade-offs
              </Text>
              <Appear>
                <Box
                  backgroundColor="secondary"
                  borderRadius="8px"
                  padding="12px 16px"
                  marginBottom="10px"
                  borderLeft="3px solid #e94560"
                >
                  <Text color="quinary" fontSize="16px" margin={0} fontWeight="bold">
                    CI 時間
                  </Text>
                  <Text color="quinary" fontSize="15px" margin="4px 0 0" opacity={0.8}>
                    Monorepo 規模大後 CI 耗時增加，靠 NX Cloud 遠端緩存緩解
                  </Text>
                </Box>
              </Appear>
              <Appear>
                <Box
                  backgroundColor="secondary"
                  borderRadius="8px"
                  padding="12px 16px"
                  marginBottom="10px"
                  borderLeft="3px solid #f5c518"
                >
                  <Text color="quinary" fontSize="16px" margin={0} fontWeight="bold">
                    抽象粒度取捨
                  </Text>
                  <Text color="quinary" fontSize="15px" margin="4px 0 0" opacity={0.8}>
                    過早抽象反而增加耦合，需逐步從具體到抽象
                  </Text>
                </Box>
              </Appear>
              <Appear>
                <Box
                  backgroundColor="secondary"
                  borderRadius="8px"
                  padding="12px 16px"
                  borderLeft="3px solid #2196f3"
                >
                  <Text color="quinary" fontSize="16px" margin={0} fontWeight="bold">
                    跨團隊推廣
                  </Text>
                  <Text color="quinary" fontSize="15px" margin="4px 0 0" opacity={0.8}>
                    需建立共識、提供文件，降低學習曲線
                  </Text>
                </Box>
              </Appear>
            </Box>
            <Box>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                ✅ 成果 Results
              </Text>
              {[
                { icon: '🔌', title: '多產品接入', desc: '3 個產品接入同一 auth lib，行為一致' },
                { icon: '⚡', title: '接入時間縮短', desc: '新產品接 auth：2-3 週 → 2-3 天' },
                { icon: '🧹', title: '消除重複程式碼', desc: 'Auth 相關 LOC 從 ~3000 收斂至共用 ~800' },
                { icon: '📘', title: 'Storybook 文件', desc: '100+ 元件有互動文件，設計師直接查閱' },
              ].map((item) => (
                <Appear key={item.title}>
                  <Box
                    backgroundColor="secondary"
                    borderRadius="8px"
                    padding="10px 16px"
                    marginBottom="10px"
                    borderLeft="3px solid #4caf50"
                  >
                    <Text color="quinary" fontSize="16px" margin={0} fontWeight="bold">
                      {item.icon} {item.title}
                    </Text>
                    <Text color="quinary" fontSize="14px" margin="2px 0 0" opacity={0.8}>
                      {item.desc}
                    </Text>
                  </Box>
                </Appear>
              ))}
            </Box>
          </Grid>
        </FlexBox>
        <Notes>數字為示意，請依實際情況補充。強調具體量化成果</Notes>
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 2：dogcatstar.com 效能分析
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 2-1. Current Status ──────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目二')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            dogcatstar.com 效能評估
          </Heading>
          {accentBar}

          <Grid gridTemplateColumns="1fr 1fr" gridGap="24px" width="100%">
            <Box>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                技術棧觀察
              </Text>
              <Box
                backgroundColor="secondary"
                borderRadius="8px"
                padding="16px"
                marginBottom="16px"
              >
                <FlexBox flexWrap="wrap" gap="8px">
                  {['WordPress', 'WooCommerce', 'jQuery', 'PHP'].map((t) => chip(t))}
                </FlexBox>
              </Box>

              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                Core Web Vitals（Mobile）
              </Text>
              <Box backgroundColor="secondary" borderRadius="8px" padding="16px">
                {[
                  { metric: 'LCP', value: '~ 8.2s', status: '🔴 Poor', color: '#e94560' },
                  { metric: 'CLS', value: '~ 0.28', status: '🔴 Poor', color: '#e94560' },
                  { metric: 'INP', value: '~ 380ms', status: '🟡 Needs Improvement', color: '#f5c518' },
                ].map((item) => (
                  <FlexBox key={item.metric} justifyContent="space-between" alignItems="center" marginBottom="8px">
                    <Text color="quinary" fontSize="16px" margin={0} fontFamily="monospace" fontWeight="bold">
                      {item.metric}
                    </Text>
                    <Text color="quinary" fontSize="16px" margin={0}>
                      {item.value}
                    </Text>
                    <Text fontSize="14px" margin={0} style={{ color: item.color }}>
                      {item.status}
                    </Text>
                  </FlexBox>
                ))}
              </Box>
            </Box>
            <Box>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                PageSpeed Insights
              </Text>
              <Box
                backgroundColor="secondary"
                borderRadius="8px"
                padding="24px"
                height="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginBottom="16px"
              >
                <Text color="quinary" fontSize="15px" textAlign="center" opacity={0.6}>
                  📸 請貼入 PageSpeed Insights 截圖<br />
                  （Mobile / Desktop 分數）
                </Text>
              </Box>
              <Box
                backgroundColor="tertiary"
                borderRadius="8px"
                padding="12px 16px"
              >
                <Text color="quinary" fontSize="14px" margin={0} textAlign="center" opacity={0.8}>
                  💡 PageSpeed Insights 分析時間：2026-03
                </Text>
              </Box>
            </Box>
          </Grid>
        </FlexBox>
        <Notes>數字為根據公開 PageSpeed 工具的估算，面試前請更新為實際數值並替換截圖</Notes>
      </Slide>

      {/* ── 2-2. Problem Diagnosis ───────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目二')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            問題診斷 Top 5
          </Heading>
          {accentBar}

          <Grid gridTemplateColumns="1fr 1fr" gridGap="12px" width="100%">
            {[
              {
                no: '01',
                title: 'LCP 偏慢',
                desc: '大量商品圖 + banner 未優化，WordPress TTFB 高（共用主機）',
                color: '#e94560',
              },
              {
                no: '02',
                title: '第三方腳本過多',
                desc: 'GA4、FB Pixel、LINE Tag、客服 widget → render-blocking',
                color: '#e94560',
              },
              {
                no: '03',
                title: 'Unused CSS / JS',
                desc: '多外掛 + 多站點樣式全部載入，Coverage < 30%',
                color: '#f5c518',
              },
              {
                no: '04',
                title: 'DOM 節點過多',
                desc: 'WooCommerce shop 頁節點 > 3000，影響 INP 互動延遲',
                color: '#f5c518',
              },
              {
                no: '05',
                title: 'CLS 不穩定',
                desc: '動態促銷 banner、庫存狀態造成版面位移',
                color: '#f5c518',
              },
            ].map((item) => (
              <Appear key={item.no}>
                <Box
                  backgroundColor="secondary"
                  borderRadius="8px"
                  padding="14px 16px"
                  borderLeft={`4px solid ${item.color}`}
                >
                  <FlexBox alignItems="center" marginBottom="6px" gap="10px">
                    <Text
                      fontSize="22px"
                      fontWeight="bold"
                      margin={0}
                      style={{ color: item.color }}
                      fontFamily="monospace"
                    >
                      {item.no}
                    </Text>
                    <Text color="quinary" fontSize="16px" fontWeight="bold" margin={0}>
                      {item.title}
                    </Text>
                  </FlexBox>
                  <Text color="quinary" fontSize="14px" margin={0} opacity={0.8}>
                    {item.desc}
                  </Text>
                </Box>
              </Appear>
            ))}
          </Grid>
        </FlexBox>
        <Notes>五大問題：LCP、第三方腳本、Unused CSS、DOM、CLS</Notes>
      </Slide>

      {/* ── 2-3. Improvement Plan ───────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目二')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            改善方案
          </Heading>
          {accentBar}

          {/* Table header */}
          <Grid gridTemplateColumns="1.2fr 1.8fr 1.8fr" gridGap="2px" width="100%">
            <Box backgroundColor="quaternary" padding="10px 14px" borderRadius="6px 0 0 0">
              <Text color="primary" fontSize="15px" fontWeight="bold" margin={0}>問題</Text>
            </Box>
            <Box backgroundColor="quaternary" padding="10px 14px">
              <Text color="primary" fontSize="15px" fontWeight="bold" margin={0}>
                短期（WordPress 內）
              </Text>
            </Box>
            <Box backgroundColor="quaternary" padding="10px 14px" borderRadius="0 6px 0 0">
              <Text color="primary" fontSize="15px" fontWeight="bold" margin={0}>
                長期（Next.js 重構）
              </Text>
            </Box>

            {[
              { issue: 'LCP', short: 'fetchpriority + WebP 轉換', long: '<Image> 元件 + ISR 快取' },
              { issue: '第三方腳本', short: 'async / defer 載入', long: 'next/script lazyOnload' },
              { issue: 'Unused CSS', short: 'PurgeCSS 整合', long: 'StyleX zero-runtime atomic CSS' },
              { issue: 'DOM 過大', short: '清除廢棄外掛', long: 'React 虛擬化列表（按需渲染）' },
              { issue: 'CLS', short: '預留 banner 最小高度', long: 'Server Component 預載佈局' },
            ].map((row, i) => (
              <>
                <Box
                  key={`i-${i}`}
                  backgroundColor={i % 2 === 0 ? 'secondary' : 'tertiary'}
                  padding="10px 14px"
                >
                  <Text color="quaternary" fontSize="14px" fontWeight="bold" margin={0} fontFamily="monospace">
                    {row.issue}
                  </Text>
                </Box>
                <Box
                  key={`s-${i}`}
                  backgroundColor={i % 2 === 0 ? 'secondary' : 'tertiary'}
                  padding="10px 14px"
                >
                  <Text color="quinary" fontSize="14px" margin={0}>{row.short}</Text>
                </Box>
                <Box
                  key={`l-${i}`}
                  backgroundColor={i % 2 === 0 ? 'secondary' : 'tertiary'}
                  padding="10px 14px"
                >
                  <Text color="quinary" fontSize="14px" margin={0}>{row.long}</Text>
                </Box>
              </>
            ))}
          </Grid>
        </FlexBox>
        {aiTag}
        <Notes>雙軌策略：短期 WordPress 內可做的快速改善，長期 Next.js 重構目標</Notes>
      </Slide>

      {/* ── 2-4. Architecture Vision ────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目二')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            架構願景
          </Heading>
          {accentBar}

          <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap="16px" width="100%">
            {[
              {
                icon: '⚛️',
                title: 'Next.js App Router',
                items: ['Server Components（零 JS bundle）', 'Streaming SSR', 'React Server Actions'],
                color: '#2196f3',
              },
              {
                icon: '🌍',
                title: 'CDN & Edge',
                items: ['CloudFront / Vercel Edge', '全球多站點加速', 'Image Optimization at Edge'],
                color: '#4caf50',
              },
              {
                icon: '📦',
                title: 'Headless Stack',
                items: ['Headless CMS（Sanity / Contentful）', 'StyleX zero-runtime CSS', 'WooCommerce REST API'],
                color: '#e94560',
              },
            ].map((card) => (
              <Appear key={card.title}>
                <Box
                  backgroundColor="secondary"
                  borderRadius="12px"
                  padding="20px"
                  borderTop={`4px solid ${card.color}`}
                  height="220px"
                >
                  <Text fontSize="28px" margin="0 0 8px">{card.icon}</Text>
                  <Text color="quinary" fontSize="16px" fontWeight="bold" margin="0 0 12px">
                    {card.title}
                  </Text>
                  <UnorderedList margin={0}>
                    {card.items.map((item) => (
                      <ListItem key={item}>
                        <Text color="quinary" fontSize="14px" margin="0 0 4px" opacity={0.85}>
                          {item}
                        </Text>
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </Appear>
            ))}
          </Grid>

          <Appear>
            <Box
              backgroundColor="secondary"
              borderRadius="8px"
              padding="12px 20px"
              marginTop="16px"
              borderLeft="4px solid #e94560"
              width="100%"
            >
              <Text color="quinary" fontSize="15px" margin={0} textAlign="center">
                🎯 目標：LCP &lt; 2.5s · CLS &lt; 0.1 · INP &lt; 200ms（Core Web Vitals 全綠）
              </Text>
            </Box>
          </Appear>
        </FlexBox>
        {aiTag}
        <Notes>展示理想架構方向，加分題。說明 Headless CMS + Next.js 是業界主流電商現代化路徑</Notes>
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 3：實作問題 alphacast-frontend
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 3-1. Project Introduction ───────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目三')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            alphacast-frontend
          </Heading>
          {accentBar}

          <Grid gridTemplateColumns="1fr 1fr" gridGap="24px" width="100%">
            <Box>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                專案背景
              </Text>
              <Box
                backgroundColor="secondary"
                borderRadius="8px"
                padding="16px"
                marginBottom="16px"
              >
                <Text color="quinary" fontSize="16px" margin="0 0 8px">
                  程式助教設計的練習用專案（公開 repo）
                </Text>
                <Text color="quinary" fontSize="15px" opacity={0.8} margin={0}>
                  模擬真實產品開發流程：UI 實作、API 整合、測試策略一次到位
                </Text>
              </Box>

              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                技術選型
              </Text>
              <Box backgroundColor="secondary" borderRadius="8px" padding="16px">
                <FlexBox flexWrap="wrap" gap="8px">
                  {['React 18', 'TypeScript', 'Vite', 'React Query', 'MSW', 'Storybook'].map((t) => chip(t))}
                </FlexBox>
              </Box>
            </Box>
            <Box>
              <Text color="quaternary" fontSize="18px" fontWeight="bold" margin="0 0 12px">
                選型理由
              </Text>
              {[
                {
                  title: 'React Query',
                  desc: '伺服器狀態 vs UI 狀態分離，快取/重試/loading 狀態開箱即用',
                  color: '#e94560',
                },
                {
                  title: 'MSW',
                  desc: 'Service Worker 層攔截，前後端可完全並行開發，同一 handler 用於測試',
                  color: '#f5c518',
                },
                {
                  title: 'Storybook',
                  desc: '元件隔離開發，視覺 regression 測試，設計師可直接驗收',
                  color: '#4caf50',
                },
              ].map((item) => (
                <Appear key={item.title}>
                  <Box
                    backgroundColor="secondary"
                    borderRadius="8px"
                    padding="12px 16px"
                    marginBottom="10px"
                    borderLeft={`3px solid ${item.color}`}
                  >
                    <Text color="quinary" fontSize="15px" fontWeight="bold" margin="0 0 4px">
                      {item.title}
                    </Text>
                    <Text color="quinary" fontSize="14px" margin={0} opacity={0.8}>
                      {item.desc}
                    </Text>
                  </Box>
                </Appear>
              ))}
            </Box>
          </Grid>
        </FlexBox>
        <Notes>說明練習專案的目標與技術選型邏輯</Notes>
      </Slide>

      {/* ── 3-2. Code Style ─────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目三')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            Code Style 原則
          </Heading>
          {accentBar}

          <Grid gridTemplateColumns="1fr 1fr" gridGap="16px" width="100%">
            {[
              {
                icon: '🔷',
                title: 'TypeScript Strict',
                items: [
                  'strict mode 開啟，no any',
                  'Proper generics 避免重複型別',
                  'Discriminated unions 處理狀態',
                ],
                color: '#2196f3',
              },
              {
                icon: '🪝',
                title: 'Custom Hooks 設計',
                items: [
                  '單一職責：一個 hook 做一件事',
                  '邏輯與 UI 完全解耦',
                  '回傳 tuple 或具名物件',
                ],
                color: '#e94560',
              },
              {
                icon: '🧪',
                title: 'MSW 測試策略',
                items: [
                  'API 層完全 mock，不依賴後端',
                  '同一 handler 開發 + 單元測試共用',
                  '模擬 loading / error / empty state',
                ],
                color: '#4caf50',
              },
              {
                icon: '🤖',
                title: 'Git Workflow',
                items: [
                  'Husky + lint-staged：commit 前自動 lint',
                  'commitlint：強制 conventional commits',
                  'PR 前 Storybook snapshot diff',
                ],
                color: '#f5c518',
              },
            ].map((card) => (
              <Box
                key={card.title}
                backgroundColor="secondary"
                borderRadius="10px"
                padding="16px 18px"
                borderLeft={`4px solid ${card.color}`}
              >
                <Text color="quinary" fontSize="16px" fontWeight="bold" margin="0 0 10px">
                  {card.icon} {card.title}
                </Text>
                <UnorderedList margin={0}>
                  {card.items.map((item) => (
                    <ListItem key={item}>
                      <Text color="quinary" fontSize="14px" margin="0 0 3px" opacity={0.85}>
                        {item}
                      </Text>
                    </ListItem>
                  ))}
                </UnorderedList>
              </Box>
            ))}
          </Grid>
        </FlexBox>
        <Notes>Code style 四大原則，強調可維護性與測試性</Notes>
      </Slide>

      {/* ── 3-3. Code Highlights ────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" padding="0 48px">
          {sectionBadge('題目三')}
          <Heading color="quinary" fontSize="40px" margin="0 0 4px">
            程式碼亮點
          </Heading>
          {accentBar}

          <Grid gridTemplateColumns="1fr 1fr" gridGap="24px" width="100%">
            <Box>
              <Text color="quaternary" fontSize="16px" fontWeight="bold" margin="0 0 8px">
                Auth Library — useAuth() Hook
              </Text>
              <CodePane language="typescript">
                {useAuthCode}
              </CodePane>
            </Box>
            <Box>
              <Text color="quaternary" fontSize="16px" fontWeight="bold" margin="0 0 8px">
                alphacast — useEpisodes() + MSW
              </Text>
              <CodePane language="typescript">
                {reactQueryCode}
              </CodePane>
            </Box>
          </Grid>
        </FlexBox>
        <Notes>左側展示 Auth Library hook 封裝，右側展示 React Query + MSW 整合模式</Notes>
      </Slide>

      {/* ── Closing ─────────────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" alignItems="center" justifyContent="center">
          <Heading color="quinary" fontSize="56px" textAlign="center" margin="0 0 8px">
            感謝聆聽
          </Heading>
          <Box height="4px" width="80px" backgroundColor="quaternary" borderRadius="2px" margin="0 0 32px" />
          <Text color="quinary" fontSize="24px" textAlign="center" margin="0 0 40px">
            Q &amp; A
          </Text>

          <FlexBox gap="20px" flexWrap="wrap" justifyContent="center">
            <Box
              backgroundColor="secondary"
              borderRadius="10px"
              padding="14px 24px"
              textAlign="center"
            >
              <Text color="quaternary" fontSize="14px" fontWeight="bold" margin="0 0 6px">
                GitHub
              </Text>
              <Text color="quinary" fontSize="15px" margin={0} fontFamily="monospace">
                github.com/YuriTsaiTW
              </Text>
            </Box>
            <Box
              backgroundColor="secondary"
              borderRadius="10px"
              padding="14px 24px"
              textAlign="center"
            >
              <Text color="quaternary" fontSize="14px" fontWeight="bold" margin="0 0 6px">
                LinkedIn
              </Text>
              <Text color="quinary" fontSize="15px" margin={0} fontFamily="monospace">
                linkedin.com/in/hsiuhuitsai
              </Text>
            </Box>
            <Box
              backgroundColor="secondary"
              borderRadius="10px"
              padding="14px 24px"
              textAlign="center"
            >
              <Text color="quaternary" fontSize="14px" fontWeight="bold" margin="0 0 6px">
                Blog
              </Text>
              <Text color="quinary" fontSize="15px" margin={0} fontFamily="monospace">
                yuritsaitw.github.io/blog
              </Text>
            </Box>
          </FlexBox>

          <Text color="quinary" fontSize="18px" opacity={0.5} margin="40px 0 0" textAlign="center">
            蔡秀慧 · Yuri Tsai · 2026
          </Text>
        </FlexBox>
        <Notes>結語：開放 Q&A，記得更新 GitHub / email</Notes>
      </Slide>

    </Deck>
  );
}

export default App;
