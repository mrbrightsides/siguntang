/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface STCModule {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: 'Core & Middleware' | 'Trust & Identity' | 'Tourism Analytics & Impact' | 'Gas & Performance';
  roleInSiguntang: string;
  keyFeatures: string[];
  externalUrl?: string;
  badge: string;
  color: string;
  iconName: string;
  dissertationScope: string;
}

export const STC_ECOSYSTEM_MODULES: STCModule[] = [
  {
    id: 'stc-analytics',
    name: 'STC Analytics',
    shortName: 'Analytics',
    tagline: 'All-in-one Smart Contract Analyzer',
    description: 'Satu tempat buat melihat hasil analisa biaya gas (Vision), temuan keamanan (SWC), dan performa (Bench) dari suatu smart contract secara cepat, ringan, dan terstruktur.',
    category: 'Gas & Performance',
    roleInSiguntang: 'Memverifikasi keamanan kontrak registri node budaya dan estimasi konsumsi gas sebelum deployment ke testnet/mainnet.',
    keyFeatures: [
      'Multi-vector smart contract analysis',
      'Gas consumption profiling (GasVision)',
      'SWC vulnerability detection aggregator',
      'Benchmark performance tester'
    ],
    externalUrl: 'https://stc-analytics.streamlit.app/',
    badge: 'Security & Profiler',
    color: '#8b0000',
    iconName: 'Activity',
    dissertationScope: 'Evaluasi keandalan kode smart contract pariwisata terhadap standar keamanan industri.'
  },
  {
    id: 'stc-gasvision',
    name: 'STC GasVision',
    shortName: 'GasVision',
    tagline: 'Multi-Testnet Gas Monitor to Rupiah (IDR)',
    description: 'Memantau biaya gas transaksi di berbagai testnet (Sepolia, Goerli, Polygon Mumbai, Arbitrum Sepolia) dan mengonversinya secara presisi ke nilai Rupiah.',
    category: 'Gas & Performance',
    roleInSiguntang: 'Mengonversi gas fee saat pencatatan artefak dan donasi ke nilai Rupiah riil agar transparan bagi wisatawan dan pengelola situs.',
    keyFeatures: [
      'Monitoring multi-testnet (Sepolia, Goerli, Mumbai, Arbitrum)',
      'Konversi gas fee real-time ke mata uang Rupiah (IDR)',
      'Prediksi volatilitas gas untuk transaksi mikro pariwisata',
      'Visualisasi fluktuasi gwei vs fiat'
    ],
    externalUrl: 'https://stc-gasvision.streamlit.app/',
    badge: 'Gas Monitor',
    color: '#e67e22',
    iconName: 'Coins',
    dissertationScope: 'Kelayakan ekonomi transaksi on-chain mikro bagi sektor UMKM dan pariwisata Indonesia.'
  },
  {
    id: 'stc-converter',
    name: 'STC Converter',
    shortName: 'Converter',
    tagline: 'Mythril & Slither Security Output Transformer',
    description: 'Memudahkan konversi hasil analisis keamanan Smart Contract Blockchain, yang menggunakan tools seperti Mythril dan Slither dan menghasilkan static analyzer, ke dalam format yang lebih mudah terbaca untuk kepentingan analisis.',
    category: 'Trust & Identity',
    roleInSiguntang: 'Menyajikan laporan audit keamanan smart contract cagar budaya ke dalam format bahasa manusia bagi kurator dan akademisi.',
    keyFeatures: [
      'Parser otomatis output Mythril dan Slither static analyzer',
      'Formatting laporan audit ramah pemangku kepentingan',
      'Kategorisasi tingkat risiko (High, Medium, Low, Informational)',
      'Export ringkasan audit untuk sertifikasi orisinalitas'
    ],
    externalUrl: 'https://stc-converter.streamlit.app/',
    badge: 'Audit Parser',
    color: '#2980b9',
    iconName: 'FileCode',
    dissertationScope: 'Penyederhanaan hasil analisis keamanan formal smart contract bagi peneliti lintas disiplin.'
  },
  {
    id: 'stc-bench',
    name: 'STC Bench',
    shortName: 'Bench',
    tagline: 'Sepolia Performance & Gas Stress Testing',
    description: 'Memudahkan tes performa, analisa penggunaan gas, and optimisasi smart contracts di Sepolia testnet dalam simulasi beban transaksi tinggi.',
    category: 'Gas & Performance',
    roleInSiguntang: 'Pengujian ketahanan smart contract SIGUNTANG saat lonjakan donasi dan kunjungan festival budaya (e.g. Festival Sriwijaya).',
    keyFeatures: [
      'Stress testing throughput transaksi EVM',
      'Benchmarking opcode gas consumption',
      'Simulasi transaksi konkruen massal',
      'Optimasi byte-code contract deployment'
    ],
    externalUrl: 'https://stc-bench.elpeef.com/',
    badge: 'Stress Testing',
    color: '#16a085',
    iconName: 'Cpu',
    dissertationScope: 'Pengujian throughput dan latensi konsensus jaringan blockchain pariwisata saat peak season.'
  },
  {
    id: 'stc-insight',
    name: 'STC Insight',
    shortName: 'Insight',
    tagline: 'Tourism Transaction & Spatial Analytics Dashboard',
    description: 'Dashboard ini dirancang untuk membantu pelaku industri, peneliti, dan pengembang dalam mengeksplorasi data transaksi wisata secara cepat dan intuitif, mulai dari tren durasi inap, total biaya, hingga metode pembayaran dan status transaksi. Fitur: Interactive charts, CSV & NDJSON support, Configurable delimiter & decimal, Auto-generated heatmaps, dan template Dataset.',
    category: 'Tourism Analytics & Impact',
    roleInSiguntang: 'Memberikan visualisasi sebaran kunjungan antar simpul budaya Palembang dan pola interaksi wisatawan di sepanjang Sungai Musi.',
    keyFeatures: [
      'Interactive charts (durasi inap, total biaya, tren pembayaran)',
      'Dukungan impor file format CSV & NDJSON',
      'Configurable delimiter & desimal formatting lokal',
      'Auto-generated heatmaps spasial kunjungan wisata',
      'Template dataset pariwisata terstandar'
    ],
    externalUrl: 'https://stc-insight.elpeef.com/',
    badge: 'Big Data Tourism',
    color: '#8e44ad',
    iconName: 'BarChart3',
    dissertationScope: 'Model eksplorasi transaksi wisatawan dan perilaku mobilitas spasial berbasis data terverifikasi.'
  },
  {
    id: 'stc-gasx',
    name: 'STC GasX',
    shortName: 'GasX',
    tagline: 'On-Chain VS Off-Chain Gas & Market Arbitrage',
    description: 'Menganalisa biaya gas on-chain VS off-chain dan membandingkannya dengan biaya transaksi real-time market data dalam visualisasi profesional.',
    category: 'Gas & Performance',
    roleInSiguntang: 'Menentukan kapan metadata artefak harus langsung dicatat on-chain vs di-batch secara off-chain demi efisiensi biaya operasional.',
    keyFeatures: [
      'Komparasi langsung overhead on-chain vs off-chain storage',
      'Integrasi data pasar harga token dan gas secara real-time',
      'Visualisasi rasio efisiensi biaya penyimpanan data budaya',
      'Model rekomendasi batching transaksi'
    ],
    externalUrl: 'https://stc-gasx.elpeef.com/',
    badge: 'Cost Arbitrage',
    color: '#d35400',
    iconName: 'Scale',
    dissertationScope: 'Analisis efisiensi biaya penyimpanan data historis pada layer-1 vs layer-2 vs off-chain storage.'
  },
  {
    id: 'stc-carbonprint',
    name: 'STC CarbonPrint',
    shortName: 'CarbonPrint',
    tagline: 'Blockchain Gas Emission & FOLU Net Sink 2030 Tool',
    description: 'Modul turunan dari ekosistem SmartTourismChain (STC) yang berfokus pada pengukuran dan visualisasi jejak karbon. Dibangun dari Carbon Layer di ImpactViz, CarbonPrint berkembang menjadi tool mandiri yang dapat digunakan untuk riset, edukasi, hingga perencanaan kebijakan lingkungan—baik di sektor pariwisata maupun industri lainnya. Dengan CarbonPrint, data gas fee blockchain diterjemahkan menjadi angka nyata emisi karbon, sehingga memudahkan langkah mitigasi menuju target FOLU Net Sink 2030 dan tujuan SDGs.',
    category: 'Tourism Analytics & Impact',
    roleInSiguntang: 'Mengukur dampak emisi komputasi transaksi digital serta jejak karbon rute wisata perahu Ketek Sungai Musi.',
    keyFeatures: [
      'Penerjemahan gas fee blockchain menjadi metrik emisi karbon riil (kgCO2e)',
      'Penyelarasan target FOLU Net Sink 2030 Indonesia',
      'Metrik kepatuhan SDGs PBB (Goal 12, 13, & 14)',
      'Alat perencanaan kebijakan pariwisata rendah karbon',
      'Modul edukasi lingkungan bagi komunitas lokal'
    ],
    externalUrl: 'https://stc-carbonprint.elpeef.com/',
    badge: 'FOLU Net Sink 2030',
    color: '#27ae60',
    iconName: 'Leaf',
    dissertationScope: 'Formulasi mitigasi dampak ekologis infrastruktur komputasi desentralisasi pariwisata.'
  },
  {
    id: 'stc-impactviz',
    name: 'STC ImpactViz',
    shortName: 'ImpactViz',
    tagline: 'Triple Bottom Line (People, Planet, Prosperity) Dashboard',
    description: 'Dashboard analitik berbasis blockchain yang membantu memetakan dampak ekonomi, sosial, dan lingkungan dari aktivitas pariwisata digital. Dengan pendekatan triple bottom line, ImpactViz menyajikan data yang transparan, terukur, dan mudah dipahami untuk semua pihak—mulai dari akademisi, pelaku industri, hingga pemerintah. Kini, dengan tambahan Carbon Layer, ImpactViz juga mampu menampilkan jejak karbon dari setiap transaksi digital, menjadikannya sebagai alat penting menuju pariwisata berkelanjutan.',
    category: 'Tourism Analytics & Impact',
    roleInSiguntang: 'Menyediakan dasbor dampak pelestarian terpadu bagi Pemkot Palembang, pengelola situs, dan akademisi.',
    keyFeatures: [
      'Framework Triple Bottom Line (Ekonomi, Sosial Budaya, Lingkungan)',
      'Integrasi Carbon Layer langsung dari aktivitas digital',
      'Transparansi multi-stakeholder (Pemerintah, Peneliti, Industri)',
      'Tracking kesejahteraan pengrajin lokal dan komunitas heritage'
    ],
    externalUrl: 'https://stc-impactviz.elpeef.com/',
    badge: 'Triple Bottom Line',
    color: '#2c3e50',
    iconName: 'PieChart',
    dissertationScope: 'Konseptualisasi evaluasi dampak pariwisata holistik berbantuan distributed ledger technology.'
  },
  {
    id: 'stc-connect',
    name: 'STC Connect',
    shortName: 'Connect',
    tagline: 'Middleware API & IoT-Blockchain Gateway',
    description: 'Middleware API yang menjadi jembatan antara aplikasi, perangkat IoT, dan blockchain dalam ekosistem SmartTourismChain (STC). Didesain agar developer dan researcher dapat dengan mudah mengintegrasikan fitur on-chain maupun off-chain ke dalam sistem mereka tanpa harus menulis kode blockchain yang kompleks.',
    category: 'Core & Middleware',
    roleInSiguntang: 'Jembatan API yang menghubungkan frontend SIGUNTANG, sensor gerbang dermaga, dan smart contract STC.',
    keyFeatures: [
      'REST & JSON-RPC abstraction bridge untuk Web3',
      'Konektivitas sensor IoT dermaga (RFID, turnstile counter)',
      'Pengelolaan nonce transaksi otomatis dan gas relaying',
      'SDK ringan untuk pengembang aplikasi pariwisata daerah'
    ],
    externalUrl: 'https://stc-connect.elpeef.com/',
    badge: 'Middleware Gateway',
    color: '#34495e',
    iconName: 'Network',
    dissertationScope: 'Arsitektur middleware perantara perangkat fisik pariwisata (IoT) dengan konsensus blockchain.'
  },
  {
    id: 'stc-kyc',
    name: 'KYC by STC',
    shortName: 'KYC / SSI',
    tagline: 'Self-Sovereign Identity (SSI) & Verifiable Credentials',
    description: 'Platform identitas digital berbasis blockchain yang dirancang khusus untuk pelaku industri pariwisata. Dengan teknologi Self-Sovereign Identity (SSI) dan Verifiable Credentials, platform ini menyediakan proses verifikasi identitas yang cepat, aman, dan transparan.',
    category: 'Trust & Identity',
    roleInSiguntang: 'Memverifikasi identitas maestro songket binaan, pemandu wisata musian, dan kurator cagar budaya Palembang.',
    keyFeatures: [
      'Self-Sovereign Identity (SSI) architecture',
      'Verifiable Credentials untuk lisensi pengrajin dan pemandu',
      'Perlindungan privasi data wisatawan (Zero-Knowledge principles)',
      'Verifikasi kepemilikan aset budaya nir-pihak ketiga'
    ],
    externalUrl: 'https://kyc.elpeef.com/',
    badge: 'Self-Sovereign Identity',
    color: '#1abc9c',
    iconName: 'Fingerprint',
    dissertationScope: 'Model identitas terdesentralisasi ramah privasi untuk ekosistem perjalanan dan kerajinan lokal.'
  },
  {
    id: 'stc-auditour',
    name: 'AudiTour by STC',
    shortName: 'AudiTour',
    tagline: 'Tourism Booking Provenance & Service Audit Trail',
    description: 'Platform audit jejak digital pariwisata (booking, payment, customer service) yang mencatat histori tak terbantahkan dengan timestamp terdesentralisasi, memastikan akuntabilitas operasional pariwisata.',
    category: 'Trust & Identity',
    roleInSiguntang: 'Menjamin bukti riwayat donasi situs religi dan validitas reservasi pelayaran perahu ketek Sungai Musi.',
    keyFeatures: [
      'Immutable booking & transaction logging',
      'Jejak audit layanan wisatawan (SLA tracking)',
      'Dispute resolution cryptographic evidence',
      'Sinkronisasi timestamp terdistribusi'
    ],
    externalUrl: 'https://auditour.elpeef.com/',
    badge: 'Audit Trail',
    color: '#7f8c8d',
    iconName: 'ShieldCheck',
    dissertationScope: 'Mekanisme audit jejak transaksi dan rekonsiliasi sengketa operasional pariwisata cerdas.'
  },
  {
    id: 'stc-ultimate',
    name: 'STC Ultimate',
    shortName: 'Ultimate',
    tagline: 'Comprehensive Smart Tourism Engine & Escrow',
    description: 'Platform komprehensif smart tourism yang mengintegrasikan smart contracts, escrow, RFID & QR, dan konektivitas pelaku wisata (tiket, hotel, kuliner lokal, kriya songket) dalam satu ekosistem terpadu.',
    category: 'Core & Middleware',
    roleInSiguntang: 'Platform payung yang menyatukan simpul budaya SIGUNTANG dengan rantai nilai ekonomi wisata Palembang.',
    keyFeatures: [
      'End-to-end smart tourism enterprise framework',
      'Automated escrow contract untuk keamanan transaksi wisata',
      'Integrasi tiket digital QR & RFID kartu pas budaya',
      'Ekosistem multi-vendor terdesentralisasi (kuliner, kriya, atraksi)'
    ],
    externalUrl: 'https://stc-ultimate.elpeef.com/',
    badge: 'Master Suite',
    color: '#8b0000',
    iconName: 'Layers',
    dissertationScope: 'Sistem terpadu arsitektur pariwisata masa depan berbasis multi-layer blockchain.'
  }
];

export const DISSERTATION_RESEARCH_INFO = {
  institution: 'Universitas Sriwijaya',
  author: 'Dr. / Peneliti Smart Tourism Chain (STC)',
  title: 'Smart Tourism Chain (STC): Blockchain Framework for Sustainable Tourism & Cultural Heritage Traceability',
  tagline: 'Kajian Disertasi Doktor tentang Blockchain di Dunia Pariwisata',
  coreThesis: 'Menjawab tantangan keaslian data budaya, efisiensi transaksi mikro, transparansi donasi cagar budaya, serta mitigasi dampak lingkungan (FOLU Net Sink 2030) melalui integrasi DLT dan IoT di sektor pariwisata.',
  ecosystemShowcaseUrl: 'https://showcase.elpeef.com'
};
