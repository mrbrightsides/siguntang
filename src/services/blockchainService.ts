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
  CONTRACT_ADDRESSES 
} from '../contractData';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export async function connectWallet(): Promise<WalletState | null> {
  if (typeof window.ethereum === 'undefined') {
    alert('Metamask stands at the gate. Please install it to enter the STC network.');
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    
    return {
      address: accounts[0],
      chainId: Number(network.chainId),
      isConnected: true
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
      statement: 'Masuk ke SIGUNTANG - Gerbang Universal Node Nusantara Gemilang.',
      uri: origin,
      version: '1',
      chainId: 1, // Defaulting to Mainnet for SIWE message format, or user can change
      nonce: Math.random().toString(36).substring(2),
    });

    const signature = await signer.signMessage(message.prepareMessage());
    return { message, signature };
  } catch (error) {
    console.error("SIWE Failed:", error);
    return null;
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
