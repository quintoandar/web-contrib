/* globals clients */
// Clients is a SW-specific global

import parseDeepLink from './deep-link-parser';

const handleRedirect = (event, baseUrl, linkMap) => {
  const url = parseDeepLink(event.notification.data.deepLin, baseUrl, linkMap);
  event.waitUntil(clients.openWindow(url));
  event.notification.close();
};

export default handleRedirect;
