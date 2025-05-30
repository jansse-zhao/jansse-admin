import json5 from 'json5';

/**
 * Create service config by current env
 *
 * @param env The current env
 */
export function createServiceConfig(env: Env.ImportMeta) {
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env;

  let other = {} as Record<App.Service.OtherBaseURLKey, string>;
  try {
    other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
  } catch {
    // eslint-disable-next-line no-console
    console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid json5 string');
  }

  /** baseURL: "https://mock.apifox.cn/m1/3109515-0-default", other: { "demo": "http://localhost:9528" } */

  const httpConfig: App.Service.SimpleServiceConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other
  };

  // otherHttpKeys = ['demo']
  const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[];

  const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map(key => {
    return {
      key,
      baseURL: httpConfig.other[key],
      proxyPattern: createProxyPattern(key)
    };
  });

  // baseURL: "https://mock.apifox.cn/m1/3109515-0-default", proxyPattern:"/proxy-default", other: { "demo": "http://localhost:9528" }
  const config: App.Service.ServiceConfig = {
    baseURL: httpConfig.baseURL,
    proxyPattern: createProxyPattern(),
    other: otherConfig
  };

  /**
   * config = { baseURL: 'https://mock.apifox.cn/m1/3109515-0-default', proxyPattern: '/proxy-default', other: [ { key:
   * 'demo', baseURL: 'http://localhost:9528', proxyPattern: '/proxy-demo' } ] }
   */

  return config;
}

/**
 * get backend service base url
 *
 * @param env - the current env
 * @param isProxy - if use proxy
 */
export function getServiceBaseURL(env: Env.ImportMeta, isProxy: boolean) {
  const { baseURL, other } = createServiceConfig(env);

  const otherBaseURL = {} as Record<App.Service.OtherBaseURLKey, string>;

  other.forEach(item => {
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
  });

  return {
    baseURL: isProxy ? createProxyPattern() : baseURL,
    otherBaseURL
  };
}

/**
 * Get proxy pattern of backend service base url
 *
 * @param key If not set, will use the default key
 */
function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  // key为空时，使用默认的代理前缀
  if (!key) {
    return '/proxy-default';
  }

  return `/proxy-${key}`;
}
