// Elenco delle province italiane situate sulle isole maggiori (Sicilia e Sardegna)
export const blockedProvinces: string[] = [
    // Sicilia
    'AG', // Agrigento
    'CL', // Caltanissetta
    'CT', // Catania
    'EN', // Enna
    'ME', // Messina
    'PA', // Palermo
    'RG', // Ragusa
    'SR', // Siracusa
    'TP', // Trapani
    // Sardegna
    'CA', // Cagliari
    'NU', // Nuoro
    'OR', // Oristano
    'SS', // Sassari
    'SU', // Sud Sardegna
];

// Elenco di prefissi CAP o CAP specifici per le isole minori
export const blockedZipCodes: string[] = [
    // Isole Eolie (ME)
    '98050', // Leni, Malfa, Santa Marina Salina
    '98055', // Lipari
    // Isole Egadi (TP)
    '91023', // Favignana
    // Isola di Pantelleria (TP)
    '91017',
    // Isole Pelagie (AG)
    '92031', // Lampedusa e Linosa
    // Isola di Ustica (PA)
    '90010',
    // Arcipelago Toscano (LI, GR)
    '57030', '57031', '57032', '57033', '57034', '57035', '57036', '57037', '57038', '57039', // Isola d'Elba (LI)
    '58012', // Isola del Giglio (GR)
    '58019', // Giannutri (GR)
    // Isole Ponziane (LT)
    '04020', // Ventotene
    '04027', // Ponza
    // Arcipelago Campano (NA)
    '80070', '80071', '80073', '80074', '80075', '80076', '80077', // Ischia, Procida, etc.
    '80079', // Capri
    // Isole Tremiti (FG)
    '71040',
    // Isola di San Pietro, Sant'Antioco (SU)
    '09014', // Carloforte
    '09017', // Sant'Antioco
    // La Maddalena (SS)
    '07024',
];
