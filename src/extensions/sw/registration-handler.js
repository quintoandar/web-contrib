import constants from './constants';

const requestNotificationPermission = (onSucceed) => {
  if ('Notification' in window) {
    return Notification.requestPermission((status) => {
      if (status === 'granted') return subscribeUser(onSucceed);
      return Promise.resolve({ status });
    });
  }
  return Promise.resolve({ status: constants.NOTIFICATION_NOT_IN_WINDOW });
};

const subscribeUser = (onSucceed) =>
  getRegistration().then((registration) =>
    registration.pushManager.subscribe(getSubscriptionOptions()).then((subscription) =>
      onSucceed(formatSubscription(subscription))
    ));

const unsubscribeUser = (onSucceed) =>
  getRegistration().then((registration) =>
    registration.pushManager
      .getSubscription()
      .then((subscription) =>
        subscription.unsubscribe().then(() => onSucceed(formatSubscription(subscription)))));

const getSubscriptionOptions = () => ({
  userVisibleOnly: true,
  applicationServerKey: urlB64ToUint8Array(process.env.VAPID_PUBLIC_KEY || ''),
});

const getRegistration = () => navigator.serviceWorker && navigator.serviceWorker.getRegistration();

const formatSubscription = (subscription) => {
  const jsonSubscription = subscription.toJSON();
  const processed = {};
  processed.endpoint = jsonSubscription.endpoint;
  processed.key = jsonSubscription.keys.p256dh;
  processed.auth = jsonSubscription.keys.auth;
  return processed;
};

const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export { requestNotificationPermission, subscribeUser, unsubscribeUser };
