import { BanReservasScrapper } from '../src/scrappers/BanReservasScrapper';

describe('BanReservasScrapper', () => {
  it('expect the scrapeData method to return the correct object', async () => {
    jest.setTimeout(10000);
    let bps = new BanReservasScrapper();
    const result = await bps.scrapeData(page);

    expect(bps.bankName).toBe('banreservas');
    expect(result.euroBuy).toEqual(expect.any(Number));
  });
});
