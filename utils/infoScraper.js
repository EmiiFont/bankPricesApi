'use strict';

const wiki = require('wikijs').default;
const puppeteer = require('puppeteer');

const getBankInformation = function(bankNameForWiki){
    return wiki({ apiUrl: 'https://es.wikipedia.org/w/api.php' })
	.page(bankNameForWiki)
	.then(page => page.summary());
}

const initGetBankInfo = async() =>{
    const bankNamesForWiki = ['Banco_Popular_Dominicano', 'BanReservas', 
    'Banco_del_Progreso', 'Banco_Santa_Cruz', 'Scotiabank', 'Banesco_Banco_Múltiple',
    'Asociación_Popular_de_Ahorros_y_Préstamos' ];

    for (const key in bankNamesForWiki) {
        if (bankNamesForWiki.hasOwnProperty(key)) {
            const element = bankNamesForWiki[key];
            let rr = await getBankInformation(element);
            console.log(rr);
        }
    }
}

const getBankAboutInfo = async(bankUrl) => {
    

}

module.exports.initGetBankInfo = initGetBankInfo;
