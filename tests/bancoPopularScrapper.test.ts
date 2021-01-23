import { BancoPopularScrapper } from '../src/scrappers';

beforeAll(async () => {
  await page.goto('http://google.com', { waitUntil: 'domcontentloaded' });
});

describe('BancoPopularScrapper', () => {
  it('expect the scrapeData method to return the correct object', async () => {
    jest.setTimeout(10000);
    let bps = new BancoPopularScrapper();
    const result = await bps.scrapeData(page);

    expect(bps.bankName).toBe('popular');
    expect(result.euroBuy).toEqual(expect.any(Number));
  });
});
