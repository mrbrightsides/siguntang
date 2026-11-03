/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  QrCode,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { HERITAGE_QUIZ_QUESTIONS, QuizQuestion } from '../data/heritageQuizData';
import { WalletState } from '../services/blockchainService';

interface HeritageQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet?: WalletState | null;
  onOpenMintSBT?: () => void;
}

export function HeritageQuizModal({
  isOpen,
  onClose,
  wallet,
  onOpenMintSBT
}: HeritageQuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [recipientName, setRecipientName] = useState(wallet?.address ? `Sahabat Sriwijaya (${wallet.address.slice(0, 6)}...)` : 'Penjaga Budaya Wong Kito');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentQ: QuizQuestion = HERITAGE_QUIZ_QUESTIONS[currentIndex];
  const certificateRef = useRef<HTMLDivElement>(null);

  // Generate QR Code for certificate validation
  const certSerial = `STC-SRIW-2026-${Math.abs(recipientName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1024))}`;
  const verificationUrl = `https://siguntang.vercel.app/verify/cert/${certSerial}`;

  useEffect(() => {
    if (!quizFinished) return;
    QRCode.toDataURL(verificationUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#1a140d',
        light: '#ffffff00'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error("Error generating quiz cert QR:", err));
  }, [quizFinished, verificationUrl]);

  if (!isOpen) return null;

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < HERITAGE_QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCertificate = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 1800;
      canvas.height = 1200;

      // Background Parchment
      ctx.fillStyle = '#faf6ee';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer & Inner Borders
      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      // Corner Ornaments
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(0, 0, 30, 6);
        ctx.fillRect(0, 0, 6, 30);
        ctx.restore();
      };
      drawCorner(70, 70, 0);
      drawCorner(canvas.width - 70, 70, Math.PI / 2);
      drawCorner(canvas.width - 70, canvas.height - 70, Math.PI);
      drawCorner(70, canvas.height - 70, -Math.PI / 2);

      // Watermark Text
      ctx.save();
      ctx.font = 'bold 160px serif';
      ctx.fillStyle = 'rgba(139, 0, 0, 0.03)';
      ctx.textAlign = 'center';
      ctx.fillText('SRIWIJAYA', canvas.width / 2, canvas.height / 2 + 50);
      ctx.restore();

      // Header Texts
      ctx.fillStyle = '#8b0000';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('KONSORSIUM CAGAR BUDAYA PALEMBANG & STC PROTOCOL', canvas.width / 2, 130);

      ctx.fillStyle = '#c5a059';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('DISETUJUI SEBAGAI DUTA KEHORMATAN PELESTARI CAGAR BUDAYA NUSANTARA', canvas.width / 2, 165);

      ctx.fillStyle = '#1a140d';
      ctx.font = 'bold 54px serif';
      ctx.fillText('PIAGAM DUTA CAGAR BUDAYA SRIWIJAYA', canvas.width / 2, 240);

      ctx.fillStyle = '#555';
      ctx.font = 'italic 20px serif';
      ctx.fillText('Dengan rasa bangga dan penghormatan setinggi-tingginya, piagam ini dianugerahkan kepada:', canvas.width / 2, 300);

      // Recipient Name
      ctx.fillStyle = '#8b0000';
      ctx.font = 'bold 44px serif';
      ctx.fillText(recipientName || 'Sahabat Sriwijaya', canvas.width / 2, 380);

      // Underline recipient
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 250, 405);
      ctx.lineTo(canvas.width / 2 + 250, 405);
      ctx.stroke();

      // Body text
      ctx.fillStyle = '#2b2621';
      ctx.font = '20px serif';
      const bodyLines = [
        'Atas keberhasilan menyelesaikan Tantangan Uji Sahabat Sriwijaya dengan pemahaman',
        'mendalam mengenai sejarah kemaritiman, filosofi Kesultanan Palembang Darussalam, kriya kain songket,',
        'serta komitmen menjaga kedaulatan budaya melalui ekosistem digital terdesentralisasi SIGUNTANG.'
      ];
      bodyLines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, 470 + (i * 32));
      });

      // Score Badge & Serial
      ctx.fillStyle = '#8b0000';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`NILAI KELULUSAN: ${score} / ${HERITAGE_QUIZ_QUESTIONS.length} (${Math.round((score / HERITAGE_QUIZ_QUESTIONS.length) * 100)}%)`, canvas.width / 2, 590);

      ctx.fillStyle = '#666';
      ctx.font = '16px monospace';
      ctx.fillText(`NOMOR SERI PIAGAM: ${certSerial} | STC-PROOF-OF-KNOWLEDGE`, canvas.width / 2, 630);

      // Ancient Inscription Quote
      ctx.fillStyle = '#7a5a2d';
      ctx.font = 'italic 18px serif';
      ctx.fillText('“Siddhayatra subhiksa—Perjalanan suci demi kemakmuran dan keluhuran budi pekerti peradaban.”', canvas.width / 2, 690);

      // Signatures & Seals
      const ySig = 800;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1a140d';
      ctx.font = 'bold 18px serif';
      ctx.fillText('Pangeran Kesultanan & Majelis Adat', 160, ySig);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('Lembaga Adat Melayu Palembang', 160, ySig + 24);
      ctx.fillText('Tanda Pengesahan Adat Karuhun', 160, ySig + 48);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#1a140d';
      ctx.font = 'bold 18px serif';
      ctx.fillText('STC Smart Tourism Protocol', canvas.width - 160, ySig);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('Kajian Doktoral Disertasi UNSRI', canvas.width - 160, ySig + 24);
      ctx.fillText('On-Chain Cryptographic Verifier', canvas.width - 160, ySig + 48);

      // Embed QR Code
      if (qrCodeDataUrl) {
        const qrImg = new Image();
        qrImg.src = qrCodeDataUrl;
        await new Promise((res) => { qrImg.onload = res; });
        ctx.drawImage(qrImg, canvas.width / 2 - 70, ySig - 50, 140, 140);
        ctx.fillStyle = '#8b0000';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN VERIFIKASI ON-CHAIN', canvas.width / 2, ySig + 110);
      }

      // Download trigger
      const link = document.createElement('a');
      link.download = `Piagam_Duta_Cagar_Budaya_${recipientName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[6500] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-3xl bg-[#181412] text-[#f5f2ed] border border-amber-500/30 rounded-[32px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-amber-900/30 bg-gradient-to-r from-[#241712] via-[#1a120e] to-[#241712] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-amber-400">
                  Tantangan Edukasi Sejarah & Kriya
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-semibold">
                  Sertifikat On-Chain
                </span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                Uji Sahabat Sriwijaya
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto">
          {!quizFinished ? (
            /* QUIZ IN PROGRESS */
            <div className="space-y-6">
              {/* Progress Bar & Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">
                    Pertanyaan {currentIndex + 1} dari {HERITAGE_QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-gray-400">
                    Skor Sementara: {score} Poin
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-[#8b0000] transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / HERITAGE_QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="p-5 bg-black/40 border border-amber-500/20 rounded-2xl">
                <p className="font-serif text-lg md:text-xl text-white font-medium leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let optionStyle = 'bg-black/20 hover:bg-black/40 border-white/10 text-gray-300 hover:border-amber-500/40';
                  if (showExplanation) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      optionStyle = 'bg-black/10 border-white/5 text-gray-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-amber-950/40 border-amber-500 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer text-sm font-sans ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {showExplanation && (
                        <div>
                          {isCorrect && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                          {!isCorrect && isSelected && <XCircle size={18} className="text-rose-400 shrink-0" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Insight Box */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    {selectedOption === currentQ.correctIndex ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        ✓ Tepat Sekali!
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                        Kunci Jawaban: {String.fromCharCode(65 + currentQ.correctIndex)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {currentQ.explanation}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-xs text-amber-200/90 font-serif italic">
                    <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>Mutiara Budaya: {currentQ.culturalInsight}</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                    >
                      <span>{currentIndex < HERITAGE_QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil & Piagam'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* QUIZ FINISHED: RESULTS & CERTIFICATE */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Score Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 mb-2">
                  <Award size={32} />
                </div>
                <h3 className="font-serif text-3xl font-bold text-white">
                  Selamat! Anda Dinobatkan Sebagai
                </h3>
                <p className="font-serif italic text-xl text-amber-300">
                  “Duta Cagar Budaya Sriwijaya”
                </p>
                <p className="text-xs font-mono text-gray-400">
                  Skor Anda: {score} dari {HERITAGE_QUIZ_QUESTIONS.length} Soal Terjawab Benar ({Math.round((score / HERITAGE_QUIZ_QUESTIONS.length) * 100)}%)
                </p>
              </div>

              {/* Recipient Name Customizer */}
              <div className="max-w-md mx-auto p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                <label className="text-[11px] font-mono text-gray-400 uppercase font-bold block">
                  Nama Penerima pada Piagam Penghargaan:
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ketik Nama Anda / Instansi..."
                  className="w-full px-4 py-2 bg-black/60 border border-amber-500/40 rounded-xl text-sm text-white font-serif focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Physical Certificate Live Preview */}
              <div 
                ref={certificateRef}
                className="bg-[#faf6ee] text-[#1a140d] border-4 border-[#8b0000] p-6 sm:p-8 rounded-2xl relative shadow-2xl space-y-6"
              >
                <div className="border border-[#c5a059] p-4 sm:p-6 rounded-lg relative">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8b0000] block">
                      KONSORSIUM CAGAR BUDAYA PALEMBANG & STC PROTOCOL
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#1a140d]">
                      PIAGAM DUTA CAGAR BUDAYA SRIWIJAYA
                    </h4>
                    <p className="text-xs font-serif italic text-gray-600">
                      Diberikan kepada:
                    </p>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#8b0000] border-b border-[#c5a059] inline-block px-8 py-1">
                      {recipientName || 'Sahabat Sriwijaya'}
                    </p>
                  </div>

                  <p className="text-xs font-serif text-center text-gray-700 max-w-lg mx-auto mt-4 leading-relaxed">
                    Telah membuktikan kecintaan dan pemahaman sejarah kemaritiman Sriwijaya, Kesultanan Palembang Darussalam, kriya kain songket, serta mendukung kedaulatan budaya digital SIGUNTANG.
                  </p>

                  <div className="mt-6 pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left text-[11px] font-mono text-gray-600">
                      <div>ID Piagam: <span className="font-bold text-[#8b0000]">{certSerial}</span></div>
                      <div>Status: <span className="text-emerald-700 font-bold">Terverifikasi On-Chain</span></div>
                    </div>

                    {qrCodeDataUrl && (
                      <div className="flex items-center gap-2">
                        <img src={qrCodeDataUrl} alt="QR Verifikasi" className="w-16 h-16 border border-black/10 rounded" />
                        <div className="text-[9px] font-mono text-gray-500">
                          Scan untuk<br/>validasi sertifikat
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleDownloadCertificate}
                  disabled={isDownloading}
                  className="px-6 py-3 bg-[#8b0000] hover:bg-[#a00000] text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#8b0000]/25 active:scale-95"
                >
                  <Download size={15} />
                  <span>{isDownloading ? 'Menyiapkan...' : 'Unduh Piagam (Resolusi Tinggi PNG)'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Printer size={15} />
                  <span>Cetak Piagam</span>
                </button>

                {onOpenMintSBT && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMintSBT();
                    }}
                    className="px-5 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ShieldCheck size={15} className="text-amber-400" />
                    <span>Klaim Badge SBT On-Chain</span>
                  </button>
                )}

                <button
                  onClick={handleRestart}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Ulangi Kuis</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
