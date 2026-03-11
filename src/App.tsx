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
  UnorderedList,
  ListItem,
} from "spectacle";

import alphacastLogo from "./assets/alphacast-logo.png";
import keycloakPkceFlow from "./assets/keycloak-pkce-flow.png";
import authInit from "./assets/auth-init.png";
import authState from "./assets/auth-state.png";
import vsProducts from "./assets/vs-products.png";

// ─── Theme ───────────────────────────────────────────────────────────────────

const theme = {
  colors: {
    primary: "#f4ede6",
    secondary: "#ece3d8",
    tertiary: "#d5c9bc",
    quaternary: "#9e6e62",
    quinary: "#2a2018",
  },
  fonts: {
    header: '"Inter", sans-serif',
    text: '"Inter", sans-serif',
    monospace: '"Fira Code", monospace',
  },
};

// ─── Bottom template ──────────────────────────────────────────────────────────

const template = () => (
  <FlexBox
    justifyContent="space-between"
    position="absolute"
    bottom={0}
    width={1}
    padding="0 16px 8px"
  >
    <Box>
      <FullScreen color="#9e6e62" />
    </Box>
    <Box>
      <Progress color="#9e6e62" />
    </Box>
  </FlexBox>
);

// ─── Shared helpers ───────────────────────────────────────────────────────────

// chip: use flexShrink so it doesn't stretch in FlexBox
const chip = (label: string) => (
  <Box
    backgroundColor="tertiary"
    padding="3px 9px"
    borderRadius="4px"
    style={{ display: "inline-block", flexShrink: 0 }}
  >
    <Text fontSize="13px" color="quinary" margin={0}>
      {label}
    </Text>
  </Box>
);

// Custom bullet — avoids Spectacle's ListItem large default spacing
const bullet = (text: React.ReactNode, dim = false) => (
  <FlexBox alignItems="flex-start" marginBottom="3px">
    <Text
      color="quaternary"
      fontSize="12px"
      margin="1px 5px 0 0"
      style={{ flexShrink: 0 }}
    >
      •
    </Text>
    <Text
      color="quinary"
      fontSize="14px"
      margin={0}
      opacity={dim ? 0.8 : 1}
      lineHeight={1.3 as any}
    >
      {text}
    </Text>
  </FlexBox>
);

// ─── Code samples ─────────────────────────────────────────────────────────────

const authConfigCode = `export const CONFIG = Object.freeze<ClientOptions>({
  clientId: CLIENT_ID,
  opIssuer: OPIssuerType.MVB,
  authEnv: AUTH_ENV,
  projectName,
  logInRedirectUri,
  logOutRedirectUri,
  sraRedirectUri,
  debug: AUTH_ENV === AuthEnvKey.Local || AUTH_ENV === AuthEnvKey.Dev,
  scope: 'openid profile email address',
  // ...
});`;

const authInitCode = `import { signIn, useInitiateAuth } from '@mvb-fe/auth';

useInitiateAuth({
  authConfig: CONFIG,
  shouldInitiate: true,
});

const { isSignInRequired } = useAuthState();
const shouldSignIn = isSignInRequired && !userErrors;

useEffect(() => {
  if (shouldSignIn) {
    signIn(...);
  }
}, [shouldSignIn]);`;

const authAxiosCode = `import { AuthAxios } from '@mvb-fe/auth';

const authAxiosInst = new AuthAxios({
  baseURL: GQL_BASE_URL,
});

const response = await authAxiosInst.post(
  url,
  options?.body ? JSON.parse(options.body as string) : undefined
);`;

const authCallbackCode = `'use client';

import { fetchTokenInfoSafely, getTokenBySRA, saveTokenInfo } from '@mvb-fe/auth';

export default function AuthCallback() {
  useEffect(() => {
    const fetchToken = async () => {
      const { tokenInfo, error } = await fetchTokenInfoSafely({ params });

      if (tokenInfo && !error) {
        await saveTokenInfo(tokenInfo);
      } else if (error?.reason === AuthErrorReason.InvalidState) {
        const { tokenInfo: sraToken, error: sraError } = await getTokenBySRA();

        if (sraToken && !sraError) {
          await saveTokenInfo(sraToken);
        } else {
          handleAuthError(error, tokenInfo);
        }
      } else {
        handleAuthError(error, tokenInfo);
      }
    };
    fetchToken();
  }, []);
}`;

const credentialFetchCode = `import { credentialFetch } from '@mvb-fe/auth';

await credentialFetch({
  baseURL,
  endpoint,
  config: {
    headers: {
      Accept: 'text/event-stream',
    },
  },
})`;

// ─── 1-2 Auth Library 實作考量 — code snippets ───────────────────────────────

const serverAxiosCode = `import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { axiosBaseConfig } from '../../../constants/request';
import { hasGQLError, transformGQLError } from './graphqlError';

const createServerAxios = (config: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    ...axiosBaseConfig,
    ...config,
  });

  axiosInstance.interceptors.response.use(
    response => { ... },
    async (error: AxiosError) => { ... }
  );

  return axiosInstance;
};

export default createServerAxios;`;

const viteLibCode = `// vite.config.ts
export default ({ mode }: UserConfig) => {
  return defineConfig({
    // ...
    build: {
      lib: {
        entry: {
          index: './src/index.ts',
          server: './src/server.ts',
        },
        formats: ['es', 'cjs'],
      },
    }
  });
}`;

