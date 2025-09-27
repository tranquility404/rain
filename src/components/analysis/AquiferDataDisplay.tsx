import { CheckCircle, MapPin, Layers, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AquiferData {
    data: {
        aquifer_data: {
            status: string;
            coordinates: {
                latitude: number;
                longitude: number;
                formatted: string;
            };
            location: {
                state_code: string;
                state_name: string;
                state_capital: string;
                city: string;
                district: string;
                area: string;
                region: string;
                coordinates: {
                    latitude: number;
                    longitude: number;
                    formatted: string;
                };
            };
            principle_aquifer: {
                name: string;
                code: string;
                type: string;
            };
            aquifer_details: {
                GmlID: string;
                objectid: number;
                newcode14: string;
                aquifer: string;
                newcode43: string;
                aquifer0: string;
                system: string;
                aquifers: string;
                zone_m: string;
                mbgl: string;
                avg_mbgl: string;
                m2_perday: string;
                m3_per_day: string;
                yeild__: string;
                per_cm: string;
                state: string;
                pa_order: number;
                test: string;
                area_re: number;
            };
            data_quality: string;
        };
    };
}

export const AquiferDataDisplay = ({ data }: AquiferData) => {
    const [showDetails, setShowDetails] = useState(false);
    const aquiferData = data?.aquifer_data;

    // Handle missing or invalid data
    if (!data || !aquiferData || aquiferData.status !== 'success') {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load aquifer data</p>
            </div>
        );
    }

    const { location, principle_aquifer, aquifer_details, coordinates } = aquiferData;

    // Check if essential data is missing
    if (!principle_aquifer || !aquifer_details) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Aquifer information not available</p>
            </div>
        );
    }

    // Get quality indicator based on yield percentage
    const getYieldQuality = (yieldStr?: string) => {
        if (!yieldStr) return { text: "Unknown", color: "gray" };
        const yieldRange = yieldStr.replace('%', '').trim();
        const avgYield = parseFloat(yieldRange.split(' - ')[0]) || 0;

        if (avgYield >= 15) return { text: "Excellent", color: "green" };
        if (avgYield >= 10) return { text: "Good", color: "blue" };
        if (avgYield >= 5) return { text: "Fair", color: "yellow" };
        return { text: "Poor", color: "red" };
    };

    const yieldQuality = getYieldQuality(aquifer_details?.yeild__);

    return (
        <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 hidden sm:inline">Aquifer Analysis Complete</span>
                <span className="text-sm font-medium text-green-600 sm:hidden">Complete</span>
            </div>

            {/* Aquifer Type - Always Visible */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-center">
                    <div className="text-2xl mb-2">🏔️</div>
                    <h3 className="text-sm sm:text-base font-bold text-blue-800 mb-1 line-clamp-2">
                        {principle_aquifer?.name || 'Unknown Aquifer'}
                    </h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                            {principle_aquifer?.type || 'N/A'}
                        </Badge>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                            {principle_aquifer?.code || 'N/A'}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Key Metrics - Always Visible */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1 hidden sm:inline">Depth Range</div>
                    <div className="text-xs text-slate-600 mb-1 sm:hidden">Depth</div>
                    <div className="text-sm font-semibold text-slate-800">{aquifer_details?.mbgl || 'N/A'} m</div>
                    <div className="text-xs text-slate-500">BGL</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1 hidden sm:inline">Yield Range</div>
                    <div className="text-xs text-slate-600 mb-1 sm:hidden">Yield</div>
                    <div className="text-sm font-semibold text-slate-800">{aquifer_details?.yeild__ || 'N/A'}</div>
                    <Badge
                        variant={yieldQuality.color === 'green' ? 'default' : 'secondary'}
                        className={`text-xs mt-1 ${yieldQuality.color === 'green' ? 'bg-green-100 text-green-800' :
                            yieldQuality.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                yieldQuality.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                            }`}
                    >
                        {yieldQuality.text}
                    </Badge>
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
                    {/* Location Information */}
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Location Details</span>
                        </div>
                        <div className="space-y-2 text-sm text-purple-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div><span className="font-medium">State:</span> {location?.state_name || 'N/A'}</div>
                                <div><span className="font-medium">District:</span> {location?.district || 'N/A'}</div>
                                <div><span className="font-medium">City:</span> {location?.city || 'N/A'}</div>
                                <div><span className="font-medium">Region:</span> {location?.region || 'N/A'}</div>
                            </div>
                            <div className="text-xs text-purple-600 mt-2">
                                📍 {coordinates?.formatted || location?.coordinates?.formatted || 'Coordinates not available'}
                            </div>
                        </div>
                    </div>

                    {/* Aquifer Properties */}
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Layers className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Properties</span>
                        </div>
                        <div className="space-y-2 text-sm text-amber-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div><span className="font-medium">System:</span> {aquifer_details?.system || 'N/A'}</div>
                                <div><span className="font-medium">Type:</span> {aquifer_details?.aquifers || 'N/A'}</div>
                                <div><span className="font-medium">Zone:</span> {aquifer_details?.zone_m || 'N/A'} m</div>
                                <div><span className="font-medium">Avg Depth:</span> {aquifer_details?.avg_mbgl || 'N/A'} m</div>
                            </div>
                        </div>
                    </div>

                    {/* Flow & Capacity */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Info className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Flow Characteristics</span>
                        </div>
                        <div className="space-y-2 text-sm text-green-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {aquifer_details?.m2_perday && (
                                    <div>
                                        <span className="font-medium hidden sm:inline">Transmissivity:</span>
                                        <span className="font-medium sm:hidden">Trans:</span>
                                        <br />
                                        <span className="text-xs">{aquifer_details.m2_perday} m²/day</span>
                                    </div>
                                )}
                                {aquifer_details?.m3_per_day && (
                                    <div>
                                        <span className="font-medium hidden sm:inline">Discharge:</span>
                                        <span className="font-medium sm:hidden">Flow:</span>
                                        <br />
                                        <span className="text-xs">{aquifer_details.m3_per_day} m³/day</span>
                                    </div>
                                )}
                                {aquifer_details?.per_cm && (
                                    <div className="sm:col-span-2">
                                        <span className="font-medium">Permeability:</span>
                                        <span className="text-xs ml-1">{aquifer_details.per_cm} cm/s</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Data Quality & Assessment */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-blue-800">Data Assessment</h4>
                            <Badge variant="secondary" className="text-blue-700">
                                {aquiferData?.data_quality || 'Unknown'}
                            </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-blue-700">
                            <div>• Aquifer ID: {aquifer_details?.GmlID || 'N/A'}</div>
                            <div>• Coverage Area: {aquifer_details?.area_re ? `${(aquifer_details.area_re / 1000000).toFixed(1)} km²` : 'N/A'}</div>
                            <div>• Regional survey data - consult local hydrogeologist for site-specific analysis</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};