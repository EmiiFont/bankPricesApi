import { BancoBDIScrapper } from '../src/scrappers';
import * as puppeteer from 'puppeteer';

let brow;
beforeAll(async () => {
  brow = await puppeteer.launch();
});

describe('BancoBDIScrapper', () => {
  it('expect the scrapeData method to return the correct object', async () => {
    jest.setTimeout(10000);
    let bps = new BancoBDIScrapper();
    const result = await bps.run(brow);

    expect(bps.bankName).toBe('bdi');
    expect(result?.euroBuy).toEqual(expect.any(Number));
  });
});
