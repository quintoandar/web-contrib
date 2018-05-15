import constants from './constants';

const handleEvent = (event) => {
  const data = getDataIfValid(event);
  if (data) {
    showNotification(data);
  }
};

const getDataIfValid = (event) => {
  const data = event.data.json().data;
  if (!data || !data.title || !data.message || !data.ref) {
    return undefined;
  }
  return data;
};

const showNotification = (data) => {
  const options = buildNotificationOptions(data);
  self.registration.showNotification(data.title, options);
};

const buildNotificationOptions = (data) => ({
  body: data.message,
  icon: constants.notificationIcon,
  vibrate: [100, 50, 100],
  data: {
    deepLink: data.ref,
  },
});

export default handleEvent;
