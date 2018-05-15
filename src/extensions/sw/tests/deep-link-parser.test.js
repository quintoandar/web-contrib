import parseDeepLink from '../deep-link-parser';

const baseDeepLink = 'proprietario://';
const baseUrl = 'https://quintoandar.com.br/';

const makeGetRealRoute = (origin, destination) =>
  (route) => {
    switch (route) {
      case origin:
        return destination;
      default:
        return undefined;
    }
  };

describe('Deep link parser', () => {
  it('Should parse correctly without dynamic data', () => {
    const origin = 'registrar';
    const destination = 'cadastrar-imovel/localizar-endereco';
    const getRealRoute = makeGetRealRoute(origin, destination);

    const result = parseDeepLink(baseUrl, baseDeepLink + origin, getRealRoute);

    expect(result).toBe('https://quintoandar.com.br/cadastrar-imovel/localizar-endereco');
  });

  it('Should parse correctly with dynamic data', () => {
    const origin = 'detalhe/visita/lockbox';
    const destinationUnparsed = 'meus-imoveis/:imovelID/concluir-porta-chaves';

    const getRealRoute = makeGetRealRoute(origin, destinationUnparsed);

    const result = parseDeepLink(baseUrl, `${baseDeepLink}${origin}?imovelID=666`, getRealRoute);

    expect(result).toBe('https://quintoandar.com.br/meus-imoveis/666/concluir-porta-chaves');
  });

  it('Should return baseUrl if invalid deep link is sent', () => {
    const getRealRoute = makeGetRealRoute('hello', 'world');
    const result = parseDeepLink(baseUrl, `${baseDeepLink}supply/defender`, getRealRoute);

    expect(result).toBe('https://quintoandar.com.br/');
  });
});
