export const errorLoading = (errorHandler) => (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
  if (
    process.env.NODE_ENV === 'production' &&
    typeof errorHandler === 'function'
  ) {
    errorHandler(err);
  }
};

export const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default (errorHandler) => (importedComponent, cb) => {
  const renderRoute = loadModule(cb);
  return Promise.all([importedComponent])
    .then(([component]) => {
      renderRoute(component);
    })
    .catch(errorLoading(errorHandler));
};
