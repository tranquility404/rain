import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Droplets, ZoomIn, ZoomOut, Network, Search, X } from 'lucide-react';
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
  houses?: HouseSetup[];
  distanceKm?: number;
  topSavers?: { name: string; savings: string }[];
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
    distanceKm: 0.3,
    topSavers: [
      { name: 'Rajesh Kumar', savings: '₹8,400' },
      { name: 'Vikram Singh', savings: '₹7,200' },
      { name: 'Sunita Reddy', savings: '₹6,800' }
    ],
    houses: [
      { id: 101, houseNumber: 'MG-1A', ownerName: 'Rajesh Kumar', capacity: '2,500L', lat: 12.9723, lng: 77.5951, efficiency: 94, installationDate: '2024-03-15', connections: [103, 105, 106] },
      { id: 102, houseNumber: 'MG-1B', ownerName: 'Priya Sharma', capacity: '3,000L', lat: 12.9708, lng: 77.5939, efficiency: 91, installationDate: '2024-03-20', connections: [104, 105, 106] },
      { id: 103, houseNumber: 'MG-2A', ownerName: 'Arun Patel', capacity: '2,000L', lat: 12.9715, lng: 77.5955, efficiency: 88, installationDate: '2024-04-02', connections: [101, 102, 104] },
      { id: 104, houseNumber: 'MG-2B', ownerName: 'Sunita Reddy', capacity: '2,800L', lat: 12.9726, lng: 77.5943, efficiency: 93, installationDate: '2024-04-10', connections: [102, 103, 105] },
      { id: 105, houseNumber: 'MG-3A', ownerName: 'Vikram Singh', capacity: '3,200L', lat: 12.9711, lng: 77.5947, efficiency: 90, installationDate: '2024-04-18', connections: [101, 102, 104] },
      { id: 106, houseNumber: 'MG-3B', ownerName: 'Meera Joshi', capacity: '2,400L', lat: 12.9719, lng: 77.5936, efficiency: 89, installationDate: '2024-04-25', connections: [101, 102] }
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
    distanceKm: 1.2,
    topSavers: [
      { name: 'Amit Gupta', savings: '₹9,800' },
      { name: 'Ananya Das', savings: '₹8,600' },
      { name: 'Kavya Menon', savings: '₹7,400' }
    ],
    houses: [
      { id: 201, houseNumber: 'BR-1A', ownerName: 'Amit Gupta', capacity: '3,500L', lat: 12.9714, lng: 77.6095, efficiency: 87, installationDate: '2024-05-05', connections: [203, 204] },
      { id: 202, houseNumber: 'BR-1B', ownerName: 'Kavya Menon', capacity: '2,800L', lat: 12.9726, lng: 77.6104, efficiency: 90, installationDate: '2024-05-12', connections: [203, 204] },
      { id: 203, houseNumber: 'BR-2A', ownerName: 'Deepak Rao', capacity: '3,100L', lat: 12.9718, lng: 77.6091, efficiency: 85, installationDate: '2024-05-18', connections: [201, 202, 204] },
      { id: 204, houseNumber: 'BR-2B', ownerName: 'Ananya Das', capacity: '2,900L', lat: 12.9722, lng: 77.6107, efficiency: 92, installationDate: '2024-05-25', connections: [201, 202, 203] }
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
    distanceKm: 2.1,
    topSavers: [
      { name: 'Manoj Nair', savings: '₹5,200' },
      { name: 'Ravi Krishnan', savings: '₹4,800' },
      { name: 'Sneha Iyer', savings: '₹4,200' }
    ],
    houses: [
      { id: 301, houseNumber: 'KM-1A', ownerName: 'Ravi Krishnan', capacity: '2,200L', lat: 12.9346, lng: 77.6251, efficiency: 86, installationDate: '2024-06-01', connections: [303, 304] },
      { id: 302, houseNumber: 'KM-1B', ownerName: 'Sneha Iyer', capacity: '2,500L', lat: 12.9358, lng: 77.6239, efficiency: 84, installationDate: '2024-06-08', connections: [304] },
      { id: 303, houseNumber: 'KM-2A', ownerName: 'Manoj Nair', capacity: '2,800L', lat: 12.9350, lng: 77.6254, efficiency: 87, installationDate: '2024-06-15', connections: [301, 304] },
      { id: 304, houseNumber: 'KM-2B', ownerName: 'Lakshmi Pillai', capacity: '2,100L', lat: 12.9356, lng: 77.6242, efficiency: 83, installationDate: '2024-06-22', connections: [301, 302, 303] }
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
    distanceKm: 1.8,
    topSavers: [
      { name: 'Arjun Varma', savings: '₹7,900' },
      { name: 'Kiran Kumar', savings: '₹7,500' },
      { name: 'Suresh Babu', savings: '₹6,900' }
    ],
    houses: [
      { id: 401, houseNumber: 'IN-1A', ownerName: 'Arjun Varma', capacity: '3,800L', lat: 12.9791, lng: 77.6401, efficiency: 91, installationDate: '2024-07-01', connections: [403, 404, 406] },
      { id: 402, houseNumber: 'IN-1B', ownerName: 'Divya Shetty', capacity: '3,200L', lat: 12.9777, lng: 77.6415, efficiency: 89, installationDate: '2024-07-08', connections: [403, 405] },
      { id: 403, houseNumber: 'IN-2A', ownerName: 'Kiran Kumar', capacity: '3,600L', lat: 12.9783, lng: 77.6403, efficiency: 92, installationDate: '2024-07-15', connections: [401, 402, 405, 406] },
      { id: 404, houseNumber: 'IN-2B', ownerName: 'Pooja Agarwal', capacity: '2,900L', lat: 12.9789, lng: 77.6418, efficiency: 88, installationDate: '2024-07-22', connections: [401, 405, 406] },
      { id: 405, houseNumber: 'IN-3A', ownerName: 'Suresh Babu', capacity: '3,400L', lat: 12.9775, lng: 77.6407, efficiency: 90, installationDate: '2024-07-29', connections: [402, 403, 404] },
      { id: 406, houseNumber: 'IN-3B', ownerName: 'Rekha Devi', capacity: '2,700L', lat: 12.9787, lng: 77.6412, efficiency: 87, installationDate: '2024-08-05', connections: [401, 403, 404] }
    ]
  }
];

const InteractiveMap = ({ nearbySetups }: InteractiveMapProps) => {
  const [selectedSetup, setSelectedSetup] = useState<MapSetup | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<HouseSetup | null>(null);
  const [viewMode, setViewMode] = useState<'hubs' | 'houses'>('hubs');
  const [selectedHub, setSelectedHub] = useState<MapSetup | null>(null);
  const [mapRef, setMapRef] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Use provided setups or fallback to mock data
  const mapSetups = nearbySetups?.length && nearbySetups.some(setup => setup.houses && setup.houses.length > 0)
    ? nearbySetups
    : mockNearbySetups;

  // Filter setups based on search query
  const filteredSetups = mapSetups.filter(setup =>
    setup.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Default center (Bangalore, India)
  const center: [number, number] = [12.9716, 77.5946];

  // Handle hub click from map (show details only, no zoom)
  const handleHubMapClick = (setup: MapSetup) => {
    setSelectedSetup(setup);
    setSelectedHouse(null);
  };

  // Handle hub click from list (zoom to houses view)
  const handleHubListClick = (setup: MapSetup) => {
    setSelectedHub(setup);
    setViewMode('houses');
    setSelectedSetup(null);
    setSelectedHouse(null);

    // Zoom into the selected hub
    if (mapRef) {
      mapRef.setView([setup.lat, setup.lng], 18, { animate: true });
    }
  };

  // Handle house click (show house details)
  const handleHouseClick = (house: HouseSetup) => {
    setSelectedHouse(house);
    setSelectedSetup(null);
  };

  // Handle back to hubs view
  const handleBackToHubs = () => {
    setViewMode('hubs');
    setSelectedHub(null);
    setSelectedSetup(null);
    setSelectedHouse(null);

    if (mapRef) {
      mapRef.setView(center, 14, { animate: true });
    }
  };  // Create custom icon for water installations
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
    <div className="space-y-6">
      {/* Top section - Map and Hub List side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-4 lg:gap-6">
        {/* Left side - Map */}
        <Card className="p-4 lg:p-6 glass border-white/20 shadow-glass">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                {viewMode === 'hubs' ? 'Water Hub Network Map' : `${selectedHub?.address} - House Network`}
              </h3>
              {viewMode === 'houses' && (
                <button
                  onClick={handleBackToHubs}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors w-fit"
                >
                  ← Back to Hubs
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
              {viewMode === 'hubs' ? (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span className="whitespace-nowrap">Installed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1 animate-pulse"></div>
                    <span className="whitespace-nowrap">Potential Hub</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span className="whitespace-nowrap">Expanding</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                  <span className="whitespace-nowrap">House Setup</span>
                </div>
              )}
            </div>
          </div>
          <div className="h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={center}
              zoom={viewMode === 'hubs' ? 14 : 18}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
              ref={setMapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {viewMode === 'hubs' ? (
                <>
                  {/* Hub View - Show connection lines between hubs */}
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

                  {/* Hub markers */}
                  {mapSetups.map((setup) => (
                    <Marker
                      key={setup.id}
                      position={[setup.lat, setup.lng]}
                      icon={createCustomIcon(setup, selectedSetup?.id === setup.id)}
                      eventHandlers={{
                        click: () => handleHubMapClick(setup),
                      }}
                    >
                    </Marker>
                  ))}
                </>
              ) : (
                selectedHub?.houses && (
                  <>
                    {/* House View - Show connection lines between houses */}
                    {generateHouseConnections(selectedHub.houses).map((connection, index) => (
                      <Polyline
                        key={`house-connection-${index}`}
                        positions={connection.positions}
                        color={connection.color}
                        weight={2}
                        opacity={0.8}
                      />
                    ))}

                    {/* House markers */}
                    {selectedHub.houses.map((house) => (
                      <Marker
                        key={house.id}
                        position={[house.lat, house.lng]}
                        icon={createHouseIcon(house, selectedSetup?.id === house.id)}
                        eventHandlers={{
                          click: () => handleHouseClick(house),
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[180px]">
                            <div className="flex items-center mb-2">
                              <MapPin className="w-4 h-4 text-primary mr-2" />
                              <span className="font-semibold">{house.houseNumber}</span>
                            </div>
                            <div className="text-sm mb-2">
                              <span className="text-gray-600">Owner:</span>
                              <p className="font-medium">{house.ownerName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div>
                                <span className="text-gray-600">Capacity:</span>
                                <p className="font-medium">{house.capacity}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Efficiency:</span>
                                <p className="font-medium">{house.efficiency}%</p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              <span>Installed: {house.installationDate}</span>
                            </div>
                            {house.connections && house.connections.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="flex items-center text-xs text-gray-600">
                                  <Network className="w-3 h-3 mr-1" />
                                  <span>Connected to {house.connections.length} houses</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Hub center marker */}
                    <Marker
                      position={[selectedHub.lat, selectedHub.lng]}
                      icon={createCustomIcon(selectedHub, false)}
                    >
                      <Popup>
                        <div className="p-2">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-primary">{selectedHub.address}</span>
                          </div>
                          <p className="text-sm text-gray-600">Hub Center</p>
                        </div>
                      </Popup>
                    </Marker>
                  </>
                )
              )}
            </MapContainer>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {viewMode === 'hubs'
                ? `Interactive network map showing ${mapSetups.length} water harvesting hubs with interconnection potential`
                : `Detailed view of ${selectedHub?.houses?.length || 0} interconnected house installations in ${selectedHub?.address}`
              }
            </p>
          </div>
        </Card>

        {/* Right side - Hub List */}
        <Card className="p-4 glass border-white/20 shadow-glass">
          <h4 className="text-lg font-semibold mb-3">Water Hubs</h4>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search hubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground w-4 h-4 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
            {filteredSetups.map((setup) => (
              <div
                key={setup.id}
                onClick={() => handleHubListClick(setup)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedHub?.id === setup.id
                  ? 'bg-primary/20 border border-primary/30'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${setup.status === 'installed' ? 'bg-green-500' :
                        setup.status === 'potential_hub' ? 'bg-yellow-500 animate-pulse' :
                          'bg-blue-500'
                        }`}
                    />
                    <span className="font-medium text-sm">{setup.address}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {setup.houses?.length || 0} houses
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {setup.capacity} • {setup.distanceKm}km away
                </div>
              </div>
            ))}

            {filteredSetups.length === 0 && searchQuery && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hubs found matching "{searchQuery}"</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom section - Details */}
      {/* Bottom Section: Details */}
      <Card className="glass border-white/20 shadow-glass p-4 pl-8">
        <h4 className="text-lg font-semibold mb-3">Details</h4>

        {selectedSetup && (
          <motion.div
            key="hub-details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-[60%_30%] gap-16 mr-8 mb-4"
          >
            {/* Main Details */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-muted-foreground">Main Details</h5>

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold">{selectedSetup.address}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Capacity:</span>
                  <p className="font-medium">{selectedSetup.capacity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly Savings:</span>
                  <p className="font-medium text-green-600">{selectedSetup.savings}</p>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Hub Efficiency:</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedSetup.efficiency}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{selectedSetup.efficiency}%</span>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Network className="w-3 h-3" />
                    <span>{selectedSetup.houses?.length || 0} houses connected</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${selectedSetup.status === 'installed' ? 'bg-green-100 text-green-800' :
                    selectedSetup.status === 'potential_hub' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                    {selectedSetup.status === 'installed' ? 'Active Hub' :
                      selectedSetup.status === 'potential_hub' ? 'Potential Hub' : 'Expanding Hub'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleHubListClick(selectedSetup)}
                className="w-full mt-3 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                View House Network →
              </button>
            </div>

            {/* Top Water Savers */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-muted-foreground">Top Water Savers</h5>

              {selectedSetup.topSavers ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Leaders for 2024</p>
                  <div className="space-y-2">
                    {selectedSetup.topSavers.map((saver, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{saver.name}</span>
                        </div>
                        <span className="font-semibold text-green-600">{saver.savings}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-4">
                  No data available
                </div>
              )}
            </div>
          </motion.div>
        )}

        {selectedHouse && (
          <motion.div
            key="house-details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold">{selectedHouse.houseNumber}</span>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Owner:</span>
              <p className="font-medium">{selectedHouse.ownerName}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Capacity:</span>
                <p className="font-medium">{selectedHouse.capacity}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Efficiency:</span>
                <p className="font-medium">{selectedHouse.efficiency}%</p>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Installation Date:</span>
              <p className="font-medium">{selectedHouse.installationDate}</p>
            </div>

            {selectedHouse.connections && selectedHouse.connections.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center text-sm">
                  <Network className="w-3 h-3 mr-1" />
                  <span>Connected to {selectedHouse.connections.length} houses</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!selectedSetup && !selectedHouse && (
          <div className="text-center text-muted-foreground text-sm py-8">
            {viewMode === 'hubs'
              ? 'Click on a hub marker to view details, or click a hub name to explore houses'
              : 'Click on a house marker to view installation details'
            }
          </div>
        )}
      </Card>
    </div>
  );
};

export default InteractiveMap;