const userStoreCode = `export const DefaultUserState = Object.freeze<UserStoreState>({
  status: UserStatus.Unknown,
  // ...
});

const userStore = {
  _state: DefaultUserState as UserStoreState,

  setState(updater: UserUpdater) {
    const newState =
      typeof updater === 'function' ? updater(userStore._state) : updater;
    const { _state: currentState } = userStore;
    // ...
  },

  subscribe: (listener: () => void) => {
    userStore.listeners.add(listener);
    return () => {
      userStore.listeners.delete(listener);
    };
  },

  getSnapshot() {
    return userStore._state;
  },
}`;

const updateTokenCode = `export default async function updateToken() {
  // ...
  if (!!tokenInfo && !error) {
    const currStatus = userStore.getSnapshot().status;
    await saveTokenInfo(tokenInfo, currStatus);
  } else {
    userStore.setState({
      status: UserStatus.Guest,
    });
    await clearTokenInfo();
  }

  return result;
}`;

const useUserStoreCode = `export default function useUserStore(): UseUserStore {
  const getServerSnapshot = useCallback(() => DefaultUserState, []);

  const user = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    getServerSnapshot
  );

  return {
    user,
    setUser: userStore.setState,
  };
}`;

const storageChangeCode = `const { setUser, user } = useUserStore();

const handleStorageChange = useCallback(
  (event: StorageEvent) => {
    if (event.key === getStorageKey(ProjectInfoKey.IsAuthorized)) {
      if (event.newValue === 'false') {
        setUser({ status: UserStatus.Guest });
      }
    }
  },
  [setUser]
);`;

const singletonCode = `private static _instance: Config | null = null;
private constructor() {}           // prevent external new

static getInstance() {
  if (Config._instance === null) {
    Config._instance = new Config();
  }
  return Config._instance;
}`;

const initOnceCode = `private _isInitDone = false;

static init(options: ClientOptions): void {
  const theInstance = Config.getInstance();
  if (theInstance._isInitDone) return;   // early return
  theInstance.setupClientOptions(options);
  theInstance._isInitDone = true;
}`;

const staticFacadeCode = `// caller side — no need to hold an instance
Config.getClientOption('debug');
Config.getClientOptions(['authEnv', 'opIssuer']);
Config.oidcDiscovery = data;
Config.isInitDone;`;

const typedPartialCode = `static getClientOptions<K extends keyof ClientOptions>(
  targets?: readonly K[]
): Pick<ClientOptions, K>

// usage
const { authEnv, opIssuer } = Config.getClientOptions([
  'authEnv',
  'opIssuer',
]);`;

const inMemoryCacheCode = `static set oidcDiscovery(value: Discovery | undefined) {
  Config.getInstance()._discovery = value;
}

static get oidcDiscovery(): Discovery | undefined {
  return Config.getInstance()._discovery;
}`;

