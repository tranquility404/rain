import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Droplets, ZoomIn, ZoomOut, Network } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapSetup {
  id: number;
  address: string;
  capacity: string;
  savings: string;
  lat: number;
  lng: number;
  efficiency: number;
  status: 'installed' | 'potential_hub' | 'expanding';
  connections?: number[];
  houses?: HouseSetup[]; // Houses within this hub
}

interface HouseSetup {
  id: number;
  houseNumber: string;
  ownerName: string;
  capacity: string;
  lat: number;
  lng: number;
  efficiency: number;
  installationDate: string;
  connections?: number[];
}

interface InteractiveMapProps {
  nearbySetups?: MapSetup[];
}

const mockNearbySetups: MapSetup[] = [
  {
    id: 1,
    address: 'MG Road Hub',
    capacity: '15,000L',
    savings: '₹12,500',
    lat: 12.9716,
    lng: 77.5946,
    efficiency: 92,
    status: 'installed',
    connections: [2, 4],
    houses: [
      { id: 101, houseNumber: 'MG-1A', ownerName: 'Rajesh Kumar', capacity: '2,500L', lat: 12.9718, lng: 77.5948, efficiency: 94, installationDate: '2024-03-15', connections: [102, 103] },
      { id: 102, houseNumber: 'MG-1B', ownerName: 'Priya Sharma', capacity: '3,000L', lat: 12.9714, lng: 77.5944, efficiency: 91, installationDate: '2024-03-20', connections: [101, 104] },
      { id: 103, houseNumber: 'MG-2A', ownerName: 'Arun Patel', capacity: '2,000L', lat: 12.9720, lng: 77.5950, efficiency: 88, installationDate: '2024-04-02', connections: [101, 104] },
      { id: 104, houseNumber: 'MG-2B', ownerName: 'Sunita Reddy', capacity: '2,800L', lat: 12.9712, lng: 77.5942, efficiency: 93, installationDate: '2024-04-10', connections: [102, 103] },
      { id: 105, houseNumber: 'MG-3A', ownerName: 'Vikram Singh', capacity: '3,200L', lat: 12.9722, lng: 77.5952, efficiency: 90, installationDate: '2024-04-18', connections: [106] },
      { id: 106, houseNumber: 'MG-3B', ownerName: 'Meera Joshi', capacity: '2,400L', lat: 12.9710, lng: 77.5940, efficiency: 89, installationDate: '2024-04-25', connections: [105] }
    ]
  },
  {
    id: 2,
    address: 'Brigade Road Hub',
    capacity: '20,000L',
    savings: '₹18,200',
    lat: 12.9719,
    lng: 77.6099,
    efficiency: 88,
    status: 'potential_hub',
    connections: [1, 3, 4],
    houses: [
      { id: 201, houseNumber: 'BR-1A', ownerName: 'Amit Gupta', capacity: '3,500L', lat: 12.9721, lng: 77.6101, efficiency: 87, installationDate: '2024-05-05', connections: [202, 203] },
      { id: 202, houseNumber: 'BR-1B', ownerName: 'Kavya Menon', capacity: '2,800L', lat: 12.9717, lng: 77.6097, efficiency: 90, installationDate: '2024-05-12', connections: [201, 204] },
      { id: 203, houseNumber: 'BR-2A', ownerName: 'Deepak Rao', capacity: '3,100L', lat: 12.9723, lng: 77.6103, efficiency: 85, installationDate: '2024-05-18', connections: [201, 204] },
      { id: 204, houseNumber: 'BR-2B', ownerName: 'Ananya Das', capacity: '2,900L', lat: 12.9715, lng: 77.6095, efficiency: 92, installationDate: '2024-05-25', connections: [202, 203] }
    ]
  },
  {
    id: 3,
    address: 'Koramangala Hub',
    capacity: '12,000L',
    savings: '₹9,800',
    lat: 12.9351,
    lng: 77.6245,
    efficiency: 85,
    status: 'installed',
    connections: [2],
    houses: [
      { id: 301, houseNumber: 'KM-1A', ownerName: 'Ravi Krishnan', capacity: '2,200L', lat: 12.9353, lng: 77.6247, efficiency: 86, installationDate: '2024-06-01', connections: [302, 303] },
      { id: 302, houseNumber: 'KM-1B', ownerName: 'Sneha Iyer', capacity: '2,500L', lat: 12.9349, lng: 77.6243, efficiency: 84, installationDate: '2024-06-08', connections: [301, 304] },
      { id: 303, houseNumber: 'KM-2A', ownerName: 'Manoj Nair', capacity: '2,800L', lat: 12.9355, lng: 77.6249, efficiency: 87, installationDate: '2024-06-15', connections: [301, 304] },
      { id: 304, houseNumber: 'KM-2B', ownerName: 'Lakshmi Pillai', capacity: '2,100L', lat: 12.9347, lng: 77.6241, efficiency: 83, installationDate: '2024-06-22', connections: [302, 303] }
    ]
  },
  {
    id: 4,
    address: 'Indiranagar Hub',
    capacity: '18,000L',
    savings: '₹15,600',
    lat: 12.9784,
    lng: 77.6408,
    efficiency: 90,
    status: 'expanding',
    connections: [1, 2],
    houses: [
      { id: 401, houseNumber: 'IN-1A', ownerName: 'Arjun Varma', capacity: '3,800L', lat: 12.9786, lng: 77.6410, efficiency: 91, installationDate: '2024-07-01', connections: [402, 403] },
      { id: 402, houseNumber: 'IN-1B', ownerName: 'Divya Shetty', capacity: '3,200L', lat: 12.9782, lng: 77.6406, efficiency: 89, installationDate: '2024-07-08', connections: [401, 404] },
      { id: 403, houseNumber: 'IN-2A', ownerName: 'Kiran Kumar', capacity: '3,600L', lat: 12.9788, lng: 77.6412, efficiency: 92, installationDate: '2024-07-15', connections: [401, 404] },
      { id: 404, houseNumber: 'IN-2B', ownerName: 'Pooja Agarwal', capacity: '2,900L', lat: 12.9780, lng: 77.6404, efficiency: 88, installationDate: '2024-07-22', connections: [402, 403] },
      { id: 405, houseNumber: 'IN-3A', ownerName: 'Suresh Babu', capacity: '3,400L', lat: 12.9790, lng: 77.6414, efficiency: 90, installationDate: '2024-07-29', connections: [406] },
      { id: 406, houseNumber: 'IN-3B', ownerName: 'Rekha Devi', capacity: '2,700L', lat: 12.9778, lng: 77.6402, efficiency: 87, installationDate: '2024-08-05', connections: [405] }
    ]
  }
];

