/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { 
  HERITAGE_NODE_REGISTRY_ABI, 
  TRACEABILITY_TRANSACTION_ABI,
  CULTURAL_CERTIFICATE_ABI,
  STC_CULTURAL_SBT_ABI,
  CONTRACT_ADDRESSES,
  SEPOLIA_CONFIG
} from '../contractData';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isSepolia: boolean;
}

export interface MintSBTResult {
  txHash: string;
  tokenId: number;
  explorerUrl: string;
  ipfsUri: string;
  isSoulbound: boolean;
  isSimulated?: boolean;
}

/**
 * Meminta pengguna beralih atau menambahkan Ethereum Sepolia Testnet ke MetaMask
 */
export async function switchToSepoliaTestnet(): Promise<boolean> {
  if (typeof window.ethereum === 'undefined') return false;

  try {
    // Coba switch network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CONFIG.chainIdHex }],
    });
    return true;
  } catch (switchError: any) {
    // Kode 4902 berarti chain belum ditambahkan ke MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: SEPOLIA_CONFIG.chainIdHex,
              chainName: SEPOLIA_CONFIG.chainName,
              rpcUrls: [SEPOLIA_CONFIG.rpcUrl],
              nativeCurrency: SEPOLIA_CONFIG.nativeCurrency,
              blockExplorerUrls: SEPOLIA_CONFIG.blockExplorerUrls,
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Gagal menambahkan Sepolia network:", addError);
        return false;
      }
    }
    console.error("Gagal beralih ke Sepolia:", switchError);
    return false;
  }
}

export async function connectWallet(): Promise<WalletState | null> {
  if (typeof window.ethereum === 'undefined') {
    alert('Metamask stands at the gate. Silakan pasang ekstensi MetaMask untuk mengakses jaringan Web3 STC.');
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum, 'any');
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    return {
      address: accounts[0],
      chainId,
      isConnected: true,
      isSepolia: chainId === SEPOLIA_CONFIG.chainId
    };
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
}

export async function signInWithEthereum(address: string) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const domain = window.location.host;
    const origin = window.location.origin;
    
    const message = new SiweMessage({
      domain,
      address,
      statement: 'Masuk ke SIGUNTANG - Gerbang Universal Node Nusantara Gemilang (Smart Tourism Chain).',
      uri: origin,
      version: '1',
      chainId: SEPOLIA_CONFIG.chainId, // Sepolia Testnet
      nonce: Math.random().toString(36).substring(2),
    });

    const signature = await signer.signMessage(message.prepareMessage());
    return { message, signature };
  } catch (error) {
    console.error("SIWE Failed:", error);
    return null;
  }
}

/**
 * Mencetak Sertifikat Budaya Soulbound (ERC-5192) ke Sepolia Testnet
 * Menghubungkan secara langsung ke Smart Contract STCCulturalSBT
 */
export async function mintSoulboundCertificate(params: {
  recipientAddress: string;
  ipfsUri: string;
  nodeName: string;
  certType: string;
}): Promise<MintSBTResult> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask tidak terdeteksi. Silakan gunakan peramban dengan ekstensi Web3.');
  }

  // 1. Cek chainId langsung dari window.ethereum tanpa membuat provider yang terkunci ke network lama
  try {
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainIdHex, 16);

    if (currentChainId !== SEPOLIA_CONFIG.chainId) {
      const switched = await switchToSepoliaTestnet();
      if (!switched) {
        throw new Error('Harap beralih ke jaringan Ethereum Sepolia Testnet di MetaMask.');
      }
      // Beri jeda 500ms agar provider internal MetaMask stabil setelah pergantian jaringan
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (netErr: any) {
    if (netErr?.code === 4001 || netErr?.message?.includes('user rejected')) {
      throw new Error('Peralihan ke jaringan Sepolia ditolak oleh pengguna di MetaMask.');
    }
  }

  // 2. Buat BrowserProvider BARU dengan network 'any' setelah jaringan dipastikan Sepolia
  const provider = new ethers.BrowserProvider(window.ethereum, 'any');
  const signer = await provider.getSigner();
  const contractAddress = CONTRACT_ADDRESSES.STC_CULTURAL_SBT;

  try {
    // Inisialisasi kontrak ERC-5192
    const contract = new ethers.Contract(
      contractAddress,
      STC_CULTURAL_SBT_ABI,
      signer
    );

    // Eksekusi fungsi mintCulturalCertificate on-chain
    const tx = await contract.mintCulturalCertificate(
      params.recipientAddress,
      params.ipfsUri,
      params.nodeName,
      params.certType
    );

    // Tunggu 1 konfirmasi blok
    const receipt = await tx.wait();
    
    // Cari token ID dari event logs
    let tokenId = 1;
    if (receipt?.logs) {
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed && (parsed.name === 'Locked' || parsed.name === 'CulturalCertificateIssued')) {
            tokenId = Number(parsed.args[0]);
            break;
          }
        } catch (e) {
          // Log bukan milik kontrak ini
        }
      }
    }

    return {
      txHash: receipt.hash || tx.hash,
      tokenId,
      explorerUrl: `${SEPOLIA_CONFIG.blockExplorerUrls[0]}/tx/${receipt.hash || tx.hash}`,
      ipfsUri: params.ipfsUri,
      isSoulbound: true,
      isSimulated: false
    };
  } catch (contractError: any) {
    if (
      contractError?.code === 'ACTION_REJECTED' || 
      contractError?.code === 4001 || 
      contractError?.info?.error?.code === 4001 ||
      contractError?.message?.includes('user rejected')
    ) {
      throw new Error('Transaksi dibatalkan oleh pengguna di MetaMask.');
    }

    console.error("Gagal menjalankan transaksi minting on-chain:", contractError);
    throw new Error(
      contractError?.reason || 
      contractError?.shortMessage || 
      contractError?.message || 
      'Gagal mengeksekusi smart contract di Sepolia.'
    );
  }
}

/**
 * Memeriksa status penguncian Soulbound (ERC-5192 locked(tokenId))
 */
export async function checkSoulboundLock(tokenId: number): Promise<boolean> {
  if (typeof window.ethereum === 'undefined') return true;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.STC_CULTURAL_SBT,
      STC_CULTURAL_SBT_ABI,
      provider
    );
    return await contract.locked(tokenId);
  } catch (e) {
    // Secara definisi ERC-5192 SBT selalu locked
    return true;
  }
}

export async function registerHeritageNode(name: string, category: string, location: string, metadataHash: string) {
  if (typeof window.ethereum === 'undefined') return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.HERITAGE_NODE_REGISTRY,
      HERITAGE_NODE_REGISTRY_ABI,
      signer
    );

    const tx = await contract.registerNode(name, category, location, metadataHash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Register Node Failed:", error);
    throw error;
  }
}

export async function recordTraceabilityTransaction(type: string, nodeName: string, amount: string, metadataHash: string) {
  if (typeof window.ethereum === 'undefined') return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.TRACEABILITY_TRANSACTION,
      TRACEABILITY_TRANSACTION_ABI,
      signer
    );

    const tx = await contract.recordTransaction(type, nodeName, ethers.parseEther(amount), metadataHash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Record Transaction Failed:", error);
    throw error;
  }
}

export async function issueCulturalCertificate(recipientName: string, certType: string, issuedFor: string, metadataHash: string) {
  if (typeof window.ethereum === 'undefined') return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.CULTURAL_CERTIFICATE,
      CULTURAL_CERTIFICATE_ABI,
      signer
    );

    const tx = await contract.issueCertificate(recipientName, certType, issuedFor, metadataHash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Issue Certificate Failed:", error);
    throw error;
  }
}
