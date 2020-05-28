'use strict';

const bankNames = [
                {name: 'banreservas', presentationName: 'Banreservas', category: 'bank', information: 'Banreservas (oficialmente Banco de Reservas de la República Dominicana) es el mayor banco de la República Dominicana por activos, y en 2010 clasificó como el segundo mayor de la región de Centroamérica, tras el Banco Nacional de Costa Rica.2​ Pionero en el servicio de banca dominicano, manejado por el Estado Dominicano. Además de proveer servicios de banca personal y empresarial, maneja la mayoría de los fondos estatales.', socialnetworks: ['https://www.instagram.com/banreservasrd/', 'https://www.facebook.com/BanreservasRD/', 'https://twitter.com/banreservasrd'], locations: []},
                {name: 'popular' , presentationName:'Popular', category: 'bank', information: 'Desde su fundación, el 23 de agosto de 1963, el Banco Popular Dominicano reflejó dos de sus mayores compromisos empresariales, que conforme fue haciéndolo realidad, a partir de su apertura al público el 2 de enero de 1964, le imprimieron un rasgo diferenciador único a la entidad financiera y a su posterior arraigo e influencia en la sociedad.', socialnetworks: ['https://www.instagram.com/popularenlinea/', 'https://www.facebook.com/BancoPopularDominicano/', 'https://twitter.com/popularenlinea'], locations: []},
                {name: 'bhdleon' , presentationName:'Bhd León', category: 'bank', information: 'El Banco BHD León, entidad de intermediación financiera supervisada por la Superintendencia de Banco de la República Dominicana, fundado el 24 de julio de 1972 como Banco Hipotecario Dominicano bajo la dirección de Samuel Conde, presidente fundador de nuestra entidad financiera; Antonio Haché, Manuel Tavares Espaillat, Sebastián Mera, Juan Bautista Vicini, Carlos Sully Fondeur y José Antonio Caro Álvarez, un grupo de empresarios con una gran perspectiva sobre la banca. ', socialnetworks: ['https://www.instagram.com/bhdleon', 'https://www.facebook.com/bhdleon/', 'https://twitter.com/bhdleon'], locations: []},
                {name: 'scotiaBank' , presentationName:'Scotiabank', category: 'bank', information: 'Como el banco más internacional de Canadá, Scotiabank ha estado operando en República Dominicana desde 1920, y hoy opera con más de 2,000 empleados, 99 cajeros automáticos, 58 sucursales y 23 agencias a través de Soluciones Scotiabank. Esto unido a una amplia gama de productos y servicios financieros, que ofrecemos a los segmentos de Banca Personal, Banca Privada, Banca Comercial, Corporativa y de Inversión. Asimismo, a través de Soluciones Scotiabank atendemos el segmento minorista y microcrédito', socialnetworks: ['https://www.instagram.com/scotiabankdo/', 'https://www.facebook.com/ScotiabankDO', 'https://twitter.com/scotiabankRD'], locations: [] },
                {name: 'activo' , presentationName:'Activo', category: 'bank', information: 'Banco Múltiple Activo Dominicana inicia sus operaciones en República Dominicana en Junio 2016, con el objetivo de brindar, un servicio ágil, dinámico y adaptado al trabajo del día a día de los clientes particulares y empresas a la que sirve, brindándoles productos y servicios de alto valor agregado, con atención personalizada y tecnología de punta.', socialnetworks: ['https://www.instagram.com/bancoactivo_rd/', 'https://www.facebook.com/BancoMultipleActivoDominicana', 'https://twitter.com/BancoActivo_RD'], locations: [] },
                {name: 'bdi' , presentationName:'BDI', category: 'bank',information: 'El Banco BDI fue fundado por Don Pedro Rodríguez Villacañas en el año 1974 como Banco de Desarrollo Industrial, S.A. Fue autorizado a operar por la Junta Monetaria mediante la Sexta Resolución del 30 de mayo de ese año.', socialnetworks: ['https://www.instagram.com/bancobdi/', 'https://www.facebook.com/BancoBDI/', 'https://twitter.com/BancoBDI'], locations: []}, 
                {name: 'caribe' , presentationName:'Caribe', category: 'bank', information: 'Banco Múltiple Caribe Internacional, S.A. nace el 24 de noviembre de 2004, con el principal enfoque en la colocación de productos y servicios de ventas masivas en los segmentos de Tarjetas de Crédito, Vehículos y Remesas.', socialnetworks: ['https://www.instagram.com/bancocariberd/', 'https://www.facebook.com/BancoCaribeRD', 'https://twitter.com/bancocariberd'], locations: [] },
                {name: 'banesco' , presentationName:'Banesco', category: 'bank',information: 'una organización financiera establecida en Santo Domingo, República Dominicana. Inició operaciones comerciales en abril de 2011, luego que en diciembre de 2010 la Junta Monetaria le permitiera ofrecer servicios para la banca personal, pequeñas y medianas empresas y corporaciones. A finales de 2012 contaba con 9 sucursales en ese país y 230 empleados. ​Banesco tiene sus orígenes en Venezuela, donde es líder del mercado de la banca privada, sin embargo, el Holding del grupo se ubica en España y la entidad dominicana es subsidiaria de Banesco Panamá.', socialnetworks: ['https://www.instagram.com/banescord/', 'https://www.facebook.com/banescord', 'https://twitter.com/banescord'], locations: [] },
                {name: 'promerica' , presentationName:'Promerica', category: 'bank',information: 'Grupo Promerica es un conjunto de instituciones financieras enlazadas a través del holding PROMERICA FINANCIAL CORP (PFC), el cual es dirigido por un equipo multinacional de banqueros, con conocimiento puntual de las actividades económicas y financieras que se llevan a cabo en cada uno de los países y en la región como un todo. Sus inicios datan del año 1991, en Nicaragua, con el establecimiento del Banco Nacional de la Producción (BANPRO), llegando luego de manera paulatina al resto de Centroamérica, Ecuador y República Dominicana con el establecimiento de bancos comerciales, gracias al respaldo de un reconocido grupo de visionarios accionistas que cree en el bienestar y desarrollo de la región.', socialnetworks: ['https://www.instagram.com/bancopromericard/', 'https://www.facebook.com/PromericaRD/', 'https://twitter.com/promericard'], locations: [] }, 
                {name: 'lopezDeHaro' , presentationName:'Lopez de Haro', category: 'bank', information: 'El Banco López de Haro inició sus operaciones en 1986 bajo el nombre de “Sociedad Financiera López de Haro, S.A.”, con una clara orientación hacia los negocios corporativos y a la banca patrimonial. Luego se fue convirtiendo en la financiera de mayor importancia en la República Dominicana.', socialnetworks: ['https://www.instagram.com/bancolopezdeharo/', 'https://www.facebook.com/bancolopezdeharo', 'https://twitter.com/bcolopezdeharo'], locations: []},
                {name: 'caribeExpress' , presentationName:'Caribe Express', category: 'bank',information: 'El 27 de junio del 1979, el Señor José Andrés Hernández Andújar, con una visión de negocio, procede a la apertura de la Casa De Cambio La Nacional, S.A. La cual se convierte en la plataforma para la conformación de un grupo de empresas que involucran una variada gama de actividades y servicios, entre las que se destacan el Canje de divisas, Remesas, Transporte de pasajeros Interurbano y urbano, Paquetería local, Operaciones financieras, Actividades Hoteleras, Inmobiliaria y Agencia de viajes.', socialnetworks: ['https://www.instagram.com/caribeexpressrd/', 'https://www.facebook.com/CaribeExpressRD/', 'https://twitter.com/CaribeExpressRD'], locations: []},
                {name: 'vimenca' , presentationName:'Vimenca', category: 'bank',information: 'Banco Múltiple Vimenca S. A., fue constituido como banco de servicios múltiples por resolución de la Junta Monetaria de fecha 25 de abril del año 2002.', socialnetworks: ['https://www.instagram.com/bancovimenca/', 'https://www.facebook.com/bancovimenca', 'https://twitter.com/bancovimenca'], locations: [] },
                {name: 'lafise', presentationName:'LaFise', category: 'bank', information: 'Grupo LAFISE es un Holding empresarial moderno y diversificado fundado en 1985 para integrar y dinamizar los mercados de la región mediante una plataforma tecnológica de avanzada y un servicio ágil y amigable, de calidad mundial. Con mercados locales de capital y la presencia física en cada país de Centroamérica, México, Panamá, República Dominicana, Venezuela, Colombia y Estados Unidos.', socialnetworks: ['https://www.instagram.com/bancolafise/', 'https://www.facebook.com/BancoLAFISENicaragua/', 'https://twitter.com/bcolafiserd'], locations: []},
                {name: 'bancamerica' , presentationName:'Bancamérica', category: 'bank',information: 'La historia de Bancamérica en el mercado financiero dominicano inicia en el año 1983 cuando se constituye como empresa financiera bajo la razón social de PROMOCIONES e INVERSIONES. Posteriormente, en el año 2000, recibe la autorización para operar como BANCO DE DESARROLLO PROINSA, S.A. Durante el año 2004, las autoridades monetarias aprueban su conversión y posterior lanzamiento como banco de ahorro y crédito con lo cual pasa a llamarse Banco de Ahorro y Crédito de Las Américas, S.A. (Bancamérica), manteniéndose siempre a la vanguardia y entre los líderes de este segmento en la República Dominicana.', socialnetworks: ['https://www.instagram.com/bancamerica/', 'https://www.facebook.com/Bancamerica/', 'https://twitter.com/Bancamerica'], locations: []},
                {name: 'santaCruz' , presentationName:'Santa Cruz', category: 'bank', information: 'Banco Santa Cruz fue fundado el 18 de noviembre de 1983, bajo la razón social de Inversiones Santa Cruz, S. A. En ese momento, nuestro negocio estaba completamente orientado a la banca comercial, con una importante participación en el financiamiento de la producción agrícola. Cuando iniciamos, teníamos un claro objetivo de promover el desarrollo agroindustrial y el comercio y, con todas las ganas de aportarle valor a nuestro país, decidimos iniciar nuestras operaciones en nuestra primera oficina ubicada en la calle Restauración esquina Valerio, de la maravillosa ciudad corazón, Santiago de los Caballeros. ¡Orgullosamente santiagueros!', socialnetworks: ['https://www.instagram.com/BancoSantaCruzRD/', 'https://www.facebook.com/bancosantacruzrd/', 'https://twitter.com/BSC_RD'], locations: [] },
                {name: 'asociacionPopular' , presentationName:'Asociación Popular', category: 'creditunion', information: 'La Asociación Popular de Ahorros y Préstamos (APAP) es una institución financiera privada, de carácter mutualista, creada mediante Ley No. 5897, del 14 de mayo de 1962, con el objetivo de promover el ahorro para el financiamiento de la compra, construcción y/o mejoramiento de la vivienda familiar. ', socialnetworks: ['https://www.instagram.com/asocpopular/', 'https://www.facebook.com/asocpopular/', 'https://twitter.com/AsocPopular'], locations: [] },
                {name: 'asociacionNacional' , presentationName:'Asociación La Nacional', category: 'creditunion',information: 'Entidad de intermediación financiera de carácter mutualista, fundada el 14 de julio de 1972, organizada y administrada en virtud de lo establecido en las disposiciones legales y reglamentarias que la rigen, y en sus Estatutos Sociales. Hace más de 4 décadas, basados en profundas prácticas de gobierno corporativo y responsabilidad social, fundamos nuestro Centro Financiero Familiar, con la misión social de contribuir al déficit habitacional en nuestro país.', socialnetworks: ['https://www.instagram.com/asoclanacional/', 'https://www.facebook.com/asociacionlanacional', 'https://twitter.com/asoclanacional'], locations: []},
                {name: 'acn' , presentationName:'Agente de cambio La Nacional', category: 'agency', information: 'El Grupo Caribe fue fundado por el exitoso empresario dominicano Sr. José Andrés Hernández Andújar, el 27 de junio del 1979, de manera formal se constituye la empresa Casa de Cambio La Nacional, S.A. cuyo propósito era el cambio de cheques y divisas. Con esta empresa se sentaron las bases para la conformación de un grupo de empresas que involucran una variada gama de actividades y operaciones, entre las que se destacan: cambio de divisas, transporte de pasajeros a nivel urbano, interurbano y turístico, transporte de paqueterías y valores, remesas y transferencias de fondos a nivel nacional e internacional, actividades hoteleras, operaciones financieras e inmobiliarias.', socialnetworks: [], locations: ['SANTO DOMINGO', 'SANTIAGO']},
                {name: 'quezada' , presentationName:'Agente de cambio Quezada', category: 'agency', information: 'Agente de Cambio Quezada, S. A. es una entidad regulada destinada al servicio de compra y venta de divisas. Desde el año 2004 Agente de Cambio Quezada es parte del sistema financiero nacional regulado por la Superintendencia de Bancos y El Banco Central. Su presencia de los diferentes sectores generadores de divisas, fueron elementos claves para que esta entidad financiera mantenga su firmeza con un crecimiento sólido, transparente y sostenible convirtiéndose en el Agente de Cambio más grande de la zona Este de la República Dominicana.', socialnetworks: ['https://www.instagram.com/agentedecambioquezada/', 'https://www.facebook.com/pg/Agente-De-Cambio-Quezada-172699860015708/posts/'], locations: ['La Romana', 'Aeropuerto la romana', 'Friusa, Bavaro', 'Downtown Bavaro']},
                {name: 'peravia', presentationName: 'Asociación Peravia', category: 'creditunion', information: 'La Asociación Peravia de Ahorros y Préstamos es un organismo de derecho privado sin fines de lucro, fundada el 15 de Julio del 1963, al amparo de la Ley No. 5897, del 14 de Mayo del 1962, publicada en la Gaceta Oficial No. 8663, de fecha 20 de Junio del 1962.', socialnetworks: ['https://www.instagram.com/asocperavia/', 'https://www.facebook.com/asocperavia', 'https://twitter.com/asocperavia'], locations: ['Bani, Peravia']},
                {name: 'central', presentationName: 'Banco Central', category: 'bank', information: 'El Banco Central de la República Dominicana fue creado el 9 de octubre de 1947 por orden del entonces presidente Rafael Leonidas Trujillo, de conformidad con la Ley Orgánica No.1529, e inició sus operaciones el 23 de octubre del mismo año, instituyéndose como una entidad descentralizada y con plena autonomía. En la actualidad se rige por la Ley Orgánica No. 6142 del 29 de diciembre de 1962 y sus modificaciones.', socialnetworks: ['https://www.instagram.com/bancocentralrd/', 'https://www.facebook.com/BancoCentralRD/', 'https://twitter.com/BancoCentralRD'], locations: ['Distrito Nacional']},
                {name: 'progreso', presentationName: 'Progreso', category: 'bank', information: 'El Banco Dominicano del Progreso es una de las instituciones pioneras en la banca de servicios múltiples de Republica Dominicana. Con 40 años de trayectoria, la entidad ha evolucionado de manera continua, convirtiéndose en un banco dinámico que se ha destacado por su alianza estratégica con la prestigiosa marca American Express. Fue fundado en 1974 por un grupo de empresarios bajo el nombre de Banco de Boston Dominicano, S. A.; fifial del First National Bank of Boston. En 1981, los inversionistas dominicanos obtuvieron la participación total en las acciones de The First National of Boston. Así surgió el Banco Dominicano del Progreso en 1984, nombre que fue adoptado para representar el logro obtenido en esta negociación.', socialnetworks: ['https://www.instagram.com/bancodelprogreso/', 'https://www.facebook.com/BancoProgreso', 'https://twitter.com/bancoprogreso', 'https://www.linkedin.com/company/banco-del-progreso/7'], locations: ['Distrito Nacional']},
                {name: 'empire', presentationName: 'Empire', category: 'bank', information: 'Banco Empire es una Institución Financiera dirigida por un grupo de inversionistas con comprobada trayectoria y reconocida experiencia bancaria internacional.', socialnetworks: ['https://www.instagram.com/bancoempire/', 'https://www.facebook.com/BACEmpire/', 'https://twitter.com/bancoempire1'], locations: ['Distrito Nacional']},
                {name: 'jmmb', presentationName: 'JMMB Bank', category: 'bank', information: 'El Banco de Ahorro y Credito JMMB Bank es una empresa que amplía sustancialmente la gama de productos ofrecidos por JMMB en República dominicana y sirve como un punto estratégico sobre el cual se construye nuestro modelo integral de servicios financieros. A través del JMMB Bank, nuestros clientes obtendrán acceso a cuentas de ahorro, prestamos, certificados financieros, entre otros. Esta empresa y su oficina, nos permitirá una ventana más de cercanía a nuestros clientes para su mayor comodidad. Es un rebranding de Banco de Ahorro y Crédito Rio, el cual fue adquirido por JMMB Holding Company Limited, SRL, a finales de 2014.', socialnetworks: ['https://www.instagram.com/jmmbrd/', 'https://www.facebook.com/JMMBRD/', 'https://twitter.com/jmmbrd'], locations: ['Distrito Nacional']}
                ];

module.exports.bankNames = bankNames;