const InteractiveMap = ({ nearbySetups }: InteractiveMapProps) => {
  const [selectedSetup, setSelectedSetup] = useState<MapSetup | null>(null);
  const [viewMode, setViewMode] = useState<'hubs' | 'houses'>('hubs');
  const [selectedHub, setSelectedHub] = useState<MapSetup | null>(null);
  const [mapRef, setMapRef] = useState<any>(null);

  // Use provided setups or fallback to mock data
  const mapSetups = nearbySetups?.length ? nearbySetups : mockNearbySetups;

  // Debug log to check data
  console.log('Map setups:', mapSetups);

  // Default center (Bangalore, India)
  const center: [number, number] = [12.9716, 77.5946];

  // Handle hub click to zoom into house view
  const handleHubClick = (setup: MapSetup) => {
    setSelectedHub(setup);
    setViewMode('houses');
    setSelectedSetup(setup);
    
    // Zoom into the selected hub
    if (mapRef) {
      mapRef.setView([setup.lat, setup.lng], 18, { animate: true });
    }
  };

  // Handle back to hubs view
  const handleBackToHubs = () => {
    setViewMode('hubs');
    setSelectedHub(null);
    setSelectedSetup(null);
    
    if (mapRef) {
      mapRef.setView(center, 14, { animate: true });
    }
  };

  // Create custom icon for water installations
  const createCustomIcon = (setup: MapSetup, isSelected: boolean) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'installed':
          return '#22c55e'; // Green for installed
        case 'potential_hub':
          return '#eab308'; // Gold for potential hubs
        case 'expanding':
          return '#3b82f6'; // Blue for expanding
        default:
          return '#0ea5e9';
      }
    };

    const size = setup.status === 'potential_hub' ? 32 : 24;
    const scale = isSelected ? 1.3 : 1;

    return L.divIcon({
      className: 'custom-water-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${getStatusColor(setup.status)};
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transform: scale(${scale});
          transition: all 0.3s ease;
          ${setup.status === 'potential_hub' ? 'animation: pulse 2s infinite;' : ''}
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(${scale}); }
            50% { opacity: 0.8; transform: scale(${scale * 1.1}); }
          }
        </style>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Create custom icon for house installations
  const createHouseIcon = (house: HouseSetup, isSelected: boolean) => {
    const size = 16;
    const scale = isSelected ? 1.3 : 1;

    return L.divIcon({
      className: 'custom-house-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: #10b981;
          border-radius: 3px;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transform: scale(${scale});
          transition: all 0.3s ease;
        ">
          <div style="
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 1px;
          "></div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Generate house connections within a hub
  const generateHouseConnections = (houses: HouseSetup[]) => {
    const connections: { positions: [number, number][]; color: string }[] = [];
    
    houses.forEach((house) => {
      if (house.connections) {
        house.connections.forEach((connectedId) => {
          const connectedHouse = houses.find(h => h.id === connectedId);
          if (connectedHouse && house.id < connectedId) { // Avoid duplicate lines
            connections.push({
              positions: [
                [house.lat, house.lng],
                [connectedHouse.lat, connectedHouse.lng]
              ],
              color: '#10b981'
            });
          }
        });
      }
    });
    
    return connections;
  };
  const generateConnections = () => {
    const connections: { positions: [number, number][]; color: string }[] = [];

    mapSetups.forEach((setup) => {
      if (setup.connections) {
        setup.connections.forEach((connectedId) => {
          const connectedSetup = mapSetups.find(s => s.id === connectedId);
          if (connectedSetup && setup.id < connectedId) { // Avoid duplicate lines
            connections.push({
              positions: [
                [setup.lat, setup.lng],
                [connectedSetup.lat, connectedSetup.lng]
              ],
              color: setup.status === 'potential_hub' || connectedSetup.status === 'potential_hub'
                ? '#fbbf24' : '#3b82f6'
            });
          }
        });
      }
    });

    return connections;
  };

  return (
    <Card className="p-6 glass border-white/20 shadow-glass">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-card-foreground">Interconnected Water Hub Network</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Installed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1 animate-pulse"></div>
            <span>Potential Hub</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Expanding</span>
          </div>
        </div>
      </div>
      <div className="h-80 rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Connection lines between setups */}
          {generateConnections().map((connection, index) => (
            <Polyline
              key={index}
              positions={connection.positions}
              color={connection.color}
              weight={3}
              opacity={0.7}
              dashArray="5, 10"
            />
          ))}

          {/* Coverage circles for potential hubs */}
          {mapSetups
            .filter(setup => setup.status === 'potential_hub')
            .map((setup) => (
              <Circle
                key={`circle-${setup.id}`}
                center={[setup.lat, setup.lng]}
                radius={500}
                fillColor="#fbbf24"
                fillOpacity={0.1}
                color="#fbbf24"
                weight={2}
                opacity={0.4}
              />
            ))}

          {/* Markers for each setup */}
          {mapSetups.map((setup) => (
            <Marker
              key={setup.id}
              position={[setup.lat, setup.lng]}
              icon={createCustomIcon(setup, selectedSetup?.id === setup.id)}
              eventHandlers={{
                click: () => handleHubClick(setup),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-primary mr-2" />
                      <span className="font-semibold">{setup.address}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${setup.status === 'installed' ? 'bg-green-100 text-green-800' :
                        setup.status === 'potential_hub' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                      }`}>
                      {setup.status === 'installed' ? 'Active' :
                        setup.status === 'potential_hub' ? 'Hub Potential' : 'Expanding'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-gray-600">Capacity:</span>
                      <p className="font-medium">{setup.capacity}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Savings:</span>
                      <p className="font-medium text-green-600">{setup.savings}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600 text-sm">Efficiency:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${setup.efficiency}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{setup.efficiency}%</span>
                  </div>
                  {setup.connections && setup.connections.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-600">
                        <Network className="w-3 h-3 mr-1" />
                        <span>Connected to {setup.connections.length} installations</span>
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Interactive network map showing {mapSetups.length} water harvesting installations with interconnection potential
        </p>
        {selectedSetup && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-primary/10 rounded-lg"
          >
            <p className="text-sm font-medium">
              Selected: {selectedSetup.address} - {selectedSetup.status === 'potential_hub' ? 'High Hub Potential' : 'Active Installation'}
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default InteractiveMap;