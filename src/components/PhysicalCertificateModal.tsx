/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  QrCode,
  FileCheck2,
  Copy
} from 'lucide-react';
import QRCode from 'qrcode';

export interface PhysicalCertificateData {
  recipientName: string;
  title: string;
  category: string;
  nodeName?: string;
  oldMalayText?: string;
  pallawaScript?: string;
  indonesianTranslation?: string;
  curseProtectionFormula?: string;
  txHash: string;
  tokenId?: number | string;
  explorerUrl?: string;
  ipfsUri?: string;
  mintDate?: string;
}

interface PhysicalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PhysicalCertificateData | null;
}

export function PhysicalCertificateModal({
  isOpen,
  onClose,
  data
}: PhysicalCertificateModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGeneratingDownload, setIsGeneratingDownload] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const verificationUrl = data?.explorerUrl || 
    (data?.txHash ? `https://sepolia.etherscan.io/tx/${data.txHash}` : 'https://siguntang.vercel.app');

  const displayTokenId = data?.tokenId ? `#STC-${String(data.tokenId).padStart(4, '0')}` : '#STC-5192-PROV';
  const displayDate = data?.mintDate || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Generate high-resolution QR code
  useEffect(() => {
    if (!isOpen || !verificationUrl) return;

    QRCode.toDataURL(verificationUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#1a140d',
        light: '#ffffff00' // transparent background
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error("Gagal generate QR code:", err));
  }, [isOpen, verificationUrl]);

  if (!isOpen || !data) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // High-Resolution 2400x1680 Canvas Image Exporter
  const handleDownloadImage = async () => {
    setIsGeneratingDownload(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Gagal menginisialisasi canvas context");

      // 300 DPI Landscape A4 Proportion (2400 x 1680)
      canvas.width = 2400;
      canvas.height = 1680;

      // 1. Latar Belakang Perkamen Emas Tua (Aged Royal Ivory Parchment)
      const gradBg = ctx.createLinearGradient(0, 0, 2400, 1680);
      gradBg.addColorStop(0, '#fbf7ee');
      gradBg.addColorStop(0.5, '#f4ece0');
      gradBg.addColorStop(1, '#ebe0d0');
      ctx.fillStyle = gradBg;
      ctx.fillRect(0, 0, 2400, 1680);

      // Tekstur halus perkamen
      ctx.fillStyle = 'rgba(139, 69, 19, 0.03)';
      for (let i = 0; i < 4000; i++) {
        const rx = Math.random() * 2400;
        const ry = Math.random() * 1680;
        ctx.fillRect(rx, ry, 2, 2);
      }

      // 2. Bingkai Emas Ganda & Motif Songket Palembang
      // Outer border
      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = 14;
      ctx.strokeRect(60, 60, 2280, 1560);

      // Inner gold border
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 6;
      ctx.strokeRect(84, 84, 2232, 1512);

      // Thin inner boundary
      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 100, 2200, 1480);

      // Sudut Ornamen Hiasan Songket (Corner Motifs)
      const drawCorner = (cx: number, cy: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = '#c59b27';
        ctx.fillStyle = '#8b0000';
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(80, 0);
        ctx.lineTo(80, 25);
        ctx.lineTo(25, 25);
        ctx.lineTo(25, 80);
        ctx.lineTo(0, 80);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(40, 40, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawCorner(100, 100, 0);
      drawCorner(2300, 100, Math.PI / 2);
      drawCorner(2300, 1580, Math.PI);
      drawCorner(100, 1580, -Math.PI / 2);

      // 3. Header Institusi & Logo Konsorsium
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8b0000';
      ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('KONSORSIUM PELESTARIAN CAGAR BUDAYA MARITIM NUSANTARA', 1200, 180);

      ctx.fillStyle = '#5c4838';
      ctx.font = '600 24px "Cinzel", "Times New Roman", serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('SMART TOURISM CHAIN (STC) PROTOCOL • RISET DOKTORAL UNIVERSITAS BINA DARMA', 1200, 225);

      // Garis ornamen pemisah header
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(700, 260);
      ctx.lineTo(1700, 260);
      ctx.stroke();

      // Bintang emas tengah pemisah
      ctx.fillStyle = '#8b0000';
      ctx.beginPath();
      ctx.arc(1200, 260, 8, 0, Math.PI * 2);
      ctx.fill();

      // 4. Judul Piagam
      ctx.fillStyle = '#1c150d';
      ctx.font = 'bold 58px "Cinzel", "Georgia", serif';
      ctx.letterSpacing = '4px';
      ctx.fillText(data.title.toUpperCase(), 1200, 350);

      // 5. Teks Pengantar
      ctx.fillStyle = '#6b5744';
      ctx.font = 'italic 30px "Times New Roman", serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('Dengan memuliakan keluhuran peradaban Sriwijaya dan kesucian air Sungai Musi, disahkan kepada:', 1200, 430);

      // 6. Nama Penerima (Besar, Agung, Bertinta Emas & Merah Keraton)
      ctx.fillStyle = '#8b0000';
      ctx.font = 'bold 74px "Cinzel", "Georgia", serif';
      ctx.letterSpacing = '3px';
      ctx.fillText(data.recipientName.toUpperCase(), 1200, 530);

      // Garis dekoratif bawah nama
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(600, 560);
      ctx.lineTo(1800, 560);
      ctx.stroke();

      // 7. Konten Prasasti / Kunjungan Budaya
      let currentY = 640;

      // Aksara Pallawa jika ada
      if (data.pallawaScript) {
        ctx.fillStyle = '#92400e';
        ctx.font = '42px "Times New Roman", sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillText(data.pallawaScript.slice(0, 60), 1200, currentY);
        currentY += 60;
      }

      // Teks Melayu Kuno jika ada
      if (data.oldMalayText) {
        ctx.fillStyle = '#3c2a1a';
        ctx.font = 'italic 30px "Times New Roman", Georgia, serif';
        const wrappedMalay = wrapText(ctx, `"${data.oldMalayText}"`, 1700);
        wrappedMalay.forEach(line => {
          ctx.fillText(line, 1200, currentY);
          currentY += 40;
        });
        currentY += 20;
      }

      // Terjemahan / Ikrar
      if (data.indonesianTranslation) {
        ctx.fillStyle = '#1c150d';
        ctx.font = '500 28px "Georgia", serif';
        const wrappedIndo = wrapText(ctx, data.indonesianTranslation, 1800);
        wrappedIndo.forEach(line => {
          ctx.fillText(line, 1200, currentY);
          currentY += 38;
        });
      } else {
        ctx.fillStyle = '#1c150d';
        ctx.font = '500 28px "Georgia", serif';
        const desc = `Telah menunaikan ziarah pelestarian budaya serta diverifikasi secara resmi sebagai simpul aktif di ekosistem Smart Tourism Chain (STC). Sertifikat ini terikat permanen (Soulbound) dan tidak dapat dipalsukan.`;
        const wrappedDesc = wrapText(ctx, desc, 1800);
        wrappedDesc.forEach(line => {
          ctx.fillText(line, 1200, currentY);
          currentY += 38;
        });
      }

      // Sumpah Pelindung Sapatha
      if (data.curseProtectionFormula) {
        currentY += 20;
        ctx.fillStyle = '#8b0000';
        ctx.font = 'italic 24px "Times New Roman", serif';
        const wrappedCurse = wrapText(ctx, `Formula Pelindung Sapatha: ${data.curseProtectionFormula}`, 1750);
        wrappedCurse.forEach(line => {
          ctx.fillText(line, 1200, currentY);
          currentY += 32;
        });
      }

      // 8. Meterai Fisik Keraton (Wax Seal Emboss) di Sisi Kiri Bawah
      const sealX = 400;
      const sealY = 1380;
      
      // Outer wax ring
      ctx.beginPath();
      ctx.arc(sealX, sealY, 90, 0, Math.PI * 2);
      ctx.fillStyle = '#8b0000';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#c59b27';
      ctx.stroke();

      // Inner golden ring
      ctx.beginPath();
      ctx.arc(sealX, sealY, 74, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();

      // Teks stempel
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 16px "Cinzel", sans-serif';
      ctx.fillText('SIGUNTANG', sealX, sealY - 30);
      ctx.font = 'bold 22px "Cinzel", sans-serif';
      ctx.fillText('PROVENANCE', sealX, sealY);
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('EIP-5192 SBT', sealX, sealY + 28);
      ctx.font = '13px monospace';
      ctx.fillText('VERIFIED', sealX, sealY + 48);

      // 9. Informasi Metadata Kriptografi On-Chain (Tengah Bawah)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#4a3b30';
      ctx.font = 'bold 20px "Cinzel", sans-serif';
      ctx.fillText(`TOKEN REGISTRASI RESMI: ${displayTokenId}`, 1200, 1330);
      ctx.font = '18px monospace';
      ctx.fillStyle = '#6b5744';
      ctx.fillText(`STANDAR KONTRAK: EIP-5192 NON-TRANSFERABLE SOULBOUND TOKEN`, 1200, 1365);
      ctx.fillText(`TRANSACTION HASH: ${data.txHash}`, 1200, 1395);
      ctx.font = '19px "Georgia", serif';
      ctx.fillStyle = '#1c150d';
      ctx.fillText(`Diterbitkan pada tanggal: ${displayDate} Masehi`, 1200, 1435);

      // Tanda Tangan
      ctx.textAlign = 'left';
      ctx.font = 'italic 20px "Times New Roman", serif';
      ctx.fillStyle = '#3c2a1a';
      ctx.fillText('Kurator Balai Pelestarian Kebudayaan', 600, 1490);
      ctx.font = 'bold 22px "Georgia", serif';
      ctx.fillText('Tetua Adat Musi & Konsorsium', 600, 1525);

      ctx.textAlign = 'right';
      ctx.font = 'italic 20px "Times New Roman", serif';
      ctx.fillText('Ketua Tim Riset STC Protocol', 1800, 1490);
      ctx.font = 'bold 22px "Georgia", serif';
      ctx.fillText('Dr. Akhmad Khudri (Universitas Bina Darma)', 1800, 1525);

      // 10. Gambar QR Code Otentik di Kanan Bawah
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.src = qrDataUrl;
        await new Promise(resolve => {
          qrImg.onload = resolve;
          qrImg.onerror = resolve;
        });

        // Background putih untuk kontras QR
        const qrSize = 190;
        const qrx = 1940;
        const qry = 1270;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrx - 10, qry - 10, qrSize + 20, qrSize + 20);
        ctx.strokeStyle = '#c59b27';
        ctx.lineWidth = 3;
        ctx.strokeRect(qrx - 10, qry - 10, qrSize + 20, qrSize + 20);

        ctx.drawImage(qrImg, qrx, qry, qrSize, qrSize);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#8b0000';
        ctx.font = 'bold 15px "Cinzel", sans-serif';
        ctx.fillText('PINDAI VERIFIKASI', qrx + qrSize / 2, qry + qrSize + 28);
        ctx.font = '13px sans-serif';
        ctx.fillStyle = '#4a3b30';
        ctx.fillText('Bukti Integritas On-Chain', qrx + qrSize / 2, qry + qrSize + 46);
      }

      // Convert to high quality PNG and trigger download
      const pngUrl = canvas.toDataURL('image/png', 1.0);
      const downloadLink = document.createElement('a');
      const safeName = data.recipientName.replace(/[^a-zA-Z0-9]/g, '_');
      downloadLink.download = `Piagam-Resmi-STC-${safeName}-${Date.now()}.png`;
      downloadLink.href = pngUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Gagal generate gambar piagam:", err);
      alert("Gagal mengunduh gambar piagam. Silakan gunakan tombol Cetak / PDF.");
    } finally {
      setIsGeneratingDownload(false);
    }
  };

  // Helper function for wrapping canvas text
  function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-5xl bg-stone-900 border border-amber-600/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col"
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between px-5 py-4 bg-black/60 border-b border-amber-900/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
                <Award size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-200">Piagam Fisik Resmi Ber-QR Code</h3>
                <p className="text-xs text-stone-400">Bukti Fisik Sertifikat Soulbound Token (ERC-5192) Terverifikasi On-Chain</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Tutup"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Action Header Ribbon */}
          <div className="px-5 py-3 bg-[#8b0000]/25 border-b border-[#8b0000]/40 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-100">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Token berhasil dicatat secara abadi di smart contract Sepolia. Siap dicetak atau dibagikan ke stakeholders.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono bg-black/40 px-2.5 py-1 rounded-md text-[11px] text-amber-300 border border-amber-500/20">
                {displayTokenId}
              </span>
            </div>
          </div>

          {/* Scrollable Certificate Sheet Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-950 flex flex-col items-center">
            {/* The Physical Certificate Paper Preview (Printable Target) */}
            <div 
              ref={certificateRef}
              id="printable-stc-certificate"
              className="w-full max-w-4xl bg-gradient-to-br from-[#fcf8f0] via-[#f7f0e4] to-[#ede3d1] text-[#1c150d] p-6 sm:p-10 rounded-2xl shadow-2xl border-8 border-[#8b0000] relative overflow-hidden transition-all print:border-none print:shadow-none print:m-0 print:p-8"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(197, 155, 39, 0.15)'
              }}
            >
              {/* Inner Gold Frame */}
              <div className="border-2 border-[#c59b27] p-5 sm:p-8 relative">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#8b0000]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#8b0000]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#8b0000]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#8b0000]" />

                {/* Header Institusi */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b0000]/10 border border-[#8b0000]/20 rounded-full mb-2">
                    <Sparkles size={13} className="text-[#8b0000]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b0000]">
                      Smart Tourism Chain Protocol • EIP-5192
                    </span>
                  </div>
                  <h1 className="font-serif text-lg sm:text-2xl font-bold tracking-widest text-[#8b0000] uppercase">
                    Konsorsium Pelestarian Cagar Budaya Maritim Nusantara
                  </h1>
                  <p className="text-[11px] font-serif uppercase tracking-wider text-[#634e3e]">
                    Riset Disertasi Doktoral Dr. Akhmad Khudri • Universitas Bina Darma
                  </p>
                  <div className="w-48 h-0.5 bg-[#c59b27] mx-auto mt-2" />
                </div>

                {/* Judul Piagam */}
                <div className="text-center mb-6">
                  <p className="text-xs uppercase tracking-widest text-[#7a6452] font-semibold mb-1">
                    Piagam Pengesahan Resmi
                  </p>
                  <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#1c150d] tracking-tight">
                    {data.title}
                  </h2>
                </div>

                {/* Penerima Piagam */}
                <div className="text-center mb-6">
                  <p className="text-xs sm:text-sm font-serif italic text-[#634e3e] mb-2">
                    Dengan memohon keluhuran tanah air dan kesucian air Sungai Musi, disahkan kepada:
                  </p>
                  <div className="inline-block relative">
                    <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#8b0000] tracking-wide px-6 py-1">
                      {data.recipientName}
                    </h3>
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent mt-1" />
                  </div>
                </div>

                {/* Konten Aksara Pallawa & Narasi */}
                <div className="space-y-4 mb-8 text-center max-w-2xl mx-auto">
                  {data.pallawaScript && (
                    <div className="p-3 bg-amber-900/5 rounded-xl border border-amber-900/10">
                      <p className="font-serif text-amber-950 text-base sm:text-lg tracking-widest font-medium">
                        {data.pallawaScript}
                      </p>
                    </div>
                  )}

                  {data.oldMalayText && (
                    <p className="font-serif italic text-xs sm:text-sm text-[#422e1b] leading-relaxed">
                      "{data.oldMalayText}"
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-[#2d2216] leading-relaxed">
                    {data.indonesianTranslation || 
                      "Telah membuktikan komitmen pelestarian budaya dan tercatat sebagai pemegang resmi Soulbound Token (Proof-of-Visit) pada jaringan terdistribusi Smart Tourism Chain (STC)."}
                  </p>

                  {data.curseProtectionFormula && (
                    <p className="text-[11px] font-serif italic text-[#8b0000] border-t border-amber-900/10 pt-2">
                      Sumpah Pelindung Sapatha: {data.curseProtectionFormula}
                    </p>
                  )}
                </div>

                {/* Footer Certificate: Seal, Signatures, and Interactive QR Code */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 border-t border-[#c59b27]/40">
                  {/* Left: Wax Seal Emboss */}
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#700000] via-[#8b0000] to-[#aa0000] border-4 border-[#c59b27] shadow-lg flex flex-col items-center justify-center text-amber-200 text-center shrink-0">
                      <span className="text-[9px] uppercase font-bold tracking-widest leading-none">STC</span>
                      <ShieldCheck size={22} className="my-0.5 text-amber-300" />
                      <span className="text-[8px] uppercase tracking-tighter leading-none">VERIFIED</span>
                    </div>
                    <div className="text-[11px] text-[#523e2d]">
                      <p className="font-bold text-[#8b0000]">Meterai STC Abadi</p>
                      <p className="font-mono text-[9px]">EIP-5192 IMMUTABLE</p>
                      <p className="text-[10px] text-gray-500">{displayDate}</p>
                    </div>
                  </div>

                  {/* Center: Signatures */}
                  <div className="text-center text-[11px] text-[#422f1f]">
                    <div className="mb-2">
                      <p className="font-serif italic text-gray-500">Mengesahkan,</p>
                      <p className="font-bold text-xs font-serif text-[#1c150d]">Dr. Akhmad Khudri</p>
                      <p className="text-[10px] text-gray-500">Ketua Riset STC • Univ. Bina Darma</p>
                    </div>
                    <p className="font-mono text-[10px] text-[#8b0000] font-semibold">
                      Hash: {data.txHash ? `${data.txHash.slice(0, 10)}...${data.txHash.slice(-8)}` : 'On-Chain Validated'}
                    </p>
                  </div>

                  {/* Right: Authentic QR Code */}
                  <div className="flex flex-col items-center md:items-end justify-center">
                    <div className="p-2 bg-white rounded-xl shadow-md border-2 border-[#c59b27] inline-block">
                      {qrDataUrl ? (
                        <img 
                          src={qrDataUrl} 
                          alt="QR Code Verifikasi On-Chain" 
                          className="w-24 h-24 object-contain"
                        />
                      ) : (
                        <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-gray-400">
                          <QrCode size={36} />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b0000] mt-1 text-center md:text-right">
                      Pindai untuk Verifikasi
                    </p>
                    <p className="text-[9px] text-[#634e3e] text-center md:text-right">
                      Integritas Anti-Manipulasi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons Bar */}
          <div className="p-4 bg-stone-900 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 rounded-xl text-xs font-medium border border-stone-700 flex items-center gap-2 transition-all cursor-pointer"
              >
                {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedLink ? "Link Tersalin!" : "Salin Link Verifikasi"}</span>
              </button>

              <a
                href={verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-medium border border-stone-700 flex items-center gap-2 transition-all"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Buka On-Chain Explorer</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-bold border border-amber-500/30 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Printer size={15} />
                <span>Cetak / Simpan PDF</span>
              </button>

              <button
                type="button"
                disabled={isGeneratingDownload}
                onClick={handleDownloadImage}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download size={15} />
                <span>{isGeneratingDownload ? "Membuat Gambar HD..." : "Unduh Gambar Piagam (PNG HD)"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
