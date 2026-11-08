/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SongketMotifItem {
  id: string;
  name: string;
  category: 'Adat Sakral' | 'Akulturasi Bahari' | 'Spiritual' | 'Bangsawan Keraton';
  hierarchicalRank: 'Tingkat Ratu (Mahkota)' | 'Tingkat Utama' | 'Tingkat Busana Adat';
  image: string;
  historyAndOrigin: string;
  philosophy: string;
  usageContext: string;
  weavingComplexity: 'Sangat Tinggi (3-6 Bulan)' | 'Tinggi (2-3 Bulan)' | 'Sedang (1-2 Bulan)';
  goldThreadRatio: string; // e.g. "90-98% Permukaan"
  symbolicMeaning: string[];
}

export interface SongketAnatomyPart {
  id: string;
  name: string;
  palembangTerm: string;
  role: string;
  visualPosition: string;
  philosophicalSymbol: string;
  technicalDetails: string;
}

export interface SongketMaterial {
  name: string;
  source: string;
  ecoFeature: string;
  traditionalPreparation: string;
  durability: string;
}

export const SONGKET_ANATOMY_PARTS: SongketAnatomyPart[] = [
  {
    id: 'tumpal',
    name: 'Kepala Kain (Tumpal Pucuk Rebung)',
    palembangTerm: 'Palepai / Tumpal Betine',
    role: 'Pusat perhatian kain dengan jajaran segitiga geometris simetris.',
    visualPosition: 'Terletak pada satu bentang vertikal di ujung kain (lebar ~30-40 cm).',
    philosophicalSymbol: 'Pucuk Rebung: Lambang pertumbuhan dan kemanfaatan hidup manusia—berguna saat masih muda (rebung) hingga kokoh dan lentur saat tua (buluh bambu).',
    technicalDetails: 'Ditenun dengan susunan benang lungsi ekstra padat, membutuhkan hitungan lidi khusus agar sudut lancip rebung presisi.'
  },
  {
    id: 'badan',
    name: 'Badan Kain (Papan Tengah)',
    palembangTerm: 'Awak Sewet / Awak Songket',
    role: 'Ruang bentang terluas tempat motif utama berulang disulamkan.',
    visualPosition: 'Bagian tengah yang membungkus tubuh pemakai dari pinggang ke bawah.',
    philosophicalSymbol: 'Keluasan Samudra & Semesta: Representasi hamparan berkah ilahi, kepribadian yang tenang, dan martabat luhur pemakainya.',
    technicalDetails: 'Tempat diselipkannya benang emas jantun menggunakan bilah kayu belira untuk memisahkan benang pakan.'
  },
  {
    id: 'apit',
    name: 'Apit & Pinggir Kain',
    palembangTerm: 'Pasmen Pinggir / Tepi Awak',
    role: 'Garis pembatas yang mengapit kepala dan badan kain agar pola tampak rapi dan seimbang.',
    visualPosition: 'Berada di kedua sisi tepi atas dan bawah sepanjang kain.',
    philosophicalSymbol: 'Keteraturan Adat: Lambang tata krama, etika pergaulan keraton, serta batasan moral yang menjaga marwah kehormatan keluarga.',
    technicalDetails: 'Umumnya berpola taji ayam, ombak beralun, atau rantai bintang kecil searah.'
  },
  {
    id: 'gandik',
    name: 'Rumbai & Gandik Ujung',
    palembangTerm: 'Rambu Sewet / Tali Ikatan',
    role: 'Tepian jumbai anyaman di kedua ujung kain tenun.',
    visualPosition: 'Tepi terluar paling pinggir kiri dan kanan.',
    philosophicalSymbol: 'Pengikat Silaturahmi: Menjaga tenunan tidak terurai, sebagaimana persaudaraan wong kito yang tak boleh tercerai-berai.',
    technicalDetails: 'Disimpul kepang rapat secara manual menggunakan teknik pilin tangan (tanpa jahitan mesin).'
  }
];

