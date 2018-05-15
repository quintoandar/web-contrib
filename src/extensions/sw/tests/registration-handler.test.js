import * as pushUtils from '../registration-handler';

const mockSubscription = {
  toJSON: () => ({
    endpoint: 'theen',
    keys: {
      p256dh: 'ph',
      auth: 'authorized',
    },
  }),
  unsubscribe: () => new Promise((resolve) => resolve()),
};

const mockRegistration = {
  pushManager: {
    subscribe() {
      return this.subscriptionPromise;
    },
    getSubscription() {
      return this.subscriptionPromise;
    },
    subscriptionPromise: new Promise((resolve) => resolve(mockSubscription)),
  },
};

const mockWindow = (mockObject = {}) => ({
  Notification: {
    requestPermission: mockObject.requestPermission ? mockObject.requestPermission : undefined,
    subscribeUser: mockObject.subscribeUser ? mockObject.requestPermission : undefined,
    unsubscribeUser: mockObject.unsubscribeUser ? mockObject.requestPermission : undefined,
  },
  navigator: {
    serviceWorker: {
      getRegistration: () => new Promise((resolve) => resolve(mockRegistration)),
    },
  },
  atob: window.atob,
});

describe('pushUtils', () => {
  describe('requestNotificationPermission', () => {
    const requestPermissionSuccess = (callback) => new Promise((resolve) => resolve(callback('granted')));
    const requestPermissionFailure = (callback) => new Promise((resolve) => resolve(callback('denied')));

    it('Should execute onSuccess if request is granted', async () => {
      setWindowGlobals(mockWindow({ requestPermission: requestPermissionSuccess }));
      const onSucceed = jest.fn();
      await pushUtils.requestNotificationPermission(onSucceed);
      expect(onSucceed).toHaveBeenCalled();
    });

    it('Should not execute onSuccess if Notification not in window', () => {
      setWindowGlobals(mockWindow({ requestPermission: requestPermissionFailure }));
      const onSucceed = jest.fn();
      pushUtils.requestNotificationPermission(onSucceed);
      expect(onSucceed).toHaveBeenCalledTimes(0);
    });

    it('Should not execute onSuccess if requestPermission does not return granted', () => {
      setWindowGlobals(mockWindow({ requestPermission: requestPermissionFailure }));
      const onSucceed = jest.fn();
      pushUtils.requestNotificationPermission(onSucceed);
      expect(onSucceed).toHaveBeenCalledTimes(0);
    });
  });

  describe('subscribeUser', () => {
    it('Should call onSucceed on success', () => {
      setWindowGlobals();
      const onSucceed = jest.fn();
      return pushUtils.subscribeUser(onSucceed).then(() => {
        expect(onSucceed).toHaveBeenCalled();
      });
    });
  });

  describe('unsubscribeUser', () => {
    it('Should call unregisterBrowser on success', () => {
      setWindowGlobals();
      const onSucceed = jest.fn();
      return pushUtils.unsubscribeUser(onSucceed).then(() => {
        expect(onSucceed).toHaveBeenCalled();
      });
    });
  });

  function setWindowGlobals(mockWindowInst = mockWindow()) {
    Object.assign(global, mockWindowInst);
    Object.assign(global.navigator, mockWindowInst.navigator);
  }
});
