/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cleanAsterisks } from "../lib/utils";
import { MusiWeatherType } from "./musiAudioEngine";

export type StorytellerPersonaId = 'pengayuh-ketek' | 'kurator-sriwijaya' | 'dongeng-nusantara';

export interface StorytellerPersona {
  id: StorytellerPersonaId;
  name: string;
  roleTitle: string;
  avatarBg: string;
  voiceStyle: string;
  greetingExcerpt: string;
  description: string;
  pitch: number;
  rate: number;
}

export const STORYTELLER_PERSONAS: StorytellerPersona[] = [
  {
    id: 'pengayuh-ketek',
    name: 'Wak Seman',
    roleTitle: 'Tetua Pengayuh Ketek Sungai Musi',
    avatarBg: 'from-amber-700 to-amber-900',
    voiceStyle: 'Hangat, Berwibawa & Bergaya Tutur Lisan Palembang',
    greetingExcerpt: 'Apo kabar sanak dulur, mari duduk di buritan perahu ketek aku...',
    description: 'Nakhoda sepuh yang telah 45 tahun mendayung ketek menyusuri 750 km Sungai Musi. Menceritakan mitos pusaran palung air, suara mesin tempel, dan bisikan angin muson tempo dulu.',
    pitch: 0.92,
    rate: 0.92
  },
  {
    id: 'kurator-sriwijaya',
    name: 'Dr. Raden Sriwijaya',
    roleTitle: 'Kurator Akademik Arkeologi & Epigrafi',
    avatarBg: 'from-red-800 to-stone-900',
    voiceStyle: 'Ilmiah, Filologis & Sarat Data Arkeologis',
    greetingExcerpt: 'Berdasarkan telaah epigrafi prasasti abad ke-7 dan catatan I-Tsing...',
    description: 'Pakar sejarah maritim Nusantara lulusan arkeologi yang menelaah bukti fisik Prasasti Kedukan Bukit, arca Buddha Amarawati, geomorfologi aluvial, dan kronik perniagaan trans-samudera.',
    pitch: 1.05,
    rate: 1.0
  },
  {
    id: 'dongeng-nusantara',
    name: 'Bunda Kembang',
    roleTitle: 'Pencerita Dongeng Hikayat Nusantara',
    avatarBg: 'from-emerald-700 to-teal-900',
    voiceStyle: 'Melodius, Ramah Anak & Penuh Nilai Budi Pekerti',
    greetingExcerpt: 'Adik-adik manis dan sahabat budaya, dengarkanlah hikayat luhur ini...',
    description: 'Pencerita sastra lisan dengan tutur bahasa lembut yang menanamkan pesan moral welas asih, kerendahan hati, kejujuran, dan kecintaan pada tanah air Nusantara.',
    pitch: 1.15,
    rate: 0.95
  }
];

export interface MusiFolkloreTopic {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  landmarkKey: string;
  coreMoral: string;
}

export const MUSI_FOLKLORE_TOPICS: MusiFolkloreTopic[] = [
  {
    id: 'kembang-dadar',
    title: 'Putri Kembang Dadar di Bukit Siguntang',
    subtitle: 'Kesucian Jiwa & Asal Usul Tarian Gending Sriwijaya',
    location: 'Situs Bukit Siguntang',
    landmarkKey: 'siguntang',
    coreMoral: 'Kemuliaan budi pekerti dan keteguhan iman adalah pelindung hakiki yang tak terkalahkan senjata apa pun.'
  },
  {
    id: 'antu-banyu',
    title: 'Misteri Antu Banyu di Tiang Ampera',
    subtitle: 'Siluet Penjaga Palung Air & Kearifan Pasang Surut Musi',
    location: 'Palung Arus Jembatan Ampera',
    landmarkKey: 'ampera',
    coreMoral: 'Penghormatan terhadap hukum alam, jangan serakah dan takabur saat melayari perairan besar.'
  },
  {
    id: 'kemaro',
    title: 'Legenda Tan Bun An & Siti Fatimah di Pulau Kemaro',
    subtitle: 'Cinta Abadi di Antara Tujuh Guci Emas & Akulturasi Budaya',
    location: 'Delta Suci Pulau Kemaro',
    landmarkKey: 'kemaro',
    coreMoral: 'Prasangka buruk membawa penyesalan abadi; ketulusan cinta mampu menyatukan perbedaan bangsa dan budaya.'
  },
  {
    id: 'pahit-lidah',
    title: 'Kutukan Serunting Sakti Si Pahit Lidah',
    subtitle: 'Kekuatan Sabda Berbisa & Penyesalan Sang Pendekar',
    location: 'Tebing Cadas Pedalaman Musi',
    landmarkKey: 'siguntang',
    coreMoral: 'Lidah lebih tajam daripada pedang; gunakan ucapan untuk menebarkan kebajikan, bukan dendam.'
  },
  {
    id: 'buaya-buntung',
    title: 'Siluman Buaya Buntung / Raden Alit',
    subtitle: 'Pangeran Penjaga Muara & Sumpah Pelaut Sungai',
    location: 'Muara Pertemuan Musi & Ogan',
    landmarkKey: 'ketek',
    coreMoral: 'Kekayaan alam harus dijaga bersama; jangan merusak sungai yang telah memberi kehidupan berabad-abad.'
  }
];