export const SONGKET_MOTIFS_DATA: SongketMotifItem[] = [
  {
    id: 'motif-lepus-berekam',
    name: 'Songket Lepus Berekam (Lepus Berlian)',
    category: 'Bangsawan Keraton',
    hierarchicalRank: 'Tingkat Ratu (Mahkota)',
    image: 'https://sumeks.disway.id/upload/57bddaacfc0b15cdea1a12ff567fbaea.jpg',
    historyAndOrigin: 'Merupakan strata songket paling agung dalam hierarki Kesultanan Palembang Darussalam. Kata "Lepus" berarti tertutup rapat, di mana benang emas menyelimuti hampir seluruh serat sutra tanpa menyisakan ruang kosong kapas.',
    philosophy: 'Melambangkan keagungan absolut, kemakmuran tanpa batas, dan kemurnian jiwa pemimpin. Seseorang yang memakai Lepus Berekam diharapkan memiliki budi pekerti yang berkilau laksana emas murni dan mampu mengayomi rakyatnya tanpa pamrih.',
    usageContext: 'Busana agung pengantin Palembang dalam prosesi Aesan Gede, pelantikan Sultan, serta upacara adat tertinggi keraton.',
    weavingComplexity: 'Sangat Tinggi (3-6 Bulan)',
    goldThreadRatio: '95% – 98% Permukaan Kain',
    symbolicMeaning: [
      'Kemuliaan budi pekerti tanpa cela',
      'Kemakmuran tanah Sriwijaya yang kaya emas (Suvarnadvipa)',
      'Perlindungan marwah kehormatan keluarga bangsawan'
    ]
  },
  {
    id: 'motif-nago-besaung',
    name: 'Songket Nago Besaung (Naga Bertarung)',
    category: 'Akulturasi Bahari',
    hierarchicalRank: 'Tingkat Utama',
    image: 'https://i.imgur.com/XS9TXWS.jpeg',
    historyAndOrigin: 'Lahir dari perjumpaan jalur maritim antara pelaut Tiongkok dan bangsawan Melayu Sriwijaya sejak abad ke-10. Motif ini menggambarkan dua ekor naga yang saling berhadapan memperebutkan mustika suci di atas ombak.',
    philosophy: 'Naga melambangkan kekuatan mistis air dan penguasa samudra Sungai Musi. Pertarungan kedua naga bukanlah perlambang perpecahan, melainkan keseimbangan dinamis kosmik antara kekuatan maskulin dan feminin, serta keberanian seorang pemimpin bahari.',
    usageContext: 'Dikenakan oleh para patih, panglima perang kesultanan, dan tetua adat saat musyawarah besar penentuan hukum.',
    weavingComplexity: 'Sangat Tinggi (3-6 Bulan)',
    goldThreadRatio: '85% – 90% Permukaan Kain',
    symbolicMeaning: [
      'Keberanian dan ketangkasan mengarungi gelombang kehidupan',
      'Keseimbangan kosmik dan penjaga ketenteraman Sungai Musi',
      'Akulturasi harmonis Tionghoa-Melayu Nusantara'
    ]
  },
  {
    id: 'motif-bunga-pacik',
    name: 'Songket Bunga Pacik',
    category: 'Spiritual',
    hierarchicalRank: 'Tingkat Busana Adat',
    image: 'https://cda.1001malam.com/uploads/tour/onedaycityandmusitourpalembang_bukitsiguntang_5060.JPG',
    historyAndOrigin: 'Motif klasik bercorak bunga kecil berkelopak empat yang bertabur simetris di atas dasar kain merah manggis. "Pacik" bermakna teratur dan tidak berlebihan, mencerminkan kesederhanaan dalam kemewahan.',
    philosophy: 'Mengajarkan nilai kesucian batin, kerendahan hati seorang perempuan Palembang, dan kemampuan menebarkan harum kebaikan kepada sesama tanpa harus bersikap pongah.',
    usageContext: 'Dikenakan oleh gadis-gadis Palembang pada upacara lamaran, akad nikah, serta tarian penyambutan Gending Sriwijaya.',
    weavingComplexity: 'Sedang (1-2 Bulan)',
    goldThreadRatio: '65% – 75% Permukaan Kain',
    symbolicMeaning: [
      'Kesucian niat dan keikhlasan beramal',
      'Keanggunan dalam kesederhanaan bersikap',
      'Harum nama keluarga yang senantiasa terjaga'
    ]
  },
  {
    id: 'motif-limar-sekar-mawar',
    name: 'Songket Limar Sekar Mawar (Cual Limar)',
    category: 'Adat Sakral',
    hierarchicalRank: 'Tingkat Utama',
    image: 'https://i.imgur.com/1nO431s.jpeg',
    historyAndOrigin: 'Kain adiluhung perpaduan langka antara teknik ikat pakan sutra warna-warni (Limar) dengan sungkitan benang emas di atas motif bunga mawar mekar. Dipengaruhi tradisi tenun Patola Gujarat yang tiba di pelabuhan Palembang.',
    philosophy: 'Sekar Mawar adalah metafora keindahan rasa cinta kasih dan romantisme berumah tangga. Duri mawar melambangkan pertahanan diri dari godaan luar, sementara kelopaknya melambangkan kelembutan tutur kata.',
    usageContext: 'Busana mempelai pada prosesi Aesan Paksangko, tarian pagar pengantin, dan hadiah seserahan sakral perkawinan.',
    weavingComplexity: 'Tinggi (2-3 Bulan)',
    goldThreadRatio: '70% – 80% Permukaan Kain',
    symbolicMeaning: [
      'Keabadian cinta kasih suami-istri',
      'Kecerdikan diplomasi dagang rempah dan sutra',
      'Ketegasan menjaga kehormatan di balik tutur kata halus'
    ]
  },
  {
    id: 'motif-pulir-bintang',
    name: 'Songket Pulir Bintang (Bintang Berantai)',
    category: 'Spiritual',
    hierarchicalRank: 'Tingkat Busana Adat',
    image: 'https://i.imgur.com/QvA1JQU.jpeg',
    historyAndOrigin: 'Pola geometris bintang bersudut delapan yang saling berkait dengan rantai halus keemasan, mengabadikan ilmu navigasi astronomi para pelaut Sriwijaya saat melintasi khatulistiwa.',
    philosophy: 'Bintang adalah lentera penuntun di malam kelam. Manusia diingatkan agar senantiasa berpegang pada kompas moral ketuhanan agar tidak tersesat dalam gelombang nafsu duniawi.',
    usageContext: 'Dipakai pada acara keagamaan, khataman Al-Qur’an keluarga keraton, dan upacara syukuran adat.',
    weavingComplexity: 'Sedang (1-2 Bulan)',
    goldThreadRatio: '70% – 75% Permukaan Kain',
    symbolicMeaning: [
      'Keteguhan iman dan tauhid',
      'Arah panduan hidup bagi generasi penerus',
      'Konektivitas tak terputus antar-generasi Wong Kito'
    ]
  }
];

