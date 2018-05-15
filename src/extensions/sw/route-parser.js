const routeParser = (paths, params) => {
  let route = paths.join('/');
  if (params) {
    Object.keys(params).forEach((key) => {
      route = route.replace(`:${key}`, params[key]);
    });
  }
  return route;
};

export default routeParser;
