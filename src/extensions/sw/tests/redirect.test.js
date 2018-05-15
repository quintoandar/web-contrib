import handleRedirect from '../redirect';

const makeMockEvent = (mockDeepLink = '') => ({
  notification: {
    data: { deepLink: mockDeepLink },
    close: jest.fn(),
  },
  waitUntil: (callback) => callback(),
});

const baseURL = 'base-url';
const linkMap = jest.fn();
const openWindowInternalFunc = jest.fn();

global.clients = {
  openWindow: () => openWindowInternalFunc,
};

describe('Notification click handler', () => {
  it('Should call notification.close and clients.openWindow', () => {
    const mockEvent = makeMockEvent();
    handleRedirect(mockEvent, baseURL, linkMap);
    expect(mockEvent.notification.close).toHaveBeenCalled();
  });

  it('Should call clients.openWindow', () => {
    const mockEvent = makeMockEvent();
    handleRedirect(mockEvent, baseURL, linkMap);
    expect(openWindowInternalFunc).toHaveBeenCalled();
  });
});