export const SONGKET_MATERIALS_DATA: SongketMaterial[] = [
  {
    name: 'Benang Emas Jantun (Gold Leaf Thread)',
    source: 'Sutra alam yang dililit lempengan emas murni sepuh kuno.',
    ecoFeature: 'Awet hingga ratusan tahun tanpa korosi; tidak luntur walau dicuci dengan sari buah lerak tradisional.',
    traditionalPreparation: 'Dibuat dengan teknik tempa tangan tipis berukuran mikron sebelum dililitkan secara rapat ke poros serat sutra.',
    durability: '> 150 Tahun (Artefak Museum)'
  },
  {
    name: 'Pewarna Alami Getah Gambir & Kayu Secang',
    source: 'Ekstraksi tanaman gambir lokal Sumatera Selatan dan serutan kayu secang (Caesalpinia sappan).',
    ecoFeature: '100% Biodegradable, zero-chemical runoff, mendukung inisiatif FOLU Net Sink 2030.',
    traditionalPreparation: 'Kayu secang direbus selama 8 jam dengan tawas dan air jeruk nipis untuk mengunci pigmen merah marun alami.',
    durability: '50 – 80 Tahun'
  },
  {
    name: 'Pewarna Kunyit Tua & Daun Mangga',
    source: 'Rimpang Curcuma longa dan dedaunan mangga arumanis segar dari pekarangan Seberang Ulu.',
    ecoFeature: 'Kandungan tanin alami yang mengikat kuat serat sutra tanpa memerlukan fiksasi logam berat.',
    traditionalPreparation: 'Difermentasi bersama abu sabut kelapa untuk memunculkan spektrum kuning kunyit hangat berkilau.',
    durability: '30 – 50 Tahun'
  },
  {
    name: 'Alat Tenun Gedogan Tradisional',
    source: 'Kayu Belian (Kayu Besi / Ulin Musi) yang telah dikeringkan selama 5 tahun.',
    ecoFeature: 'Operasional 100% tenaga manusia nir-emisi listrik, ramah lingkungan, dan ergonomis.',
    traditionalPreparation: 'Rangka dipahat presisi dengan bilah belira bambu tua halus agar tidak merusak benang lungsi sutra.',
    durability: 'Diturunkan 3 Generasi Penenun'
  }
];
