/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  culturalInsight: string;
}

export const HERITAGE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Menurut inskripsi Prasasti Kedukan Bukit (683 Masehi), siapakah nama penguasa pendiri peradaban wanua Sriwijaya yang memimpin ekspedisi 20.000 bala tentara di muara Sungai Musi?',
    options: [
      'Dapunta Hyang Sri Jayanasa',
      'Sultan Mahmud Badaruddin II',
      'Arya Damar',
      'Balaputradewa'
    ],
    correctIndex: 0,
    explanation: 'Dapunta Hyang Sri Jayanasa memimpin ekspedisi suci (samaryatra) pada bulan Waisak 605 Saka (16 Juni 683 M) membawa 20.000 pasukan dan 200 peti perbekalan menuju Palembang.',
    culturalInsight: 'Prasasti Kedukan Bukit adalah bukti tertulis tertua tentang eksistensi kerajaan maritim Sriwijaya yang ditemukan di muara Tatang, Palembang.'
  },
  {
    id: 2,
    question: 'Mengapa benteng pertahanan maritim keraton Benteng Kuto Besak (BKB) yang selesai dibangun tahun 1797 memiliki dinding batu sangat kokoh menghadapi gempuran meriam VOC?',
    options: [
      'Dinding batunya direkatkan adukan kapur tohor dan putih telur tanpa semen modern',
      'Didatangkan balok baja utuh dari benua Eropa oleh pedagang Inggris',
      'Seluruh benteng dibuat dari kayu gelondongan ulin tanpa paku',
      'Dilapisi timah murni dari tambang Pulau Bangka setebal setengah meter'
    ],
    correctIndex: 0,
    explanation: 'Benteng Kuto Besak dibangun atas inisiatif Sultan Muhammad Bahauddin dan Sultan Mahmud Badaruddin II. Dinding batu setinggi 9,99 meter direkatkan memakai racikan alami batu kapur tohor dan ribuan butir putih telur.',
    culturalInsight: 'BKB merupakan satu-satunya benteng keraton di Indonesia yang dibangun murni oleh arsitek pribumi Kesultanan Palembang Darussalam tanpa campur tangan arsitek kolonial.'
  },
  {
    id: 3,
    question: 'Dalam hierarki tradisi kriya Kesultanan Palembang, apakah nama motif kain songket paling sakral dan mulia (Tingkat Mahkota/Ratu) di mana benang emas menutupi hampir 100% permukaan kain?',
    options: [
      'Songket Lepus Berekam (Lepus Berlian)',
      'Songket Limar Sekar Mawar',
      'Songket Bunga Pacik',
      'Songket Cantik Manis'
    ],
    correctIndex: 0,
    explanation: 'Songket Lepus Berekam menempati derajat tertinggi dalam busana kebesaran Aesan Gede. Kata "Lepus" berarti tertutup rapat, di mana benang emas jantun menutupi seluruh serat sutra tanpa menyisakan ruang kosong.',
    culturalInsight: 'Kain Lepus melambangkan keagungan absolut dan kemurnian jiwa pemimpin yang memancarkan kemuliaan budi pekerti laksana emas murni Suvarnadvipa.'
  },
  {
    id: 4,
    question: 'Apa nama delta suci di tengah perairan Sungai Musi yang tidak pernah tenggelam oleh pasang surut air, tempat berdirinya Pagoda 9 Tingkat dan kisah cinta legendaris Tan Bun An & Siti Fatimah?',
    options: [
      'Pulau Kemaro',
      'Pulau Berhala',
      'Bukit Siguntang',
      'Kampung Kapitan'
    ],
    correctIndex: 0,
    explanation: 'Pulau Kemaro berasal dari kata "Kemarau" karena pulau delta seluas 30 hektar ini tak pernah terendam air kendati Sungai Musi meluap tinggi. Pulau ini menjadi saksi toleransi dan kerukunan Tionghoa-Melayu sejak berabad lampau.',
    culturalInsight: 'Kisah cinta abadi Tan Bun An dan Siti Fatimah di Pulau Kemaro mengajarkan tentang pengorbanan, kesetiaan, dan persaudaraan lintas budaya di tepian Musi.'
  },
  {
    id: 5,
    question: 'Bagaimanakah protokol blockchain STC (Smart Tourism Chain) dan SIGUNTANG melindungi para pengrajin tenun songket tradisional di Kampung Tuan Kentang?',
    options: [
      'Menerbitkan sertifikat keaslian kriptografi ganda (on-chain & fisik QR) serta melacak jejak ramah lingkungan pewarna alami FOLU Net Sink 2030',
      'Mengganti seluruh alat tenun gedogan manual dengan mesin bordir komputer industri',
      'Membatasi masyarakat umum agar tidak boleh lagi memakai kain songket',
      'Menghapus nama-nama motif kuno demi standardisasi pasar ekspor'
    ],
    correctIndex: 0,
    explanation: 'SIGUNTANG & protokol STC menyematkan stempel kriptografis anti-pemalsuan untuk setiap helai kain buatan maestro penenun lokal, mengamankan hak cipta motif adat sekaligus memvalidasi pewarna alami tanpa limbah kimia.',
    culturalInsight: 'Teknologi desentralisasi Web3 diberdayakan bukan untuk mengganti tradisi, melainkan menjadi perisai kedaulatan kriya warisan leluhur Wong Kito.'
  }
];