export interface OralStoryResult {
  title: string;
  personaName: string;
  weatherAtmosphere: string;
  storyNarrative: string;
  localProverb: string;
  proverbMeaning: string;
  moralLesson: string;
  stcLedgerProof: string;
}

/**
 * Menghasilkan narasi tutur lisan dinamis berbasis persona dan atmosfer cuaca aktif di Diorama via server
 */
export async function generateMusiOralStory(params: {
  storyId: string;
  personaId: StorytellerPersonaId;
  weather: MusiWeatherType;
  customListenerContext?: string;
}): Promise<OralStoryResult> {
  const story = MUSI_FOLKLORE_TOPICS.find(s => s.id === params.storyId) || MUSI_FOLKLORE_TOPICS[0];
  const persona = STORYTELLER_PERSONAS.find(p => p.id === params.personaId) || STORYTELLER_PERSONAS[0];

  try {
    const response = await fetch('/api/storyteller/narrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const parsed = await response.json();
    return {
      title: cleanAsterisks(parsed.title || story.title),
      personaName: persona.name,
      weatherAtmosphere: params.weather,
      storyNarrative: cleanAsterisks(parsed.storyNarrative || ""),
      localProverb: cleanAsterisks(parsed.localProverb || "Kalu dak pacak nambahi, jangan merusaki."),
      proverbMeaning: cleanAsterisks(parsed.proverbMeaning || "Jika tidak mampu memperindah warisan luhur, jangan sekali-kali merusaknya."),
      moralLesson: cleanAsterisks(parsed.moralLesson || story.coreMoral),
      stcLedgerProof: cleanAsterisks(parsed.stcLedgerProof || `Terverifikasi sebagai warisan takbenda pada Smart Tourism Chain.`)
    };
  } catch (err) {
    console.warn("Fallback storyteller invoked:", err);
    return getFallbackOralStory(story, persona, params.weather);
  }
}

function getFallbackOralStory(
  story: MusiFolkloreTopic,
  persona: StorytellerPersona,
  weather: MusiWeatherType
): OralStoryResult {
  const weatherAtmospheres: Record<MusiWeatherType, string> = {
    senja: "Langit senja memerah tembaga, menyinari riak air Sungai Musi yang tenang.",
    purnama: "Cahaya rembulan purnama malam memantulkan bayangan tiang-tiang megah di atas air sungai.",
    kabut: "Kabut tebal melayang pelan di atas permukaan air, menciptakan hawa dingin mistis.",
    hujan: "Rintik hujan membasahi atap perahu ketek diiringi gemercik gelombang air pasang Musi."
  };

  if (persona.id === 'pengayuh-ketek') {
    return {
      title: `${story.title} - Tutur Lisan Wak Seman`,
      personaName: persona.name,
      weatherAtmosphere: weather,
      storyNarrative: `Apo kabar sanak dulurku sekalian. Mari duduk rapat di buritan ketek aku, rasakan goyangan perahu membelah riak air cokelat Sungai Musi.\n\n${weatherAtmospheres[weather]} Di perairan ini, orang tua-tua kito dari zaman bahari selalu berpesan, Sungai Musi ini punyo nyawa. Mengenai ${story.title}, ceritonyo bermula bukan sekadar dongeng pengantar tidur. Di ${story.location}, pangeran dan putri zaman dulu menancapkan sumpah yang sampai sekarang masih bergetar bila dinda perhatikan buih ombak di lambung perahu.\n\nPesan Wak Seman cuma satu, sanak: ${story.coreMoral} Hormatilah air yang memberi kito kehidupan, niscaya selamat pelayaran hidup kito sampai ke seberang.`,
      localProverb: "Kalu dak pacak nambahi, jangan merusaki; banyu tenang jangan disangko dak buayo.",
      proverbMeaning: "Jangan merusak apa yang sudah lestari, dan tetaplah waspada serta rendah hati di hadapan keagungan alam.",
      moralLesson: story.coreMoral,
      stcLedgerProof: `Simpul ${story.landmarkKey.toUpperCase()} tercatat secara permanen dalam Smart Tourism Chain Oral Folklore Ledger.`
    };
  }

  if (persona.id === 'kurator-sriwijaya') {
    return {
      title: `Kajian Epigrafi & Narasi: ${story.title}`,
      personaName: persona.name,
      weatherAtmosphere: weather,
      storyNarrative: `Selamat datang dalam telaah kritis kuratorial warisan bahari Sriwijaya.\n\n${weatherAtmospheres[weather]} Ketika menganalisis narasi ${story.title} yang berpusat di ${story.location}, kita sesungguhnya tidak hanya berhadapan dengan folklor lisan, melainkan sublimasi memori kolektif masyarakat talasokrasi abad ke-7 hingga era Kesultanan Palembang Darussalam.\n\nSebagaimana termaktub dalam korpus prasasti seperti Kedukan Bukit (683 M) dan manuskrip Sejarah Melayu, ritus perjalanan suci (siddhayatra) dan legitimasi spiritual kerap diwujudkan dalam alegori tokoh-tokoh sakral. Nilai filosofis yang dapat kita abstraksikan adalah: ${story.coreMoral}\n\nSIGUNTANG memosisikan memori budaya ini sebagai intangible digital asset yang diverifikasi integritasnya melalui konsensus blockchain STC.`,
      localProverb: "Niyata siddhayatra samriddha wanua Sriwijaya.",
      proverbMeaning: "Tercapailah perjalanan suci demi kemakmuran dan sentosanya negeri persatuan.",
      moralLesson: story.coreMoral,
      stcLedgerProof: `Katalog digital terverifikasi dengan hash kriptografi SHA-256 pada STC Heritage Node ${story.landmarkKey}.`
    };
  }

  // Bunda Kembang (Dongeng Anak Nusantara)
  return {
    title: `Hikayat Indah: ${story.title}`,
    personaName: persona.name,
    weatherAtmosphere: weather,
    storyNarrative: `Halo sahabat-sahabat kecil dan keluarga tercinta Nusantara. Sambut pelukan hangat angin Sungai Musi hari ini.\n\n${weatherAtmospheres[weather]} Pernahkah kalian membayangkan, betapa indahnya negeri kito Palembang zaman dahulu kala? Di ${story.location}, hiduplah kisah penuh teladan mengenai ${story.title}.\n\nKisah ini mengajarkan kito bahwa kebaikan hati dan kejujuran adalah harta karun paling berharga di dunia, jauh lebih berkilau daripada emas berlian tujuh guci di dasar sungai. ${story.coreMoral}\n\nMari kito jaga pusaka warisan nenek moyang ini dengan rasa bangga dan cinta kasih sesama saudara setanah air!`,
    localProverb: "Elok budi nian dikenang jua, bagai melati mekar di tepi musi.",
    proverbMeaning: "Kebaikan pekerti akan senantiasa dikenang harum sepanjang masa, laksana bunga melati yang mekar di tepian sungai.",
    moralLesson: story.coreMoral,
    stcLedgerProof: `Koleksi Dongeng Karakter Bangsa terenkripsi pada STC Protocol EIP-5192.`
  };
}

/**
 * Pemutar suara tutur lisan dengan penyesuaian pitch dan rate sesuai persona
 */
export function playOralStorySpeech(
  text: string,
  persona: StorytellerPersona,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return () => {};
  }

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[#*_~`]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .slice(0, 600);

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'id-ID';
  utterance.pitch = persona.pitch;
  utterance.rate = persona.rate;

  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
  if (idVoice) utterance.voice = idVoice;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
