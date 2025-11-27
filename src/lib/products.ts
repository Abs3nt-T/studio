
export type Product = {
    id: string;
    name: string;
    listPrice: number;
    offerPrice: number;
    weight: number;
    category: 'Carne di asino' | 'Carne di mulo' | 'Carne di cavallo' | 'Carne di lattone' | 'Esclusive';
    imageId: string;
    description: string;
};

export const allProducts: Product[] = [
    {
        id: 'braciole-cotte',
        name: 'Braciole Cotte al Sugo',
        listPrice: 18,
        offerPrice: 18,
        weight: 1,
        category: 'Esclusive',
        imageId: 'braciole-cotte',
        description: 'Le tradizionali braciole, già cotte lentamente nel nostro sugo ricco. Un piatto pronto che porta in tavola il sapore della domenica.'
    },
    {
        id: 'pezzetti-cotti',
        name: 'Pezzetti Cotti al Sugo',
        listPrice: 16,
        offerPrice: 16,
        weight: 1,
        category: 'Esclusive',
        imageId: 'pezzetti-cotti',
        description: 'I classici pezzetti di cavallo, stufati a lungo fino a diventare tenerissimi. Pronti da scaldare per un pasto che sa di casa.'
    },
    {
        id: 'trippa-cotta',
        name: 'Trippa Cotta al Sugo',
        listPrice: 13,
        offerPrice: 13,
        weight: 1,
        category: 'Esclusive',
        imageId: 'trippa-cotta',
        description: 'La ricetta della tradizione per una trippa saporita e avvolgente, già cotta e pronta da gustare. Un sapore autentico e confortante.'
    },
    {
        id: 'carne-asino-cotta',
        name: 'Carne di asino cotta',
        listPrice: 23.4,
        offerPrice: 21,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'asino-cotta',
        description: 'Un prelibato stufato, cotto lentamente per ore fino a diventare tenerissimo. Un sapore ricco e avvolgente che racconta la tradizione.'
    },
    {
        id: 'salame-asino',
        name: 'Salame di asino della casa',
        listPrice: 28.3,
        offerPrice: 27,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'salame-asino',
        description: 'Prodotto secondo la nostra ricetta segreta, questo salame ha un gusto inconfondibile, perfetto per antipasti rustici e taglieri pregiati.'
    },
    {
        id: 'bresaola-asino',
        name: 'Bresaola di asino della casa',
        listPrice: 5.6,
        offerPrice: 4.4,
        weight: 0.1,
        category: 'Carne di asino',
        imageId: 'bresaola-asino',
        description: "Leggera, magra e incredibilmente saporita. La nostra bresaola, venduta all'etto (100g), è una delizia per il palato, ideale per piatti freschi e carpacci gourmet."
    },
    {
        id: 'costate-asino-osso',
        name: 'Costate di asino con osso',
        listPrice: 21.2,
        offerPrice: 19,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'costate-asino-osso',
        description: 'Per i veri amanti della griglia. L\'osso conferisce un sapore intenso e una tenerezza senza pari durante la cottura.'
    },
    {
        id: 'costate-asino-senza-osso',
        name: 'Costate di asino senza osso',
        listPrice: 24.3,
        offerPrice: 23,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'costate-asino-senza-osso',
        description: 'Una bistecca succulenta e facile da gestire, perfetta per una cena veloce in padella o una grigliata impeccabile. Morbidezza garantita.'
    },
    {
        id: 'hamburger-asino',
        name: 'Hamburger di asino',
        listPrice: 13.5,
        offerPrice: 12,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'hamburger-asino',
        description: 'Dimentica i soliti hamburger. Il nostro burger di asino è un\'esplosione di sapore, magro e nutriente, per un pasto che non delude mai.'
    },
    {
        id: 'rosticciana-asino',
        name: 'Rosticciana Di Asino',
        listPrice: 22.4,
        offerPrice: 19,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'rosticciana-asino',
        description: 'Le classiche costine in una versione più audace. Marinate a puntino, sono pronte a sfrigolare sulla brace e a conquistare tutti.'
    },
    {
        id: 'straccetti-asino-marinati',
        name: 'Straccetti di Asino marinati',
        listPrice: 19.5,
        offerPrice: 17,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'straccetti-asino-marinati',
        description: 'Sottili e saporiti, i nostri straccetti sono già marinati e pronti per essere saltati in padella. La soluzione perfetta per un pasto veloce e gourmet.'
    },
    {
        id: 'tagliata-asino-marinata',
        name: 'Tagliata di asino marinata',
        listPrice: 23.5,
        offerPrice: 21,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'tagliata-asino-marinata',
        description: 'Un taglio nobile già insaporito con la nostra marinatura segreta. Pochi minuti in griglia per una tagliata tenera, succosa e profumata.'
    },
    {
        id: 'salsiccia-asino',
        name: 'Salsiccia di asino',
        listPrice: 11.5,
        offerPrice: 10,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'salsiccia-asino',
        description: 'Una salsiccia dal carattere forte e deciso, con una speziatura equilibrata che ne esalta il gusto unico. Ottima per sughi o alla griglia.'
    },
    {
        id: 'picanha-asino',
        name: 'Picanha di asino',
        listPrice: 23,
        offerPrice: 20,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'picanha-asino',
        description: 'Il taglio preferito dai maestri della griglia, in versione equina. La sua copertina di grasso la rende incredibilmente succosa e saporita.'
    },
    {
        id: 'costolette-mulo-marinate',
        name: 'Costolette di mulo marinate',
        listPrice: 22.5,
        offerPrice: 19,
        weight: 1,
        category: 'Carne di mulo',
        imageId: 'costolette-mulo',
        description: 'Una vera sorpresa per il palato. Le nostre costolette di mulo sono marinate per esaltarne il sapore rustico e la sorprendente tenerezza.'
    },
    {
        id: 'asado-mulo',
        name: 'Asado di mulo',
        listPrice: 24,
        offerPrice: 21,
        weight: 1,
        category: 'Carne di mulo',
        imageId: 'asado-mulo',
        description: 'Un taglio tradizionale per cotture lente che sprigiona un sapore intenso e autentico. Per chi ama i gusti robusti della tradizione.'
    },
    {
        id: 'asado-asino',
        name: 'Asado di asino',
        listPrice: 25,
        offerPrice: 23,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'asado-asino',
        description: 'L\'esperienza dell\'asado con la delicatezza della carne d\'asino. Perfetto per una cottura lenta che la rende tenera da sciogliersi in bocca.'
    },
    {
        id: 'fettine-asino',
        name: 'Fettine di asino',
        listPrice: 21.2,
        offerPrice: 19,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'fettine-asino',
        description: 'Sottili, tenere e versatili. Perfette per scaloppine, involtini o una cottura velocissima in padella. Un classico che non stanca mai.'
    },
    {
        id: 'pezzetti-cavallo',
        name: 'Pezzetti di cavallo',
        listPrice: 17.6,
        offerPrice: 14,
        weight: 1,
        category: 'Carne di cavallo',
        imageId: 'pezzetti-cavallo',
        description: 'Il cuore della tradizione salentina. I nostri pezzetti sono perfetti per il classico spezzatino al sugo, un piatto che scalda il cuore.'
    },
    {
        id: 'fettine-mulo',
        name: 'Fettine di mulo',
        listPrice: 24.1,
        offerPrice: 23,
        weight: 1,
        category: 'Carne di mulo',
        imageId: 'fettine-mulo',
        description: 'Una carne magra dal sapore caratteristico. Le nostre fettine di mulo sono ideali per chi cerca un gusto diverso e nutriente.'
    },
    {
        id: 'pezzetti-mulo',
        name: 'Pezzetti di mulo',
        listPrice: 21.7,
        offerPrice: 19,
        weight: 1,
        category: 'Carne di mulo',
        imageId: 'pezzetti-mulo',
        description: 'Per spezzatini e stufati dal sapore rustico e deciso. Una carne che regala grandi soddisfazioni nelle lunghe cotture.'
    },
    {
        id: 'fettine-cavallo-lattone',
        name: 'Fettine di cavallo tuttofare',
        listPrice: 22.2,
        offerPrice: 19.5,
        weight: 1,
        category: 'Carne di cavallo',
        imageId: 'fettine-lattone',
        description: 'Incredibilmente tenere e delicate, queste fettine di puledro sono così versatili da essere perfette per ogni ricetta, dai più grandi ai più piccoli.'
    },
    {
        id: 'polpa-equina',
        name: 'Polpa Equina',
        listPrice: 21,
        offerPrice: 19,
        weight: 1,
        category: 'Carne di cavallo',
        imageId: 'polpa-equina',
        description: 'Tagli sceltissimi di polpa di puledro, perfetti per arrosti, spezzatini o da tritare per un ragù eccezionale. La base per la tua creatività.'
    },
    {
        id: 'asado-asino-con-osso',
        name: 'Asado di asino (con osso)',
        listPrice: 21,
        offerPrice: 18,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'asado-asino-osso',
        description: 'Il taglio intercostale con osso, per chi non vuole rinunciare al sapore autentico che solo la cottura vicino all\'osso può dare.'
    },
    {
        id: 'pezzetti-asino',
        name: 'Pezzetti di Asino',
        listPrice: 18.2,
        offerPrice: 16,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'pezzetti-asino',
        description: 'Bocconcini teneri e saporiti, ideali per uno spezzatino diverso dal solito, dal gusto più dolce e delicato rispetto al cavallo.'
    },
    {
        id: 'tritato-equino',
        name: 'Tritato Equino',
        listPrice: 17.9,
        offerPrice: 14,
        weight: 1,
        category: 'Carne di cavallo',
        imageId: 'tritato-equino',
        description: 'Il nostro macinato freschissimo di prima scelta, magro e nutriente. Perfetto per ragù leggeri, polpette gustose o ripieni saporiti.'
    },
    {
        id: 'salsiccia-della-casa',
        name: 'Salsiccia della casa',
        listPrice: 10.9,
        offerPrice: 8.5,
        weight: 1,
        category: 'Carne di lattone',
        imageId: 'salsiccia-lattone',
        description: 'La nostra salsiccia classica, preparata con la carne tenera del lattone. Un sapore delicato che piace a tutta la famiglia, perfetta per ogni occasione.'
    },
    {
        id: 'trippa-pulita',
        name: 'Trippa Pulita',
        listPrice: 11.2,
        offerPrice: 9,
        weight: 1,
        category: 'Carne di cavallo',
        imageId: 'trippa-pulita',
        description: 'La trippa della tradizione, già pulita e pronta per essere cucinata. Un ingrediente povero ma ricco di sapore, per riscoprire i gusti di una volta.'
    },
    {
        id: 'ribeye-asino',
        name: 'Ribeye di Asino',
        listPrice: 27.8,
        offerPrice: 26,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'ribeye-asino',
        description: 'Un taglio eccezionale, il nostro Ribeye di asino. La sua marezzatura garantisce una tenerezza e un sapore che vi lasceranno senza parole.'
    },
    {
        id: 'asado-mulo-marinato',
        name: 'Asado di Mulo Marinato',
        listPrice: 25,
        offerPrice: 23,
        weight: 1,
        category: 'Carne di mulo',
        imageId: 'asado-mulo-marinato',
        description: 'Tutto il sapore dell\'asado di mulo, ma con una marcia in più. La nostra marinatura lo rende ancora più tenero e pronto per la griglia.'
    },
    {
        id: 'tomahawk-asino-con-osso',
        name: 'Tomahawk Di Asino Con Osso',
        listPrice: 23.1,
        offerPrice: 22,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'tomahawk-asino',
        description: 'La bistecca che non passa inosservata. Un taglio scenografico e incredibilmente gustoso, perfetto per stupire i tuoi ospiti.'
    },
    {
        id: 'tagliata-di-asino',
        name: 'Tagliata di Asino',
        listPrice: 23.2,
        offerPrice: 19.5,
        weight: 1,
        category: 'Carne di asino',
        imageId: 'tagliata-asino',
        description: 'Un grande classico per una cena perfetta. Tenera, saporita e magra, da servire semplicemente con rucola e scaglie di grana.'
    }
];

    
    
