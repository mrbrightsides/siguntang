/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FolkloreHotspot {
  id: string;
  title: string;
  subtitle: string;
  xPercent: number; // position on diorama stage (0-100)
  yPercent: number;
  icon: string;
  description: string;
  culturalNote: string;
}

export interface FolkloreRelic {
  id: string;
  name: string;
  titlePalembang: string;
  origin: string;
  imageIcon: string;
  glowColor: string;
  lore: string;
  moralLesson: string;
  stcHash: string;
}

export interface FolkloreStory {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  palembangQuote: string;
  quoteMeaning: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  riverKm: number; // distance marker along Musi
  atmosphere: 'golden-dusk' | 'midnight-mist' | 'mystic-twilight' | 'lantern-night' | 'emerald-dawn';
  atmosphereLabel: string;
  ambientBgmFreq: number;
  narrationScript: string[];
  backdropVisual: {
    skyGradient: string;
    waterTone: string;
    mistIntensity: number;
    keyLandmark: string;
  };
  relic: FolkloreRelic;
  hotspots: FolkloreHotspot[];
  historicalContext: string;
}

export const MUSI_FOLKLORE_EXPEDITION: FolkloreStory[] = [
  {
    id: 'folklore-1',
    slug: 'putri-kembang-dadar',
    title: 'Putri Kembang Dadar',
    subtitle: 'Pusaka Teratai Emas & Kedaulatan Bukit Siguntang',
    palembangQuote: '“Bungo dadar mekarlah suci, payo jago marwah kito di pucuk Siguntang.”',
    quoteMeaning: 'Bunga dadar mekar dengan suci, marilah kita jaga kehormatan diri di puncak Bukit Siguntang.',
    locationName: 'Hulu Musi — Kaki Bukit Siguntang',
    coordinates: { lat: -2.9972, lng: 104.7256 },
    riverKm: 2.4,
    atmosphere: 'golden-dusk',
    atmosphereLabel: 'Senja Emas Sriwijaya (17:45 WIB)',
    ambientBgmFreq: 220,
    backdropVisual: {
      skyGradient: 'from-amber-950 via-amber-900/80 to-[#120c06]',
      waterTone: '#2e1c0d',
      mistIntensity: 0.35,
      keyLandmark: 'Siluet Bukit Siguntang & Pohon Bodhi Purba',
    },
    narrationScript: [
      'Alkisah di hulu Sungai Musi, menjulang Bukit Siguntang yang diselimuti kabut harum semerbak.',
      'Di sanalah bersemayam Putri Kembang Dadar, permaisuri bertuah yang parasnya laksana embun pagi dan budi pekertinya menjulang di atas segala kemewahan.',
      'Raja-raja dari penjuru samudra datang membawa emas permata, namun sang putri hanya mengajukan satu ujian: mengarungi Musi tanpa menodai setetes pun kesucian airnya.',
      'Kini, diorama teratai emas ini menjadi lambang abadi bahwa kehormatan tanah Sriwijaya tak ternilai oleh takhta maupun harta duniawi.'
    ],
    relic: {
      id: 'relic-kembang-dadar',
      name: 'Teratai Emas Kembang Dadar',
      titlePalembang: 'Bungo Dadar Amas Keraton',
      origin: 'Kompleks Arkeologi Bukit Siguntang',
      imageIcon: 'lotus',
      glowColor: '#fbbf24',
      lore: 'Bunga teratai mistis berkelopak tujuh dengan urat keemasan. Konon hanya mekar saat air Sungai Musi tenang dan hati pemimpin negeri sedang tulus mengabdi.',
      moralLesson: 'Kemuliaan sejati manusia lahir dari kesucian budi dan keteguhan prinsip, bukan silau mahkota jabatan.',
      stcHash: '0xSIGUNTANG...DADAR77A'
    },
    hotspots: [
      {
        id: 'hs-1',
        title: 'Makam Panglima Bukit Siguntang',
        subtitle: 'Titik Awal Silsilah Melayu',
        xPercent: 32,
        yPercent: 42,
        icon: 'mountain',
        description: 'Pusat spiritual peradaban bahari Sriwijaya di mana prasasti Talang Tuwo dan arca Buddha Amarawati ditemukan.',
        culturalNote: 'Dihormati sebagai tempat bertemunya raja-raja melayu lintas samudra.'
      },
      {
        id: 'hs-2',
        title: 'Telaga Teratai Bercahaya',
        subtitle: 'Tempat Sang Putri Menyepi',
        xPercent: 54,
        yPercent: 58,
        icon: 'sparkles',
        description: 'Riak air Musi yang membiaskan cahaya jingga keemasan ketika fajar dan senja bertaut.',
        culturalNote: 'Mitos lokal melarang memetik bunga liar di sekitar aliran air Bukit Siguntang.'
      },
      {
        id: 'hs-3',
        title: 'Sampan Dayung Sriwijaya',
        subtitle: 'Perahu Cadik Tradisional',
        xPercent: 78,
        yPercent: 68,
        icon: 'ship',
        description: 'Rekonstruksi perahu kayu pasak tanpa paku besi yang mampu menembus ombak Selat Bangka dan Musi.',
        culturalNote: 'Bukti kemahiran teknik maritim Palembang sejak abad ke-7 Masehi.'
      }
    ],
    historicalContext: 'Bukit Siguntang dipercaya sebagai tempat mendaratnya Dapunta Hyang Sri Jayanasa dalam perjalanan Siddhayatra, mencanangkan berdirinya kedatuan Sriwijaya.'
  },
  {
    id: 'folklore-2',
    slug: 'antu-banyu',
    title: 'Misteri Antu Banyu',
    subtitle: 'Penjaga Kedalaman & Pantangan Pusaran Sungai Musi',
    palembangQuote: '“Udah magrib jangan berenang di tepian, gek ditarik Antu Banyu ke dasar lumpur.”',
    quoteMeaning: 'Sudah magrib jangan berenang di tepian Musi, nanti ditarik Antu Banyu ke dasar lumpur sungai.',
    locationName: 'Pilar Jembatan Ampera & Dermaga Pasar 16 Ilir',
    coordinates: { lat: -2.9918, lng: 104.7628 },
    riverKm: 6.8,
    atmosphere: 'midnight-mist',
    atmosphereLabel: 'Malam Kabut Pekat (21:30 WIB)',
    ambientBgmFreq: 110,
    backdropVisual: {
      skyGradient: 'from-[#070b12] via-[#0d1624] to-[#04060a]',
      waterTone: '#0a101d',
      mistIntensity: 0.65,
      keyLandmark: 'Tiang Pancang Ampera & Siluet Rumah Rakit 16 Ilir',
    },
    narrationScript: [
      'Ketika lonceng magrib berkumandang di sepanjang tepian Sungai Musi, para tetua selalu berseru memanggil anak-anak naik ke darat.',
      'Dari kedalaman air yang keruh, sesosok makhluk berambut panjang mirip jalinan lumut basah kerap melingkar di tiang-tiang pancang rakit.',
      'Antu Banyu bukanlah sekadar momok penakut; ia adalah manifestasi peringatan purba orang Palembang.',
      'Arus bawah Musi yang berpusar di celah palung sungai tak kenal ampun kepada siapa pun yang pongah dan melanggar etika perairan.'
    ],
    relic: {
      id: 'relic-antu-banyu',
      name: 'Untaian Serat Lumut Musi',
      titlePalembang: 'Gelang Penjago Banyu Arus',
      origin: 'Palung Arus Bawah Jembatan Ampera',
      imageIcon: 'waves',
      glowColor: '#10b981',
      lore: 'Jalinan serat lumut air sungai purba yang memancarkan fosfor kehijauan di dasar gelap. Dipercaya sebagai jimat perlindungan juru mudi kapal ketek saat kabut tebal.',
      moralLesson: 'Waspada dan rendah hati di hadapan kekuatan alam; sungai memberi kehidupan sekaligus menuntut rasa hormat yang mendalam.',
      stcHash: '0xANTU...BANYU901E'
    },
    hotspots: [
      {
        id: 'hs-4',
        title: 'Pusaran Palung 16 Ilir',
        subtitle: 'Kedalaman Arus Bawah Tanah',
        xPercent: 48,
        yPercent: 72,
        icon: 'wind',
        description: 'Pertemuan arus Sungai Musi dengan muara anak sungai yang membentuk pusaran tak kasat mata di malam hari.',
        culturalNote: 'Dihindari oleh juru mudi perahu jukung saat pasang naik.'
      },
      {
        id: 'hs-5',
        title: 'Tiang Kayu Ulin Rumah Rakit',
        subtitle: 'Rumah Apung Tertua Nusantara',
        xPercent: 22,
        yPercent: 45,
        icon: 'home',
        description: 'Pondasi kayu ulin yang terendam air ratusan tahun tanpa lapuk, menjadi habitat lumut tempat Antu Banyu bersembunyi.',
        culturalNote: 'Masyarakat rumah rakit meletakkan lentera minyak khusus untuk menjauhkan bahaya perairan.'
      },
      {
        id: 'hs-6',
        title: 'Lentera Teplok Haluan Ketek',
        subtitle: 'Penerang Kabut Sungai',
        xPercent: 76,
        yPercent: 52,
        icon: 'flame',
        description: 'Lentera kuningan dengan sumbu minyak kelapa yang menembus pekatnya kabut Musi.',
        culturalNote: 'Simbol penuntun jalan pulang bagi pelaut Musi yang tersesat di kegelapan.'
      }
    ],
    historicalContext: 'Mitos Antu Banyu secara ekologis berfungsi menjaga keselamatan warga dari bahaya tenggelam akibat fluktuasi pasang surut ekstrem Sungai Musi yang mencapai 3-4 meter.'
  },
  {
    id: 'folklore-3',
    slug: 'pulau-kemaro',
    title: 'Pulau Kemaro & Cinta Abadi',
    subtitle: 'Tragedi 7 Guci Emas Sawi Asin Siti Fatimah & Tan Bun An',
    palembangQuote: '“Kalu jodoh dak kemano, biar karam di Musi namo kito tecatat di Kemaro.”',
    quoteMeaning: 'Kalau jodoh tak akan ke mana, biarpun karam di Sungai Musi nama kita abadi di Pulau Kemaro.',
    locationName: 'Delta Muara Sungai Musi — Pulau Kemaro',
    coordinates: { lat: -2.9818, lng: 104.7981 },
    riverKm: 14.5,
    atmosphere: 'lantern-night',
    atmosphereLabel: 'Malam Lampion Seribu Merah (20:00 WIB)',
    ambientBgmFreq: 330,
    backdropVisual: {
      skyGradient: 'from-[#1a0808] via-[#2d0f0f] to-[#0d0404]',
      waterTone: '#1f0d0d',
      mistIntensity: 0.4,
      keyLandmark: 'Pagoda 9 Lantai Bercahaya & Pohon Cinta Kemaro',
    },
    narrationScript: [
      'Kapal saudagar dari Negeri Tiongkok berlabuh di muara Sungai Musi, membawa Pangeran Tan Bun An yang terpaut asmara pada Putri Siti Fatimah.',
      'Sebagai tanda lamaran, sang ayah mengirimkan tujuh guci pusaka yang dilapisi sayur sawi asin untuk mengecoh bajak laut laut Jawa.',
      'Mengira ayahnya mempermalukan dirinya di hadapan keluarga keraton Palembang, Tan Bun An menendang guci-guci tersebut ke dasar sungai.',
      'Saat guci terakhir pecah dan memperlihatkan emas murni berkilau, penyesalan tak tertahankan membawanya terjun ke arus deras, disusul sang putri tercinta.',
      'Gundukan tanah yang tak pernah tenggelam oleh pasang Musi itu pun menjelma menjadi Pulau Kemaro—monumen cinta sejati lintas bangsa.'
    ],
    relic: {
      id: 'relic-kemaro',
      name: 'Guci Keramik Emas Sawi Asin',
      titlePalembang: 'Guci Emas Akulturasi Samudra',
      origin: 'Klenteng Hok Tjing Rio, Pulau Kemaro',
      imageIcon: 'gem',
      glowColor: '#ef4444',
      lore: 'Guci porselen berornamen naga dan bunga teratai berisi emas murni yang terangkat dari lumpur dasar Pulau Kemaro.',
      moralLesson: 'Jangan terburu-buru menghakimi sesuatu dari kulit luar sebelum memahami ketulusan yang tersimpan di dalamnya.',
      stcHash: '0xKEMARO...CINTA88B'
    },
    hotspots: [
      {
        id: 'hs-7',
        title: 'Pagoda Sembilan Tingkat',
        subtitle: 'Ikon Megah di Tengah Sungai',
        xPercent: 50,
        yPercent: 35,
        icon: 'landmark',
        description: 'Pagoda megah dengan arsitektur perpaduan khas Tionghoa-Palembang yang memantulkan cahaya lampion ke air sungai.',
        culturalNote: 'Pusat perayaan Cap Go Meh terbesar di Sumatera Selatan.'
      },
      {
        id: 'hs-8',
        title: 'Pohon Cinta Keramat',
        subtitle: 'Ikrar Kesetiaan Sejati',
        xPercent: 28,
        yPercent: 62,
        icon: 'heart',
        description: 'Pohon beringin tua yang dipercaya melambangkan janji suci Siti Fatimah dan Tan Bun An.',
        culturalNote: 'Banyak pasangan mengikatkan pita doa untuk kelanggengan hubungan mereka.'
      },
      {
        id: 'hs-9',
        title: 'Makam Berdampingan Tiga Pusara',
        subtitle: 'Siti Fatimah, Tan Bun An, & Sang Pengawal',
        xPercent: 72,
        yPercent: 65,
        icon: 'shield',
        description: 'Tiga makam bernuansa merah dan emas di dalam bangunan utama Klenteng Hok Tjing Rio.',
        culturalNote: 'Bukti tertulis toleransi dan pembauran damai masyarakat Palembang sejak ratusan tahun silam.'
      }
    ],
    historicalContext: 'Pulau Kemaro secara geologis adalah delta fluvial alami yang unik karena tidak pernah tenggelam meski air Sungai Musi sedang pasang besar (Kemaro bermakna kemarau/kering).'
  },
  {
    id: 'folklore-4',
    slug: 'si-pahit-lidah',
    title: 'Serunting Sakti: Si Pahit Lidah',
    subtitle: 'Kutukan Bertuah & Hikmah Tutur Kata di Tebing Lembah Musi',
    palembangQuote: '“Lidah itu taji beracun, sekali tesebut buruk biso jadi batu seumur idup.”',
    quoteMeaning: 'Lidah itu laksana taji beracun, sekali berucap buruk bisa menjadi batu seumur hidup.',
    locationName: 'Tepian Tebing Kuno Lembah Musi Rawas',
    coordinates: { lat: -3.0200, lng: 104.6800 },
    riverKm: 21.0,
    atmosphere: 'mystic-twilight',
    atmosphereLabel: 'Senja Lembah Magis (18:15 WIB)',
    ambientBgmFreq: 180,
    backdropVisual: {
      skyGradient: 'from-[#2b1008] via-[#1a0a14] to-[#0d0508]',
      waterTone: '#1e0c0f',
      mistIntensity: 0.5,
      keyLandmark: 'Tebing Cadas Berpahat Prasasti & Batu-Batu Menangis',
    },
    narrationScript: [
      'Di hulu bukit-bukit yang mengaliri anak Sungai Musi, hiduplah Raden Kumbang Sundang yang bergelar Pangeran Serunting Sakti.',
      'Setelah bertapa bertahun-tahun di bawah naungan pohon bambu kuning, tubuhnya ditembusi ilham gaib: setiap kata yang terucap dari lidahnya menjadi kenyataan.',
      'Orang kikir yang mencaci musafir dikutuknya membatu di tebing sungai, namun para petani miskin diberkatinya hamparan sawah subur yang menahan longsor perbukitan.',
      'Legenda Si Pahit Lidah mengingatkan seluruh keturunan tanah basah Musi: kesaktian tertinggi manusia bukanlah pada kekuatannya, melainkan pada kehati-hatian lidahnya.'
    ],
    relic: {
      id: 'relic-pahit-lidah',
      name: 'Prasasti Batu Menangis Serunting',
      titlePalembang: 'Batu Kutukan Pahit Lidah',
      origin: 'Kawasan Lembah Megalitik Pasemah & Rawas',
      imageIcon: 'scroll',
      glowColor: '#f97316',
      lore: 'Batu cadas andesit yang mengeluarkan tetesan air mirip air mata saat tersentuh hembusan angin lembah sungai.',
      moralLesson: 'Jaga tutur kata dan lidahmu; perkataan yang keluar adalah takdir yang tak dapat ditarik kembali.',
      stcHash: '0xSERUNTING...LIDAH55C'
    },
    hotspots: [
      {
        id: 'hs-10',
        title: 'Tebing Cadas Sumpah Batu',
        subtitle: 'Sosok Manusia Membatu',
        xPercent: 36,
        yPercent: 44,
        icon: 'mountain',
        description: 'Formasi batuan alami menyerupai postur orang yang memohon ampunan di bibir tebing Musi.',
        culturalNote: 'Dihubungkan dengan kebudayaan megalitikum tertua di Sumatera Selatan.'
      },
      {
        id: 'hs-11',
        title: 'Rumpun Bambu Kuning Sakti',
        subtitle: 'Tempat Semadi Raden Kumbang',
        xPercent: 68,
        yPercent: 55,
        icon: 'feather',
        description: 'Rumpun bambu berdesir yang konon menjadi saksi turunnya kesaktian sumpah lidah.',
        culturalNote: 'Bambu ini ditanam warga di tepi tebing untuk menahan abrasi arus sungai.'
      },
      {
        id: 'hs-12',
        title: 'Mata Air Hening Serunting',
        subtitle: 'Penawar Kutukan dan Hawa Panas',
        xPercent: 50,
        yPercent: 70,
        icon: 'droplets',
        description: 'Mata air jernih yang memancar dari sela batu padas dan mengalir tenang ke Sungai Musi.',
        culturalNote: 'Dimanfaatkan musafir untuk membersihkan diri sebelum berlayar jauh.'
      }
    ],
    historicalContext: 'Cerita Si Pahit Lidah tersebar luas di sepanjang DAS Musi dan dataran tinggi Besemah, kerap dikaitkan dengan peninggalan patung-patung megalit tertua Indonesia.'
  },
  {
    id: 'folklore-5',
    slug: 'buaya-buntung',
    title: 'Buaya Buntung Musi',
    subtitle: 'Perjanjian Gaib Raden Alit & Sahabat Para Nelayan Ketek',
    palembangQuote: '“Kalu kito bekawan samo alam, Buayo Buntung dak bakal ganggu perahu kito.”',
    quoteMeaning: 'Kalau kita bersahabat dengan alam, Buaya Buntung tak akan mengganggu perahu kita.',
    locationName: 'Rawa Pasang Surut Gandus & Muara Ogan',
    coordinates: { lat: -3.0110, lng: 104.7180 },
    riverKm: 9.3,
    atmosphere: 'emerald-dawn',
    atmosphereLabel: 'Fajar Zamrud Rawa (05:45 WIB)',
    ambientBgmFreq: 140,
    backdropVisual: {
      skyGradient: 'from-[#051a14] via-[#09261d] to-[#04100c]',
      waterTone: '#081c15',
      mistIntensity: 0.55,
      keyLandmark: 'Siluet Hutan Bakau Sungai & Rawa Pasang Surut Gandus',
    },
    narrationScript: [
      'Di hamparan rawa pasang surut tempat bertemunya Sungai Ogan dan Sungai Musi, ada penguasa perairan yang amat disegani.',
      'Konon seekor buaya raksasa berwarna putih keperakan dengan ekor buntung kerap muncul mengawal perahu-perahu nelayan yang terombang-ambing badai.',
      'Masyarakat meyakini ia adalah penjelmaan Raden Alit, bangsawan sakti yang mengikat sumpah darah untuk menjaga keturunan orang Musi yang jujur.',
      'Hingga kini, para pengemudi perahu ketek selalu melayangkan salam takzim saat melintasi muara rimbun, lambang harmoni mutlak antara manusia dan satwa penjaga sungai.'
    ],
    relic: {
      id: 'relic-buaya-buntung',
      name: 'Mustika Emas Penjaga Rawa Musi',
      titlePalembang: 'Mustika Kalung Raden Alit',
      origin: 'Muara Pertemuan Sungai Ogan & Musi',
      imageIcon: 'shield-check',
      glowColor: '#10b981',
      lore: 'Mustika permata bercahaya zamrud yang konon melingkar di leher Buaya Buntung. Menjadi simbol keselamatan bagi musafir perairan.',
      moralLesson: 'Jagalah ekosistem sungai dan jangan serakah; alam akan menjadi pelindung terbaik jika diperlakukan dengan welas asih.',
      stcHash: '0xRADEN...ALIT777D'
    },
    hotspots: [
      {
        id: 'hs-13',
        title: 'Muara Rawa Gandus',
        subtitle: 'Habitat Alami & Suaka Bakau',
        xPercent: 25,
        yPercent: 48,
        icon: 'trees',
        description: 'Kawasan mangrove air tawar yang lebat dengan akar tunjang kokoh penepis gelombang kapal besar.',
        culturalNote: 'Tempat bertelur ikan patin dan belida yang menjadi kekayaan kuliner khas Palembang.'
      },
      {
        id: 'hs-14',
        title: 'Beting Lumpur Siluman',
        subtitle: 'Tempat Berjemur Sang Penjaga',
        xPercent: 52,
        yPercent: 64,
        icon: 'eye',
        description: 'Gundukan pasir dan lumpur yang hanya terlihat ketika air Musi sedang surut terendah.',
        culturalNote: 'Nelayan percaya pantang melempar kotoran atau berteriak kasar saat melintasi beting ini.'
      },
      {
        id: 'hs-15',
        title: 'Rakit Perahu Nelayan Patin',
        subtitle: 'Kearifan Tangkap Tradisional',
        xPercent: 78,
        yPercent: 58,
        icon: 'anchor',
        description: 'Alat tangkap jaring rengge dan bubu bambu yang ramah lingkungan tanpa merusak biota dasar sungai.',
        culturalNote: 'Praktik kearifan lokal tangkap ikan berkelanjutan yang diwariskan lintas generasi.'
      }
    ],
    historicalContext: 'Legenda Buaya Buntung mencerminkan sistem kearifan lokal (tabu adat) yang menjaga habitat buaya muara dan hutan mangrove air tawar DAS Musi dari eksploitasi berlebihan.'
  }
];
