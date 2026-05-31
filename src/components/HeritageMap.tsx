/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UniversalNode } from '../types';
import { PALEMBANG_NODES } from '../constants';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HeritageMapProps {
  nodes: UniversalNode[];
  onNodeClick: (node: UniversalNode) => void;
}

export function HeritageMap({ nodes, onNodeClick }: HeritageMapProps) {
  const center: [number, number] = [-2.9909, 104.7567]; // Center of Palembang (near Ampera)

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-black/5">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {nodes.map((node) => (
          <Marker 
            key={node.id} 
            position={[node.location.lat, node.location.lng]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <img 
                  src={node.image} 
                  alt={node.name} 
                  className="w-full h-24 object-cover rounded-lg mb-2"
                  referrerPolicy="no-referrer"
                />
                <h3 className="font-serif font-bold text-sm mb-1">{node.name}</h3>
                <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">{node.type}</p>
                <button 
                  onClick={() => onNodeClick(node)}
                  className="w-full py-2 bg-[#8b0000] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
