import { ScotiabankScrapper } from '../src/scrappers/ScotiabankScrapper';

beforeAll(async () => {
  await page.goto('http://google.com', { waitUntil: 'domcontentloaded' });
});

describe('ScotiabankScrapper', () => {
  it('expect the scrapeData method to return the correct object', async () => {
    jest.setTimeout(10000);
    let bps = new ScotiabankScrapper();
    const result = await bps.scrapeData(page);

    expect(bps.bankName).toBe('scotiaBank');
    expect(result.euroBuy).toEqual(expect.any(Number));
  });
});
