'use strict';

const bankNames = [
                {name: 'banreservas', presentationName: 'Banreservas', category: 'bank', information: 'Banreservas (oficialmente Banco de Reservas de la República Dominicana) es el mayor banco de la República Dominicana por activos, y en 2010 clasificó como el segundo mayor de la región de Centroamérica, tras el Banco Nacional de Costa Rica.2​ Pionero en el servicio de banca dominicano, manejado por el Estado Dominicano. Además de proveer servicios de banca personal y empresarial, maneja la mayoría de los fondos estatales.', socialnetworks: ['https://www.instagram.com/banreservasrd/', 'https://www.facebook.com/BanreservasRD/', 'https://twitter.com/banreservasrd'], locations: []},
                {name: 'popular' , presentationName:'Popular', category: 'bank', information: 'Desde su fundación, el 23 de agosto de 1963, el Banco Popular Dominicano reflejó dos de sus mayores compromisos empresariales, que conforme fue haciéndolo realidad, a partir de su apertura al público el 2 de enero de 1964, le imprimieron un rasgo diferenciador único a la entidad financiera y a su posterior arraigo e influencia en la sociedad.', socialnetworks: ['https://www.instagram.com/popularenlinea/', 'https://www.facebook.com/BancoPopularDominicano/', 'https://twitter.com/popularenlinea'], locations: []},
                {name: 'bhdleon' , presentationName:'Bhd León', category: 'bank', information: 'El Banco BHD León, entidad de intermediación financiera supervisada por la Superintendencia de Banco de la República Dominicana, fundado el 24 de julio de 1972 como Banco Hipotecario Dominicano bajo la dirección de Samuel Conde, presidente fundador de nuestra entidad financiera; Antonio Haché, Manuel Tavares Espaillat, Sebastián Mera, Juan Bautista Vicini, Carlos Sully Fondeur y José Antonio Caro Álvarez, un grupo de empresarios con una gran perspectiva sobre la banca. ', socialnetworks: ['https://www.instagram.com/bhdleon', 'https://www.facebook.com/bhdleon/', 'https://twitter.com/bhdleon'], locations: []},
                {name: 'scotiaBank' , presentationName:'Scotiabank', category: 'bank', information: 'Como el banco más internacional de Canadá, Scotiabank ha estado operando en República Dominicana desde 1920, y hoy opera con más de 2,000 empleados, 99 cajeros automáticos, 58 sucursales y 23 agencias a través de Soluciones Scotiabank. Esto unido a una amplia gama de productos y servicios financieros, que ofrecemos a los segmentos de Banca Personal, Banca Privada, Banca Comercial, Corporativa y de Inversión. Asimismo, a través de Soluciones Scotiabank atendemos el segmento minorista y microcrédito', socialnetworks: ['https://www.instagram.com/scotiabankdo/', 'https://www.facebook.com/ScotiabankDO', 'https://twitter.com/scotiabankRD'], locations: [] },
                {name: 'activo' , presentationName:'Activo', category: 'bank', information: 'Banco Múltiple Activo Dominicana inicia sus operaciones en República Dominicana en Junio 2016, con el objetivo de brindar, un servicio ágil, dinámico y adaptado al trabajo del día a día de los clientes particulares y empresas a la que sirve, brindándoles productos y servicios de alto valor agregado, con atención personalizada y tecnología de punta.', socialnetworks: ['https://www.instagram.com/bancoactivo_rd/', 'https://www.facebook.com/BancoMultipleActivoDominicana', 'https://twitter.com/BancoActivo_RD'], locations: [] },
                {name: 'bdi' , presentationName:'BDI', category: 'bank'}, 
                {name: 'caribe' , presentationName:'Caribe', category: 'bank'},
                {name: 'banesco' , presentationName:'Banesco', category: 'bank'},
                {name: 'promerica' , presentationName:'Promerica', category: 'bank'}, 
                {name: 'lopezDeHaro' , presentationName:'Lopez de Haro', category: 'bank'},
                {name: 'caribeExpress' , presentationName:'Caribe Express', category: 'bank'},
                {name: 'vimenca' , presentationName:'Vimenca', category: 'bank'},
                {name: 'lafise', presentationName:'LaFise', category: 'bank'},
                {name: 'bancamerica' , presentationName:'Bancamérica', category: 'bank'},
                {name: 'santaCruz' , presentationName:'Santa Cruz', category: 'bank'},
                {name: 'asociacionPopular' , presentationName:'Asociación Popular', category: 'creditunion'},
                {name: 'asociacionNacional' , presentationName:'Asociación La Nacional', category: 'creditunion'},
                {name: 'acn' , presentationName:'Agente de cambio La Nacional', category: 'agency'},
                {name: 'quezada' , presentationName:'Agente de cambio Quezada', category: 'agency'},
                ];

module.exports.bankNames = bankNames;