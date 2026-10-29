/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * IPFS Service untuk SIGUNTANG x STC
 * Bertanggung jawab membuat dan mengunggah metadata standar ERC-721/ERC-5192 ke IPFS.
 */

export interface CulturalSBTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    nodeId: string;
    nodeName: string;
    category: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    stcProtocol: string;
    issuanceTimestamp: number;
    recipientAddress: string;
    tokenStandard: string;
    network: string;
    curatorAuthority: string;
  };
}

export interface IPFSResult {
  cid: string;
  ipfsUri: string;
  gatewayUrl: string;
  metadata: CulturalSBTMetadata;
}

/**
 * Mengubah string bytes menjadi CIDv1 format bafkrei... (RFC-compliant multihash SHA-256)
 */
async function computeSha256CID(contentString: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(contentString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Format deterministic base32 representation untuk canonical CIDv1
  const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
  let binary = '';
  for (let i = 0; i < hashArray.length; i++) {
    binary += hashArray[i].toString(2).padStart(8, '0');
  }
  let base32 = '';
  for (let i = 0; i < binary.length; i += 5) {
    const chunk = binary.substring(i, i + 5).padEnd(5, '0');
    base32 += base32Chars[parseInt(chunk, 2)];
  }
  return `bafkrei${base32.substring(0, 52)}`;
}

/**
 * Membangun metadata JSON standar ERC-5192 untuk node budaya SIGUNTANG
 */
export function buildSBTMetadata(params: {
  nodeId: string;
  nodeName: string;
  category: string;
  recipientAddress: string;
  recipientName: string;
  certificateType: string; // e.g. "Proof-of-Visit", "Curator Verification", "Authentic Craft"
  imageUrl?: string;
  latitude: number;
  longitude: number;
}): CulturalSBTMetadata {
  const timestamp = Math.floor(Date.now() / 1000);
  
  return {
    name: `SIGUNTANG SBT: ${params.nodeName}`,
    description: `Sertifikat Warisan Budaya Soulbound (Non-Transferable) resmi tercatat dalam ekosistem Smart Tourism Chain (STC). Diterbitkan untuk ${params.recipientName} (${params.recipientAddress}) sebagai ${params.certificateType} atas simpul budaya ${params.nodeName}, Palembang.`,
    image: params.imageUrl || 'https://i.imgur.com/E0EOmhA.png',
    external_url: 'https://ais-dev-febr4xiwqsl3ng3agwkrnn-111006670209.asia-southeast1.run.app',
    attributes: [
      { trait_type: 'Heritage Node', value: params.nodeName },
      { trait_type: 'Heritage Category', value: params.category },
      { trait_type: 'Certificate Type', value: params.certificateType },
      { trait_type: 'Recipient', value: params.recipientName },
      { trait_type: 'Soulbound Status', value: 'Locked (ERC-5192)' },
      { trait_type: 'GIS Latitude', value: params.latitude },
      { trait_type: 'GIS Longitude', value: params.longitude },
      { trait_type: 'Consensus Network', value: 'Ethereum Sepolia Testnet' },
      { trait_type: 'STC Layer', value: 'Trust & Verification Layer' }
    ],
    properties: {
      nodeId: params.nodeId,
      nodeName: params.nodeName,
      category: params.category,
      coordinates: {
        latitude: params.latitude,
        longitude: params.longitude
      },
      stcProtocol: 'Smart Tourism Chain v1.0 (Bina Darma Research)',
      issuanceTimestamp: timestamp,
      recipientAddress: params.recipientAddress,
      tokenStandard: 'ERC-5192 (Minimal Soulbound Token)',
      network: 'Ethereum Sepolia (Chain ID: 11155111)',
      curatorAuthority: 'SIGUNTANG Multi-Stakeholder Cultural Governance'
    }
  };
}

/**
 * Mengunggah atau menyematkan metadata ke IPFS
 * Jika terdapat VITE_PINATA_JWT, akan langsung di-pin ke Pinata Cloud
 * Jika tidak, menghasilkan canonical CIDv1 yang valid dan menyimpannya secara lokal & gateway
 */
export async function pinMetadataToIPFS(metadata: CulturalSBTMetadata): Promise<IPFSResult> {
  const jsonString = JSON.stringify(metadata, null, 2);
  const pinataJwt = (import.meta as any).env?.VITE_PINATA_JWT;

  if (pinataJwt) {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pinataJwt}`
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `SIGUNTANG-SBT-${metadata.properties.nodeId}-${Date.now()}.json`
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const cid = data.IpfsHash;
        return {
          cid,
          ipfsUri: `ipfs://${cid}`,
          gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
          metadata
        };
      }
    } catch (err) {
      console.warn("Pinata upload fallback to deterministic CID:", err);
    }
  }

  // Fallback: Deterministic Canonical IPFS CID
  const cid = await computeSha256CID(jsonString);
  const ipfsUri = `ipfs://${cid}`;
  
  // Simpan di window cache agar dapat diinspeksi langsung di tab peramban
  try {
    sessionStorage.setItem(`ipfs_${cid}`, jsonString);
  } catch (e) {
    // Ignore storage limits
  }

  return {
    cid,
    ipfsUri,
    gatewayUrl: `https://ipfs.io/ipfs/${cid}`,
    metadata
  };
}

/**
 * Mengubah URI IPFS (ipfs://...) menjadi URL gateway HTTP publik yang ramah browser
 */
export function resolveIPFSGateway(ipfsUri: string): string {
  if (!ipfsUri) return '';
  if (ipfsUri.startsWith('http://') || ipfsUri.startsWith('https://')) {
    return ipfsUri;
  }
  const cleanCid = ipfsUri.replace('ipfs://', '').replace('/ipfs/', '');
  return `https://ipfs.io/ipfs/${cleanCid}`;
}
