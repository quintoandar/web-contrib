import handlePush from '../push-handler';

jest.mock('../constants');
const constants = require('../constants').default;

describe('PushHandler', () => {
  const mockEventWithData = (mockData) => ({
    data: {
      json: () => ({
        data: mockData,
      }),
    },
  });

  let mockSw;
  beforeEach(() => {
    mockSw = {
      registration: {
        showNotification: jest.fn(),
      },
    };
    Object.assign(global, mockSw);
    constants.notificationIcon = './supply_defense_logo.png';
  });

  it('Calls self.registration.showNotification with correct payload', () => {
    const data = {
      title: 'bla',
      message: 'bla',
      ref: 'bla',
    };
    const mockEvent = mockEventWithData(data);

    handlePush(mockEvent);
    expect(mockSw.registration.showNotification).toHaveBeenCalledWith(data.title, {
      body: data.message,
      icon: constants.notificationIcon,
      vibrate: [100, 50, 100],
      data: {
        deepLink: data.ref,
      },
    });
  });

  it('Does not show notification when payload is invalid', () => {
    const mockEvent = mockEventWithData({
      hello: 'world',
    });

    handlePush(mockEvent);
    expect(mockSw.registration.showNotification).not.toHaveBeenCalled();
  });
});
