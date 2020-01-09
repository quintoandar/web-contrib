import loadAsync from '../loadAsync';

describe('loadAsync', () => {
  const callback = jest.fn();
  const errorHandler = jest.fn();
  const component = { default: 'potato' };

  it('should call the callback with null and component default', async () => {
    const resolvedComponent = new Promise((res) => {
      res(component);
    });

    await loadAsync(errorHandler)(resolvedComponent, callback);
    expect(callback).toHaveBeenCalledWith(null, component.default);
  });

  describe('when is rejected', () => {
    const err = 'sad potato error';
    const rejectedComponent = new Promise(() => {
      throw err;
    });

    it('should not call errorHandler with err', async () => {
      await loadAsync(errorHandler)(rejectedComponent, callback);
      expect(errorHandler).not.toHaveBeenCalledWith(err);
    });

    describe('when is on production', () => {
      it('should call errorHandler with err', async () => {
        process.env.NODE_ENV = 'production';

        await loadAsync(errorHandler)(rejectedComponent, callback);
        expect(errorHandler).toHaveBeenCalledWith(err);
      });
    });
  });
});
