import routeParser from '../route-parser';

describe('routeParser', () => {
  it('Parses routes properly', () => {
    const result = routeParser(['agendar-fotos', 'imovel-ocupado/:accessType/escolher-data'], { accessType: 'chaves' });
    expect(result).toBe('agendar-fotos/imovel-ocupado/chaves/escolher-data');
  });

  it('If no payload detected, just concatenates routes', () => {
    const result = routeParser(['gru', 'loves', ':java']);
    expect(result).toBe('gru/loves/:java');
  });
});
