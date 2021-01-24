import * as puppeteer from "puppeteer";
import { BancoPopularScrapper } from "./BancoPopularScrapper";
import { BancoActivoScrapper } from "./BancoActivoScrapper";
import { BancoBHDScrapper } from "./BancoBHDScrapper";
import { BancoBonanzaScrapper } from "./BancoBonanzaScrapper";
import { BancoCaribeScrapper } from "./BancoCaribeScrapper";
import { BancoBDIScrapper } from "./BancoBDIScrapper";
import { BancoJmmbScrapper } from "./BancoJmmbScrapper";
import { BancoLafiseScrapper } from "./BancoLafiseScrapper";
import { BancoLopezDeHaroScrapper } from "./BancoLopezDeHaroScrapper";
import { BancoPromericaScrapper } from "./BancoPromericaScrapper";
import { BancoSantaCruzScrapper } from "./BancoSantaCruzScrapper";
import { BancoVimencaScrapper } from "./BancoVimencaScrapper";
import { BanescoScrapper } from "./BanescoScrapper";
import { BanReservasScrapper } from "./BanReservasScrapper";
import { ScotiabankScrapper } from "./ScotiabankScrapper";
import { BancamericaScrapper } from "./BancamericaScrapper";
import { AsociacionPeraviaScrapper } from "./AsociacionPeraviaScrapper";
import { AsociacionNacionalScrapper } from "./AsociacionNacionalScrapper";
import { AsociacionAhorrosScrapper } from "./AsociacionAhorrosScrapper";
import { AgenciaQuezadaScrapper } from "./AgenciaQuezadaScrapper";
import { AgenciaLaNacionalScrapper } from "./AgenciaLaNacionalScrapper";
import { BancoCentralScrapper } from "./BancoCentralScrapper";
import { BancoEmpireScrapper } from "./BancoEmpireScrapper";
import { IBankPrice } from "../models/bankprice";

export class ScrapperFacade {
  bancoPopular: BancoPopularScrapper;
  bancoActivo: BancoActivoScrapper;
  bancoBhd: BancoBHDScrapper;
  bancoBonanza: BancoBonanzaScrapper;
  bancoCaribe: BancoCaribeScrapper;
  bancoBDI: BancoBDIScrapper;
  bancoJmmb: BancoJmmbScrapper;
  bancoLafise: BancoLafiseScrapper;
  bancoLopezDeharo: BancoLopezDeHaroScrapper;
  bancoPromerica: BancoPromericaScrapper;
  bancoSantaCruz: BancoSantaCruzScrapper;
  bancoVimenca: BancoVimencaScrapper;
  banesco: BanescoScrapper;
  banReservas: BanReservasScrapper;
  scotiaBank: ScotiabankScrapper;
  bancamerica: BancamericaScrapper;
  peravia: AsociacionPeraviaScrapper;
  asociacionNacional: AsociacionNacionalScrapper;
  asociacionPopular: AsociacionAhorrosScrapper;
  quezada: AgenciaQuezadaScrapper;
  acn: AgenciaLaNacionalScrapper;
  bancoCentral: BancoCentralScrapper;
  empire: BancoEmpireScrapper;

  constructor() {
    this.bancoPopular = new BancoPopularScrapper();
    this.bancoActivo = new BancoActivoScrapper();
    this.bancoBhd = new BancoBHDScrapper();
    this.bancoBonanza = new BancoBonanzaScrapper();
    this.bancoCaribe = new BancoCaribeScrapper();
    this.bancoBDI = new BancoBDIScrapper();
    this.bancoJmmb = new BancoJmmbScrapper();
    this.bancoLafise = new BancoLafiseScrapper();
    this.bancoLopezDeharo = new BancoLopezDeHaroScrapper();
    this.bancoPromerica = new BancoPromericaScrapper();
    this.bancoSantaCruz = new BancoSantaCruzScrapper();
    this.bancoVimenca = new BancoVimencaScrapper();
    this.banesco = new BanescoScrapper();
    this.banReservas = new BanReservasScrapper();
    this.scotiaBank = new ScotiabankScrapper();
    this.bancamerica = new BancamericaScrapper();
    this.peravia = new AsociacionPeraviaScrapper();
    this.asociacionNacional = new AsociacionNacionalScrapper();
    this.asociacionPopular = new AsociacionAhorrosScrapper();
    this.quezada = new AgenciaQuezadaScrapper();
    this.acn = new AgenciaLaNacionalScrapper();
    this.bancoCentral = new BancoCentralScrapper();
    this.empire = new BancoEmpireScrapper();
  }

  async execute(browser: puppeteer.Browser): Promise<Array<IBankPrice | null>> {
    const resultArr: Array<IBankPrice | null> = [];

    resultArr.push(await this.bancoPopular.run(browser));
    resultArr.push(await this.bancoActivo.run(browser));

    return resultArr;
  }
}
