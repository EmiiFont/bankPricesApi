'use strict';

const wiki = require('wikijs').default;

const getBankInformation = function(bankNameForWiki){
    wiki({ apiUrl: 'https://es.wikipedia.org/w/api.php' })
	.page('Banco_Popular_Dominicano')
	.then(page => page.content())
	.then(console.log);
}

const initGetBankInfo = function(){
    const bankNamesForWiki = ['Banco_Popular_Dominicano', 'BanReservas', 
    'Banco_del_Progreso', 'Banco_Santa_Cruz', 'Scotiabank', 'Banesco_Banco_Múltiple',
    'Asociación_Popular_de_Ahorros_y_Préstamos' ];

   
}

module.exports.initGetBankInfo = initGetBankInfo;
