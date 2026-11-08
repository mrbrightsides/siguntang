/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UniversalNode, CulturalRegion } from '../types';
import { 
  REGIONAL_INFO, 
  CAPITAL_CITY_ID, 
  OTHER_CITIES_REGIONS, 
  REGENCIES_REGIONS,
  ALL_SUMSEL_REGIONS 
} from '../constants';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to control leaflet view
function MapViewUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface HeritageMapProps {
  nodes: UniversalNode[];
  onNodeClick: (node: UniversalNode) => void;
  onOpenAR?: (node?: UniversalNode) => void;
  activeRegion?: CulturalRegion | 'All';
  onSelectRegion?: (region: CulturalRegion | 'All') => void;
}

export function HeritageMap({ 
  nodes, 
  onNodeClick, 
  onOpenAR,
  activeRegion = 'Palembang',
  onSelectRegion
}: HeritageMapProps) {
  const [currentRegion, setCurrentRegion] = useState<CulturalRegion | 'All'>(activeRegion);

  useEffect(() => {
    setCurrentRegion(activeRegion);
  }, [activeRegion]);

  const handleRegionChange = (reg: CulturalRegion | 'All') => {
    setCurrentRegion(reg);
    if (onSelectRegion) onSelectRegion(reg);
  };

  // Determine center & zoom
  let mapCenter: [number, number] = [-3.5000, 103.9000]; // Triangle center of South Sumatra
  let mapZoom = 9;

  if (currentRegion !== 'All' && REGIONAL_INFO[currentRegion]) {
    mapCenter = REGIONAL_INFO[currentRegion].center;
    mapZoom = REGIONAL_INFO[currentRegion].zoom;
  }

  // Tampilkan seluruh node di peta Sumatera Selatan sesuai permintaan user
  const displayedNodes = nodes;

  return (
    <div className="relative w-full h-[640px] rounded-3xl overflow-hidden shadow-2xl border border-black/5 bg-stone-900">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Region Quick Selector Buttons & Dropdown */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl pointer-events-auto max-w-full">
          <button
            onClick={() => handleRegionChange('All')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
              currentRegion === 'All'
                ? 'bg-white text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🗺️ Seluruh Sumsel ({displayedNodes.length})
          </button>
          <button
            onClick={() => handleRegionChange('Palembang')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
              currentRegion === 'Palembang'
                ? 'bg-[#8b0000] text-white shadow-md shadow-[#8b0000]/30'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🏛️ Palembang
          </button>
          <button
            onClick={() => handleRegionChange('Pagaralam')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer hidden sm:block ${
              currentRegion === 'Pagaralam'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            ⛰️ Pagar Alam
          </button>
          <button
            onClick={() => handleRegionChange('Lahat')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer hidden sm:block ${
              currentRegion === 'Lahat'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🗿 Lahat
          </button>
          <button
            onClick={() => handleRegionChange('Ogan Ilir')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer hidden sm:block ${
              currentRegion === 'Ogan Ilir'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🌾 Ogan Ilir
          </button>

          {/* Jump to Any of 17 Regions Dropdown */}
          <div className="relative">
            <select
              value={currentRegion === 'All' ? 'All' : currentRegion}
              onChange={(e) => handleRegionChange(e.target.value as any)}
              className="bg-stone-800 text-stone-200 border border-white/20 rounded-xl px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="All">Semua Wilayah Sumsel</option>
              <optgroup label="🏛️ Ibukota Provinsi">
                <option value="Palembang">Kota Palembang</option>
              </optgroup>
              <optgroup label="🏙️ 3 Kota Lainnya">
                {OTHER_CITIES_REGIONS.map((id) => (
                  <option key={id} value={id}>
                    {REGIONAL_INFO[id].name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🏞️ 13 Kabupaten">
                {REGENCIES_REGIONS.map((id) => (
                  <option key={id} value={id}>
                    {REGIONAL_INFO[id].name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Action Button: AR Camera */}
        {onOpenAR && (
          <div className="pointer-events-auto">
            <button
              onClick={() => onOpenAR()}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#8b0000] to-[#b30000] hover:brightness-110 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xl transition-all cursor-pointer active:scale-95 border border-white/20"
              title="Buka Kamera AR HP untuk Melihat Penanda 3D Cagar Budaya"
            >
              <span>📷 Mode Kamera AR</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Status Tag */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none hidden sm:block">
        <div className="px-3.5 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-mono text-stone-300 shadow-lg">
          <span className="text-amber-400 font-bold">{displayedNodes.length} Seluruh Simpul Budaya Terpetakan di Peta Sumsel</span>
          <span className="text-stone-500 mx-2">•</span>
          <span>Fokus: {currentRegion === 'All' ? 'Seluruh Provinsi Sumsel' : REGIONAL_INFO[currentRegion]?.name}</span>
        </div>
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapViewUpdater center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {displayedNodes.map((node) => (
          <Marker 
            key={node.id} 
            position={[node.location.lat, node.location.lng]}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <img 
                  src={node.image} 
                  alt={node.name} 
                  className="w-full h-24 object-cover rounded-lg mb-2"
                  referrerPolicy="no-referrer"
                />
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/5 text-[#8b0000] uppercase tracking-wider">
                    {node.region || 'Palembang'}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">{node.type}</span>
                </div>
                <h3 className="font-serif font-bold text-sm mb-1 line-clamp-1">{node.name}</h3>
                <p className="text-[11px] text-gray-600 line-clamp-2 mb-3 leading-snug">{node.description}</p>
                <div className="space-y-1.5">
                  <button 
                    onClick={() => onNodeClick(node)}
                    className="w-full py-1.5 bg-[#8b0000] hover:bg-[#a00000] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-colors"
                  >
                    View Details
                  </button>
                  {onOpenAR && (
                    <button 
                      onClick={() => onOpenAR(node)}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                    >
                      📷 Arahkan di Kamera AR
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
