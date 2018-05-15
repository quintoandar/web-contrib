import URL from 'url-parse';
import parseRoute from './route-parser';

const buildDeepLinkRoute = (deepLinkUrl) => `${deepLinkUrl.host}${deepLinkUrl.pathname}`;

const reverse = (pathname, params) => parseRoute([pathname], params);

const parseDeepLink = (baseUrl, link, realRouteMap) => {
  const deepLinkUrl = new URL(link, true);
  const route = buildDeepLinkRoute(deepLinkUrl);
  const params = deepLinkUrl.query;

  const realRoute = realRouteMap(route);

  if (!realRoute) return baseUrl;
  const url = new URL(baseUrl + realRoute, true);
  return url.origin + reverse(url.pathname, params);
};

export default parseDeepLink;
