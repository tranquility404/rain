import { CheckCircle, Droplets, TrendingUp, ChevronDown, ChevronUp, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GroundwaterData {
    data: {
        success: boolean;
        target_coordinates: {
            latitude: number;
            longitude: number;
        };
        nearest_location: {
            LocationName: string;
            RegionID: number;
            state: number;
            DistrictName: string;
            Block_Taluk: string;
            Village: string;
            Latitude: string;
            Longitude: string;
            Well_Depth: number;
            date: string;
            Water_level: number;
            distance_km: number;
        };
        message: string;
    };
}

export const GroundwaterDataDisplay = ({ data }: GroundwaterData) => {
    const [showDetails, setShowDetails] = useState(false);
    const groundwaterData = data;

    // Handle missing or invalid data
    if (!data || !groundwaterData || !groundwaterData.success) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load groundwater data</p>
            </div>
        );
    }

    const { target_coordinates, nearest_location, message } = groundwaterData;

    // Check if essential data is missing
    if (!nearest_location) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Groundwater information not available</p>
            </div>
        );
    }

    // Format date
    const formatDate = (dateString: string) => {
        // Handle DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get water level category based on depth
    const getWaterLevelCategory = (waterLevel: number, wellDepth: number) => {
        const percentDepth = (waterLevel / wellDepth) * 100;
        if (percentDepth <= 25) return { text: "Shallow", color: "green" };
        if (percentDepth <= 50) return { text: "Moderate", color: "yellow" };
        if (percentDepth <= 75) return { text: "Deep", color: "orange" };
        return { text: "Very Deep", color: "red" };
    };

    // Get distance indicator
    const getDistanceQuality = (distance: number) => {
        if (distance <= 1) return { text: "Very Close", color: "green" };
        if (distance <= 3) return { text: "Nearby", color: "blue" };
        if (distance <= 5) return { text: "Moderate", color: "yellow" };
        return { text: "Distant", color: "red" };
    };

    const waterLevelCategory = getWaterLevelCategory(nearest_location.Water_level, nearest_location.Well_Depth);
    const distanceQuality = getDistanceQuality(nearest_location.distance_km);

    return (
        <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 hidden sm:inline">Groundwater Analysis Complete</span>
                <span className="text-sm font-medium text-green-600 sm:hidden">Complete</span>
            </div>

            {/* Water Level - Always Visible */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-center">
                    <div className="text-3xl mb-2">💧</div>
                    <h3 className="text-lg font-bold text-blue-800 mb-1">
                        {nearest_location?.Water_level !== undefined ? `${nearest_location.Water_level}m` : 'N/A'}
                    </h3>
                    <div className="text-xs text-blue-600 mb-2">Water Level (BGL)</div>
                    <div className="flex flex-wrap gap-1 justify-center">
                        <Badge
                            variant="outline"
                            className={`${waterLevelCategory.color === 'green' ? 'text-green-700 border-green-300' :
                                waterLevelCategory.color === 'yellow' ? 'text-yellow-700 border-yellow-300' :
                                    waterLevelCategory.color === 'orange' ? 'text-orange-700 border-orange-300' :
                                        'text-red-700 border-red-300'
                                }`}
                        >
                            {waterLevelCategory.text}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            {nearest_location.distance_km}km away
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Key Metrics - Always Visible */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-1 mb-1">
                        <Droplets className="w-3 h-3 text-slate-600" />
                        <div className="text-xs text-slate-600 hidden sm:inline">Well Depth</div>
                        <div className="text-xs text-slate-600 sm:hidden">Depth</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                        {nearest_location?.Well_Depth !== undefined ? `${nearest_location.Well_Depth}m` : 'N/A'}
                    </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-1 mb-1">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        <div className="text-xs text-slate-600 hidden sm:inline">Last Reading</div>
                        <div className="text-xs text-slate-600 sm:hidden">Date</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                        {nearest_location?.date ? formatDate(nearest_location.date) : 'N/A'}
                    </div>
                </div>
            </div>

            {/* Expandable Details */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full"
            >
                {showDetails ? (
                    <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Hide Details</span>
                        <span className="sm:hidden">Less</span>
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Show Details</span>
                        <span className="sm:hidden">More</span>
                    </>
                )}
            </Button>

            {/* Detailed Information - Collapsible */}
            {showDetails && (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                    {/* Well Information */}
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Droplets className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Monitoring Well</span>
                        </div>
                        <div className="space-y-2 text-sm text-purple-700">
                            <div>
                                <span className="font-medium">Well ID:</span> {nearest_location?.LocationName || 'N/A'}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <span className="font-medium">Village:</span> {nearest_location?.Village || 'N/A'}
                                </div>
                                <div>
                                    <span className="font-medium">Block:</span> {nearest_location?.Block_Taluk || 'N/A'}
                                </div>
                                <div>
                                    <span className="font-medium">District:</span> {nearest_location?.DistrictName || 'N/A'}
                                </div>
                                <div>
                                    <span className="font-medium">Distance:</span> {nearest_location?.distance_km}km
                                </div>
                            </div>
                            <div className="text-xs text-purple-600 mt-2">
                                📍 {parseFloat(nearest_location?.Latitude || '0').toFixed(4)}, {parseFloat(nearest_location?.Longitude || '0').toFixed(4)}
                            </div>
                        </div>
                    </div>

                    {/* Water Level Analysis */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Water Analysis</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                            <div>
                                <span className="font-medium">Well Depth:</span>
                                <div className="text-lg font-bold">{nearest_location?.Well_Depth}m</div>
                            </div>
                            <div>
                                <span className="font-medium">Water Level:</span>
                                <div className="text-lg font-bold">{nearest_location?.Water_level}m BGL</div>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-green-600">
                            Available water depth: {(nearest_location?.Well_Depth - nearest_location?.Water_level).toFixed(2)}m
                        </div>
                    </div>

                    {/* Data Source Information */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Data Source</span>
                        </div>
                        <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex items-center justify-between">
                                <span>Proximity Quality:</span>
                                <Badge
                                    variant="secondary"
                                    className={`text-xs ${distanceQuality.color === 'green' ? 'bg-green-100 text-green-800' :
                                            distanceQuality.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                distanceQuality.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {distanceQuality.text}
                                </Badge>
                            </div>
                            <div className="text-xs text-blue-600">
                                • {message}
                            </div>
                            <div className="text-xs text-blue-600">
                                • Reading from: {formatDate(nearest_location.date)}
                            </div>
                        </div>
                    </div>

                    {/* Assessment Warning */}
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">Important Note</span>
                        </div>
                        <div className="space-y-1 text-xs text-yellow-700">
                            <div>• Data from nearest monitoring well ({nearest_location.distance_km}km away)</div>
                            <div>• Local groundwater levels may vary significantly</div>
                            <div>• Site-specific hydrogeological assessment recommended</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};