const lazyMemoCode = `static async getIsIDBEnabled(): Promise<boolean> {
  const theInstance = Config.getInstance();
  if (theInstance._internal?._isIDBEnabled === undefined) {
    theInstance._internal = Object.assign({}, theInstance._internal, {
      _isIDBEnabled: await isIndexedDBEnabled(),
    });
  }
  return theInstance._internal._isIDBEnabled;
}`;

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
    style={{ overflowY: "hidden", boxSizing: "border-box" }}
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
        <FlexBox
          height="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading
            color="quinary"
            fontSize="56px"
            textAlign="center"
            margin="0 0 8px"
          >
            Sr.Frontend Engineer Home Quiz
          </Heading>
          <Box
            height="3px"
            width="60px"
            backgroundColor="quaternary"
            borderRadius="2px"
            margin="0 0 18px"
          />
          <Text
            color="quinary"
            fontSize="24px"
            textAlign="center"
            margin="0 0 6px"
          >
            ShepherdTech 牧羊人集團 | 軟體開發部
          </Text>
          <Text color="quinary" fontSize="16px" opacity={0.6} margin="0 0 36px">
            2026/3/13
          </Text>
          <Text color="quinary" fontSize="18px" fontWeight="bold">
            蔡秀慧 · Yuri Tsai
          </Text>
        </FlexBox>
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 1: 困難的系統架構
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 1-0. Section Cover ───────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox
          height="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            color="quaternary"
            fontSize="14px"
            fontWeight="bold"
            letterSpacing="0.2em"
            margin="0 0 16px"
            style={{ textTransform: "uppercase" }}
          >
            Topic 01
          </Text>
          <Box
            height="3px"
            width="48px"
            backgroundColor="quaternary"
            borderRadius="2px"
            margin="0 0 24px"
          />
          <Heading
            color="quinary"
            fontSize="48px"
            textAlign="center"
            margin="0 0 12px"
          >
            困難的系統架構
          </Heading>
          <Text
            color="quinary"
            fontSize="22px"
            textAlign="center"
            opacity={0.7}
            margin={0}
          >
            用 Nx 打造跨產品的前端共用庫
          </Text>
        </FlexBox>
      </Slide>

      {/* ── 1-1-1. OAuth 2.0 Flow ────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              OAuth 2.0 Flow
            </Heading>
            <Text
              color="quaternary"
              textAlign={"center"}
              fontSize="20px"
              fontWeight="bold"
              margin="0 0 10px"
            >
              OIDC (OpenID Connect) with PKCE (Proof Key for Code Exchange)
            </Text>
            <FlexBox
              justifyContent="center"
              alignItems="center"
              style={{ height: "calc(100% - 80px)" }}
            >
              <img
                src={keycloakPkceFlow}
                alt="Keycloak PKCE Flow"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </FlexBox>
          </>,
        )}
      </Slide>

      {/* ── 1-1-2. 從零開始 I ────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              從零開始的專案要面對的 I
            </Heading>
            <Text
              color="quaternary"
              textAlign={"center"}
              fontSize="20px"
              fontWeight="bold"
              margin="0 0 10px"
            >
              Auth Initialization
            </Text>
            <FlexBox
              justifyContent="center"
              alignItems="center"
              style={{ height: "calc(100% - 80px)" }}
            >
              <img
                src={authInit}
                alt="Auth Initialization"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </FlexBox>
          </>,
        )}
      </Slide>

      {/* ── 1-1-3. 從零開始 II ───────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              從零開始的專案要面對的 II
            </Heading>
            <Text
              color="quaternary"
              textAlign={"center"}
              fontSize="20px"
              fontWeight="bold"
              margin="0 0 10px"
            >
              Auth State in Next.js / React Lifecycle
            </Text>
            <FlexBox
              justifyContent="center"
              alignItems="center"
              style={{ height: "calc(100% - 80px)" }}
            >
              <img
                src={authState}
                alt="Auth State"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </FlexBox>
          </>,
        )}
      </Slide>

      {/* ── 1-1-4. 從零開始 III ──────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 12px">
              從零開始的專案要面對的 III
            </Heading>
            <Text
              color="quaternary"
              textAlign={"center"}
              fontSize="20px"
              fontWeight="bold"
              margin="0 0 10px"
            >
              API Request
            </Text>

            <Box
              backgroundColor="secondary"
              borderRadius="8px"
              padding="16px 240px"
              borderLeft="4px solid quaternary"
              display="flex"
              style={{
                flexDirection: "column",
                alignItem: "flex-start",
                gap: 20,
              }}
            >
              {[
                {
                  label: "Append Access Token",
                  desc: "每個請求的 Authorization Header 附上 Bearer Token",
                },
                {
                  label: "Auto Token Refresh",
                  desc: "收到 401 後自動刷新 Token 並重試原始請求",
                },
                {
                  label: "RESTful / GraphQL",
                  desc: "同時支援 REST API 與 GraphQL 請求封裝",
                },
              ].map((item) => (
                <FlexBox
                  key={item.label}
                  marginBottom="10px"
                  gap="20px"
                  alignItem="flex-start"
                  style={{ justifyContent: "flex-start" }}
                >
                  <Box
                    backgroundColor="quaternary"
                    borderRadius="3px"
                    padding="2px 8px"
                    style={{ flexShrink: 0 }}
                    width="260px"
                  >
                    <Text
                      color="primary"
                      fontSize="16px"
                      fontWeight="bold"
                      margin={0}
                    >
                      {item.label}
                    </Text>
                  </Box>
                  <Text
                    color="quinary"
                    fontSize="16px"
                    margin={0}
                    lineHeight={1.5 as any}
                  >
                    {item.desc}
                  </Text>
                </FlexBox>
              ))}
            </Box>
          </>,
        )}
      </Slide>

      {/* ── 1-1-5. ViewSonic 產品線 ──────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              ViewSonic 教育及商務軟體系列產品
            </Heading>
            <Text
              color="quaternary"
              textAlign={"center"}
              fontSize="20px"
              fontWeight="bold"
              margin="0 0 10px"
            >
              每個產品都需要串接同一套 Auth 流程 — 這就是共用庫的起點
            </Text>
            <FlexBox
              justifyContent="center"
              alignItems="center"
              style={{ height: "calc(100% - 80px)" }}
            >
              <img
                src={vsProducts}
                alt="ViewSonic Products"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </FlexBox>
          </>,
        )}
      </Slide>

      {/* ── 1-1-6. @mvb-fe/auth — Create Config + Initialization ────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Heading color="quinary" fontSize="28px" margin="0 0 4px">
              共用庫的第一個套件
            </Heading>
            <Text
              color="quaternary"
              fontSize="24px"
              textAlign={"center"}
              fontWeight="bold"
              margin="0 0 8px"
              fontFamily="monospace"
            >
              pnpm install @mvb-fe/auth
            </Text>
            <Grid
              gridTemplateColumns="1fr 1fr"
              gridGap="12px"
              style={{ flex: 1, overflow: "hidden", alignItems: "stretch" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="16px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  1. Create Config
                </Text>
                <div
                  style={{
                    zoom: 0.78,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {authConfigCode}
                  </CodePane>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="16px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  2. Initialization
                </Text>
                <div
                  style={{
                    zoom: 0.78,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {authInitCode}
                  </CodePane>
                </div>
              </div>
            </Grid>
          </div>,
        )}
      </Slide>

      {/* ── 1-1-7. @mvb-fe/auth — Callback Page ─────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Heading
              color="quaternary"
              fontSize="16px"
              fontWeight="bold"
              margin="0 0 8px"
            >
              3. Callback Page
            </Heading>
            <div
              style={{
                zoom: 0.8,
                flex: 1,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <CodePane language="typescript" showLineNumbers={false}>
                {authCallbackCode}
              </CodePane>
            </div>
          </div>,
        )}
      </Slide>

      {/* ── 1-1-8. @mvb-fe/auth — API Request ───────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Heading
              color="quaternary"
              fontSize="16px"
              fontWeight="bold"
              margin="0 0 8px"
            >
              4. API Request
            </Heading>
            <Grid
              gridTemplateColumns="1fr 1fr"
              gridGap="12px"
              style={{ flex: 1, overflow: "hidden", alignItems: "stretch" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="14px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  4-1. AuthAxios
                </Text>
                <div
                  style={{
                    zoom: 0.78,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {authAxiosCode}
                  </CodePane>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="14px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  4-2. credentialFetch
                </Text>
                <div
                  style={{
                    zoom: 0.78,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {credentialFetchCode}
                  </CodePane>
                </div>
              </div>
            </Grid>
          </div>,
        )}
      </Slide>

      {/* ── 1-2. Auth Library 實作考量───────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="36px" margin="0 0 8px">
              Auth Library 實作考量
            </Heading>
            <UnorderedList fontSize="20px" color="quinary" margin="0">
              <ListItem>Server Side in Next.js</ListItem>
              <ListItem>跨元件狀態管理（useSyncExternalStore）</ListItem>
              <ListItem>Config class 設計模式</ListItem>
            </UnorderedList>
          </>,
        )}
      </Slide>

      {/* ── 1-2-1. Server Side in NextJS ─────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Heading color="quinary" fontSize="28px" margin="0 0 4px">
              Server Side in Next.js
            </Heading>
            <Grid
              gridTemplateColumns="1fr 1fr"
              gridGap="12px"
              style={{ flex: 1, overflow: "hidden", alignItems: "stretch" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="16px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  API Request in SSR
                </Text>
                <div
                  style={{
                    zoom: 0.75,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {serverAxiosCode}
                  </CodePane>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="16px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  React Server / Client Components
                </Text>
                <div
                  style={{
                    zoom: 0.75,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {viteLibCode}
                  </CodePane>
                </div>
              </div>
            </Grid>
          </div>,
        )}
      </Slide>

      {/* ── 1-2-2. 跨元件狀態管理 I ─────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Heading color="quinary" fontSize="28px" margin="0 0 2px">
              跨元件狀態管理 I
            </Heading>
            <Text
              color="quaternary"
              fontSize="20px"
              fontWeight="bold"
              textAlign="center"
              margin="0 0 8px"
              fontFamily="monospace"
            >
              建立符合 useSyncExternalStore 的 store 物件
            </Text>
            <Grid
              gridTemplateColumns="1fr 1fr"
              gridGap="12px"
              style={{ flex: 1, overflow: "hidden", alignItems: "stretch" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="16px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  userStore
                </Text>
                <div
                  style={{
                    zoom: 0.75,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {userStoreCode}
                  </CodePane>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="16px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  Pure Function 也能更新 store
                </Text>
                <div
                  style={{
                    zoom: 0.75,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {updateTokenCode}
                  </CodePane>
                </div>
              </div>
            </Grid>
          </div>,
        )}
      </Slide>

      {/* ── 1-2-3. 跨元件狀態管理 II ────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Heading color="quinary" fontSize="28px" margin="0 0 2px">
              跨元件狀態管理 II
            </Heading>
            <Text
              color="quaternary"
              fontSize="20px"
              fontWeight="bold"
              textAlign="center"
              margin="0 0 8px"
              fontFamily="monospace"
            >
              透過 useSyncExternalStore 建立 hook
            </Text>
            <Grid
              gridTemplateColumns="1fr 1fr"
              gridGap="12px"
              style={{ flex: 1, overflow: "hidden", alignItems: "stretch" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="16px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  useUserStore
                </Text>
                <div
                  style={{
                    zoom: 0.78,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {useUserStoreCode}
                  </CodePane>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Text
                  color="quaternary"
                  fontSize="16px"
                  fontWeight="bold"
                  margin="0 0 4px"
                >
                  跨 Tab 同步（StorageEvent）
                </Text>
                <div
                  style={{
                    zoom: 0.78,
                    flex: 1,
                    background: "#1e1e1e",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript" showLineNumbers={false}>
                    {storageChangeCode}
                  </CodePane>
                </div>
              </div>
            </Grid>
          </div>,
        )}
      </Slide>

      {/* ── 1-2-4. Config class I — Singleton ───────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              Config Class I — Singleton
            </Heading>
            <Text
              color="quaternary"
              fontSize="20px"
              fontWeight="bold"
              textAlign="center"
              margin="0 0 12px"
            >
              React 的 re-render 或多個元件都可能讀取 Config， Singleton
              確保它們拿到的是同一份狀態
            </Text>
            <div
              style={{
                zoom: 0.88,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <CodePane language="typescript" showLineNumbers={false}>
                {singletonCode}
              </CodePane>
            </div>
          </>,
        )}
      </Slide>

      {/* ── 1-2-5. Config class II — Init-Once Guard ────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              Config Class II — Init-Once Guard
            </Heading>
            <Text
              color="quaternary"
              fontSize="20px"
              fontWeight="bold"
              textAlign="center"
              margin="0 0 12px"
            >
              犧牲「動態切換設定」的能力，換取「在任何地方安全呼叫
              init」的簡單性。 消費端不需要額外防護，也不需要用 useRef
              跟蹤是否已初始化
            </Text>
            <div
              style={{
                zoom: 0.88,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <CodePane language="typescript" showLineNumbers={false}>
                {initOnceCode}
              </CodePane>
            </div>
          </>,
        )}
      </Slide>

      {/* ── 1-2-6. Config class III — Static Facade over Instance ───────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              Config Class III — Static Facade
            </Heading>
            <Text
              color="quaternary"
              fontSize="20px"
              fontWeight="bold"
              textAlign="center"
              margin="0 0 12px"
            >
              Caller 不需要 <code>Config.getInstance()</code>
              ，也不需要傳遞實例到各模組。 整個 app 只有一套 auth
              設定，這個取捨完全合理
            </Text>
            <div
              style={{
                zoom: 0.88,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <CodePane language="typescript" showLineNumbers={false}>
                {staticFacadeCode}
              </CodePane>
            </div>
          </>,
        )}
      </Slide>

      {/* ── 1-2-7. Config class IV — Typed Partial Access ───────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              Config Class IV — Typed Partial Access
            </Heading>
            <UnorderedList fontSize="18px" color="quinary" margin="0 0 12px">
              <ListItem>
                可讀性：知道這個函式依賴哪些設定，不需要讀整份 ClientOptions
                interface
              </ListItem>
              <ListItem>
                最小知識原則：各 helper 只拿它需要的設定，不意外存取不相關的欄位
              </ListItem>
            </UnorderedList>
            <div
              style={{
                zoom: 0.88,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <CodePane language="typescript" showLineNumbers={false}>
                {typedPartialCode}
              </CodePane>
            </div>
          </>,
        )}
      </Slide>

      {/* ── 1-2-8. Config class V — In-Memory Cache as Shared State ─────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              Config Class V — In-Memory Cache
            </Heading>
            <Text
              color="quaternary"
              fontSize="20px"
              fontWeight="bold"
              textAlign="center"
              margin="0 0 12px"
            >
              _discovery 掛在 Config singleton 上，成為跨模組的 L1
              記憶體快取，而非獨立的模組層級變數
            </Text>
            <div
              style={{
                zoom: 0.88,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <CodePane language="typescript" showLineNumbers={false}>
                {inMemoryCacheCode}
              </CodePane>
            </div>
            <Text
              color="quaternary"
              fontSize="14px"
              margin="8px 0 0"
              textAlign="right"
            >
              <a
                href={`${import.meta.env.BASE_URL}discovery-flow.html`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#9e6e62", textDecoration: "none" }}
              >
                Discovery Flow 詳解 ↗
              </a>
            </Text>
          </>,
        )}
      </Slide>

      {/* ── 1-2-9. Config class VI — Lazy Computation with Memoization ───── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 4px">
              Config Class VI — Lazy Memoization
            </Heading>
            <Text
              color="quaternary"
              fontSize="20px"
              fontWeight="bold"
              textAlign="center"
              margin="0 0 12px"
            >
              檢測 IndexedDB 是否可用是非同步操作。
              <br />
              第一次呼叫才真正檢測，結果寫回 _internal 快取，
              後續呼叫直接回傳快取值，避免重複的 async I/O
            </Text>
            <div
              style={{
                zoom: 0.88,
                background: "#1e1e1e",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <CodePane language="typescript" showLineNumbers={false}>
                {lazyMemoCode}
              </CodePane>
            </div>
          </>,
        )}
      </Slide>

      {/* ── 1-4. 其他參考資料 ────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="36px" margin="0 0 24px">
              其他
            </Heading>
            <FlexBox flexDirection="column" alignItems="flex-start" style={{gap: 18}}>
              <Box height="48px" width="fit-content">
                <a
                  href={`${import.meta.env.BASE_URL}tech-stack.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#9e6e62",
                    fontSize: "18px",
                    textDecoration: "none",
                    border: "1px solid #9e6e62",
                    padding: "8px 18px",
                    borderRadius: "4px",
                  }}
                >
                  🗂 Nx Monorepo 技術堆疊總覽 ↗
                </a>
              </Box>
              <Box height="48px" width="fit-content">
                <a
                  href={`${import.meta.env.BASE_URL}cicd-workflow.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#9e6e62",
                    fontSize: "18px",
                    textDecoration: "none",
                    border: "1px solid #9e6e62",
                    padding: "8px 18px",
                    borderRadius: "4px",
                  }}
                >
                  📊 CI/CD Workflow 流程（PR · Release · Pre-release ·
                  Security Scan）↗
                </a>
              </Box>
            </FlexBox>
          </>,
        )}
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 2
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 2-0. Section Cover ───────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox
          height="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            color="quaternary"
            fontSize="14px"
            fontWeight="bold"
            letterSpacing="0.2em"
            margin="0 0 16px"
            style={{ textTransform: "uppercase" }}
          >
            Topic 02
          </Text>
          <Box
            height="3px"
            width="48px"
            backgroundColor="quaternary"
            borderRadius="2px"
            margin="0 0 24px"
          />
          <Heading
            color="quinary"
            fontSize="48px"
            textAlign="center"
            margin="0 0 12px"
          >
            網站效能評估
          </Heading>
          <Text
            color="quinary"
            fontSize="22px"
            textAlign="center"
            opacity={0.7}
            margin={0}
          >
            dogcatstar.com 診斷與改善方案
          </Text>
        </FlexBox>
      </Slide>

      {/* ── 2-1. Current Status ──────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">
              dogcatstar.com 效能評估
            </Heading>
            <Grid gridTemplateColumns="1fr 1fr" gridGap="16px">
              <Box>
                <Text
                  color="quaternary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin="0 0 5px"
                >
                  技術棧觀察
                </Text>
                <Box
                  backgroundColor="secondary"
                  borderRadius="6px"
                  padding="10px"
                  marginBottom="10px"
                >
                  <FlexBox flexWrap="wrap" gap="5px" alignItems="flex-start">
                    {["WordPress", "WooCommerce", "jQuery", "PHP"].map(chip)}
                  </FlexBox>
                </Box>
                <Text
                  color="quaternary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin="0 0 5px"
                >
                  Core Web Vitals（Mobile）
                </Text>
                <Box
                  backgroundColor="secondary"
                  borderRadius="6px"
                  padding="10px"
                >
                  {[
                    {
                      metric: "LCP",
                      value: "~ 8.2s",
                      status: "🔴 Poor",
                      color: "#9e6e62",
                    },
                    {
                      metric: "CLS",
                      value: "~ 0.28",
                      status: "🔴 Poor",
                      color: "#9e6e62",
                    },
                    {
                      metric: "INP",
                      value: "~ 380ms",
                      status: "🟡 Needs Improvement",
                      color: "#b09050",
                    },
                  ].map((item) => (
                    <FlexBox
                      key={item.metric}
                      justifyContent="space-between"
                      alignItems="center"
                      marginBottom="5px"
                    >
                      <Text
                        color="quinary"
                        fontSize="13px"
                        margin={0}
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {item.metric}
                      </Text>
                      <Text color="quinary" fontSize="13px" margin={0}>
                        {item.value}
                      </Text>
                      <Text
                        fontSize="12px"
                        margin={0}
                        style={{ color: item.color }}
                      >
                        {item.status}
                      </Text>
                    </FlexBox>
                  ))}
                </Box>
              </Box>
              <Box>
                <Text
                  color="quaternary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin="0 0 5px"
                >
                  PageSpeed Insights
                </Text>
                <Box
                  backgroundColor="secondary"
                  borderRadius="6px"
                  padding="12px"
                  marginBottom="10px"
                  style={{
                    minHeight: "140px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    color="quinary"
                    fontSize="13px"
                    textAlign="center"
                    opacity={0.5}
                  >
                    📸 請貼入 PageSpeed Insights 截圖
                    <br />
                    （Mobile / Desktop 分數）
                  </Text>
                </Box>
                <Box
                  backgroundColor="tertiary"
                  borderRadius="6px"
                  padding="8px 12px"
                >
                  <Text
                    color="quinary"
                    fontSize="12px"
                    margin={0}
                    textAlign="center"
                    opacity={0.8}
                  >
                    💡 分析時間：2026-03
                  </Text>
                </Box>
              </Box>
            </Grid>
          </>,
        )}
        <Notes>面試前更新實際數值並替換截圖</Notes>
      </Slide>

      {/* ── 2-2. Problem Diagnosis ───────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">
              問題診斷 Top 5
            </Heading>
            <Grid gridTemplateColumns="1fr 1fr" gridGap="7px">
              {[
                {
                  no: "01",
                  title: "LCP 偏慢",
                  desc: "大量商品圖 + banner 未優化，WordPress TTFB 高（共用主機）",
                  color: "#9e6e62",
                },
                {
                  no: "02",
                  title: "第三方腳本過多",
                  desc: "GA4、FB Pixel、LINE Tag、客服 widget → render-blocking",
                  color: "#9e6e62",
                },
                {
                  no: "03",
                  title: "Unused CSS / JS",
                  desc: "多外掛 + 多站點樣式全部載入，Coverage < 30%",
                  color: "#b09050",
                },
                {
                  no: "04",
                  title: "DOM 節點過多",
                  desc: "WooCommerce shop 頁節點 > 3000，影響 INP 互動延遲",
                  color: "#b09050",
                },
                {
                  no: "05",
                  title: "CLS 不穩定",
                  desc: "動態促銷 banner、庫存狀態造成版面位移",
                  color: "#b09050",
                },
              ].map((item) => (
                <Appear key={item.no}>
                  <Box
                    backgroundColor="secondary"
                    borderRadius="6px"
                    padding="8px 12px"
                    borderLeft={`4px solid ${item.color}`}
                  >
                    <FlexBox alignItems="center" marginBottom="3px" gap="6px">
                      <Text
                        fontSize="15px"
                        fontWeight="bold"
                        margin={0}
                        style={{ color: item.color }}
                        fontFamily="monospace"
                      >
                        {item.no}
                      </Text>
                      <Text
                        color="quinary"
                        fontSize="13px"
                        fontWeight="bold"
                        margin={0}
                      >
                        {item.title}
                      </Text>
                    </FlexBox>
                    <Text
                      color="quinary"
                      fontSize="12px"
                      margin={0}
                      opacity={0.8}
                    >
                      {item.desc}
                    </Text>
                  </Box>
                </Appear>
              ))}
            </Grid>
          </>,
        )}
        <Notes>五大問題</Notes>
      </Slide>

      {/* ── 2-3. Improvement Plan ────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">
              改善方案
            </Heading>
            <Grid gridTemplateColumns="1.2fr 1.8fr 1.8fr" gridGap="2px">
              <Box
                backgroundColor="quaternary"
                padding="7px 10px"
                borderRadius="5px 0 0 0"
              >
                <Text
                  color="primary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin={0}
                >
                  問題
                </Text>
              </Box>
              <Box backgroundColor="quaternary" padding="7px 10px">
                <Text
                  color="primary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin={0}
                >
                  短期（WordPress 內）
                </Text>
              </Box>
              <Box
                backgroundColor="quaternary"
                padding="7px 10px"
                borderRadius="0 5px 0 0"
              >
                <Text
                  color="primary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin={0}
                >
                  長期（Next.js 重構）
                </Text>
              </Box>
              {[
                {
                  issue: "LCP",
                  short: "fetchpriority + WebP 轉換",
                  long: "<Image> 元件 + ISR 快取",
                },
                {
                  issue: "第三方腳本",
                  short: "async / defer 載入",
                  long: "next/script lazyOnload",
                },
                {
                  issue: "Unused CSS",
                  short: "PurgeCSS 整合",
                  long: "StyleX zero-runtime atomic CSS",
                },
                {
                  issue: "DOM 過大",
                  short: "清除廢棄外掛",
                  long: "React 虛擬化列表",
                },
                {
                  issue: "CLS",
                  short: "預留 banner 最小高度",
                  long: "Server Component 預載佈局",
                },
              ].map((row, i) => (
                <>
                  <Box
                    key={`i-${i}`}
                    backgroundColor={i % 2 === 0 ? "secondary" : "tertiary"}
                    padding="8px 10px"
                  >
                    <Text
                      color="quaternary"
                      fontSize="12px"
                      fontWeight="bold"
                      margin={0}
                      fontFamily="monospace"
                    >
                      {row.issue}
                    </Text>
                  </Box>
                  <Box
                    key={`s-${i}`}
                    backgroundColor={i % 2 === 0 ? "secondary" : "tertiary"}
                    padding="8px 10px"
                  >
                    <Text color="quinary" fontSize="12px" margin={0}>
                      {row.short}
                    </Text>
                  </Box>
                  <Box
                    key={`l-${i}`}
                    backgroundColor={i % 2 === 0 ? "secondary" : "tertiary"}
                    padding="8px 10px"
                  >
                    <Text color="quinary" fontSize="12px" margin={0}>
                      {row.long}
                    </Text>
                  </Box>
                </>
              ))}
            </Grid>
          </>,
        )}

        <Notes>短期 vs 長期改善策略</Notes>
      </Slide>

      {/* ── 2-4. Architecture Vision ─────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">
              架構願景
            </Heading>
            <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap="10px">
              {[
                {
                  icon: "⚛️",
                  title: "Next.js App Router",
                  color: "#5a7ea8",
                  items: [
                    "Server Components（零 JS bundle）",
                    "Streaming SSR",
                    "React Server Actions",
                  ],
                },
                {
                  icon: "🌍",
                  title: "CDN & Edge",
                  color: "#6a9478",
                  items: [
                    "CloudFront / Vercel Edge",
                    "全球多站點加速",
                    "Image Optimization at Edge",
                  ],
                },
                {
                  icon: "📦",
                  title: "Headless Stack",
                  color: "#9e6e62",
                  items: [
                    "Headless CMS（Sanity / Contentful）",
                    "StyleX zero-runtime CSS",
                    "WooCommerce REST API",
                  ],
                },
              ].map((card) => (
                <Appear key={card.title}>
                  <Box
                    backgroundColor="secondary"
                    borderRadius="8px"
                    padding="12px 14px"
                    borderTop={`4px solid ${card.color}`}
                  >
                    <Text fontSize="20px" margin="0 0 4px">
                      {card.icon}
                    </Text>
                    <Text
                      color="quinary"
                      fontSize="13px"
                      fontWeight="bold"
                      margin="0 0 6px"
                    >
                      {card.title}
                    </Text>
                    {card.items.map((item) => bullet(item, true))}
                  </Box>
                </Appear>
              ))}
            </Grid>
            <Appear>
              <Box
                backgroundColor="secondary"
                borderRadius="6px"
                padding="8px 16px"
                marginTop="8px"
                borderLeft="4px solid #e94560"
              >
                <Text
                  color="quinary"
                  fontSize="13px"
                  margin={0}
                  textAlign="center"
                >
                  🎯 目標：LCP &lt; 2.5s · CLS &lt; 0.1 · INP &lt; 200ms（Core
                  Web Vitals 全綠）
                </Text>
              </Box>
            </Appear>
          </>,
        )}

        <Notes>理想架構方向</Notes>
      </Slide>

      {/* ══════════════════════════════════════════════════════════════════════
          TOPIC 3
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── 3-0. Section Cover ───────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox
          height="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            color="quaternary"
            fontSize="14px"
            fontWeight="bold"
            letterSpacing="0.2em"
            margin="0 0 16px"
            style={{ textTransform: "uppercase" }}
          >
            Topic 03
          </Text>
          <Box
            height="3px"
            width="48px"
            backgroundColor="quaternary"
            borderRadius="2px"
            margin="0 0 24px"
          />
          <Heading
            color="quinary"
            fontSize="48px"
            textAlign="center"
            margin="0 0 12px"
          >
            過往項目分享
          </Heading>
          <img
            src={alphacastLogo}
            alt="alphacast logo"
            style={{
              maxHeight: "80px",
              marginTop: "8px",
              objectFit: "contain",
            }}
          />
        </FlexBox>
      </Slide>

      {/* ── 3-1. Project Introduction ───────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">
              alphacast-frontend
            </Heading>
            <Grid gridTemplateColumns="1fr 1fr" gridGap="16px">
              <Box>
                <Text
                  color="quaternary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin="0 0 5px"
                >
                  專案背景
                </Text>
                <Box
                  backgroundColor="secondary"
                  borderRadius="6px"
                  padding="10px"
                  marginBottom="10px"
                >
                  <Text color="quinary" fontSize="13px" margin="0 0 4px">
                    程式助教設計的練習用專案（公開 repo）
                  </Text>
                  <Text
                    color="quinary"
                    fontSize="12px"
                    opacity={0.8}
                    margin={0}
                  >
                    模擬真實產品開發流程：UI 實作、API 整合、測試策略一次到位
                  </Text>
                </Box>
                <Text
                  color="quaternary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin="0 0 5px"
                >
                  技術選型
                </Text>
                <Box
                  backgroundColor="secondary"
                  borderRadius="6px"
                  padding="10px"
                >
                  <FlexBox flexWrap="wrap" gap="5px" alignItems="flex-start">
                    {[
                      "React 18",
                      "TypeScript",
                      "Vite",
                      "React Query",
                      "MSW",
                      "Storybook",
                    ].map(chip)}
                  </FlexBox>
                </Box>
              </Box>
              <Box>
                <Text
                  color="quaternary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin="0 0 5px"
                >
                  選型理由
                </Text>
                {[
                  {
                    title: "React Query",
                    desc: "伺服器狀態 vs UI 狀態分離，快取/重試/loading 開箱即用",
                    color: "#9e6e62",
                  },
                  {
                    title: "MSW",
                    desc: "Service Worker 層攔截，前後端可完全並行開發，同一 handler 用於測試",
                    color: "#b09050",
                  },
                  {
                    title: "Storybook",
                    desc: "元件隔離開發，視覺 regression 測試，設計師可直接驗收",
                    color: "#6a9478",
                  },
                ].map((item) => (
                  <Appear key={item.title}>
                    <Box
                      backgroundColor="secondary"
                      borderRadius="6px"
                      padding="8px 12px"
                      marginBottom="6px"
                      borderLeft={`3px solid ${item.color}`}
                    >
                      <Text
                        color="quinary"
                        fontSize="13px"
                        fontWeight="bold"
                        margin="0 0 2px"
                      >
                        {item.title}
                      </Text>
                      <Text
                        color="quinary"
                        fontSize="12px"
                        margin={0}
                        opacity={0.8}
                      >
                        {item.desc}
                      </Text>
                    </Box>
                  </Appear>
                ))}
              </Box>
            </Grid>
          </>,
        )}
        <Notes>練習專案目標與技術選型</Notes>
      </Slide>

      {/* ── 3-2. Code Style ──────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">
              Code Style 原則
            </Heading>
            <Grid gridTemplateColumns="1fr 1fr" gridGap="10px">
              {[
                {
                  icon: "🔷",
                  title: "TypeScript Strict",
                  color: "#5a7ea8",
                  items: [
                    "strict mode 開啟，no any",
                    "Proper generics 避免重複型別",
                    "Discriminated unions 處理狀態",
                  ],
                },
                {
                  icon: "🪝",
                  title: "Custom Hooks 設計",
                  color: "#9e6e62",
                  items: [
                    "單一職責：一個 hook 做一件事",
                    "邏輯與 UI 完全解耦",
                    "回傳 tuple 或具名物件",
                  ],
                },
                {
                  icon: "🧪",
                  title: "MSW 測試策略",
                  color: "#6a9478",
                  items: [
                    "API 層完全 mock，不依賴後端",
                    "同一 handler 開發 + 單元測試共用",
                    "模擬 loading / error / empty state",
                  ],
                },
                {
                  icon: "🤖",
                  title: "Git Workflow",
                  color: "#b09050",
                  items: [
                    "Husky + lint-staged：commit 前自動 lint",
                    "commitlint：強制 conventional commits",
                    "PR 前 Storybook snapshot diff",
                  ],
                },
              ].map((card) => (
                <Box
                  key={card.title}
                  backgroundColor="secondary"
                  borderRadius="8px"
                  padding="10px 14px"
                  borderLeft={`4px solid ${card.color}`}
                >
                  <Text
                    color="quinary"
                    fontSize="13px"
                    fontWeight="bold"
                    margin="0 0 6px"
                  >
                    {card.icon} {card.title}
                  </Text>
                  {card.items.map((item) => bullet(item, true))}
                </Box>
              ))}
            </Grid>
          </>,
        )}
        <Notes>四大 Code Style 原則</Notes>
      </Slide>

      {/* ── 3-3. Code Highlights ─────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        {slideBox(
          <>
            <Heading color="quinary" fontSize="32px" margin="0 0 2px">
              程式碼亮點
            </Heading>
            <Grid
              gridTemplateColumns="1fr 1fr"
              gridGap="14px"
              style={{ overflow: "hidden" }}
            >
              <Box style={{ overflow: "hidden" }}>
                <Text
                  color="quaternary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin="0 0 5px"
                >
                  Auth Library — useAuth() Hook
                </Text>
                <Box
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.4,
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript">{useAuthCode}</CodePane>
                </Box>
              </Box>
              <Box style={{ overflow: "hidden" }}>
                <Text
                  color="quaternary"
                  fontSize="13px"
                  fontWeight="bold"
                  margin="0 0 5px"
                >
                  alphacast — useEpisodes() + MSW
                </Text>
                <Box
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.4,
                    overflow: "hidden",
                  }}
                >
                  <CodePane language="typescript">{reactQueryCode}</CodePane>
                </Box>
              </Box>
            </Grid>
          </>,
        )}
        <Notes>Auth Library hook + React Query / MSW 整合</Notes>
      </Slide>

      {/* ── Closing ──────────────────────────────────────────────────────── */}
      <Slide backgroundColor="primary">
        <FlexBox
          height="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading
            color="quinary"
            fontSize="48px"
            textAlign="center"
            margin="0 0 8px"
          >
            感謝聆聽
          </Heading>
          <Box
            height="3px"
            width="56px"
            backgroundColor="quaternary"
            borderRadius="2px"
            margin="0 0 22px"
          />
          <Text
            color="quinary"
            fontSize="20px"
            textAlign="center"
            margin="0 0 28px"
          >
            Q &amp; A
          </Text>
          <FlexBox gap="12px" flexWrap="wrap" justifyContent="center">
            {[
              { label: "GitHub", value: "github.com/YuriTsaiTW" },
              { label: "LinkedIn", value: "linkedin.com/in/hsiuhuitsai" },
              { label: "Blog", value: "yuritsaitw.github.io/blog" },
            ].map((item) => (
              <Box
                key={item.label}
                backgroundColor="secondary"
                borderRadius="8px"
                padding="10px 18px"
                textAlign="center"
              >
                <Text
                  color="quaternary"
                  fontSize="12px"
                  fontWeight="bold"
                  margin="0 0 3px"
                >
                  {item.label}
                </Text>
                <Text
                  color="quinary"
                  fontSize="13px"
                  margin={0}
                  fontFamily="monospace"
                >
                  {item.value}
                </Text>
              </Box>
            ))}
          </FlexBox>
          <Text
            color="quinary"
            fontSize="14px"
            opacity={0.5}
            margin="28px 0 0"
            textAlign="center"
          >
            蔡秀慧 · Yuri Tsai · 2026
          </Text>
        </FlexBox>
        <Notes>開放 Q&A</Notes>
      </Slide>
    </Deck>
  );
}

export default App;
