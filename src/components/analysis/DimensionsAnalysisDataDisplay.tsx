import { CheckCircle, Ruler, Calculator, ChevronDown, ChevronUp, Home, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DimensionsAnalysisData {
    data: {
        pit: {
            recommended_count: number;
            total_cost: string;
        };
        trench: {
            recommended_length_m: number;
            total_cost: string;
        };
        shaft: {
            recommended_count: number;
            total_cost: string;
        };
    };
}

export const DimensionsAnalysisDataDisplay = ({ data }: DimensionsAnalysisData) => {
    const [showDetails, setShowDetails] = useState(false);
    const dimensionsData = data;

    // Handle missing or invalid data
    if (!data || !dimensionsData) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load dimensions analysis</p>
            </div>
        );
    }

    const { pit, trench, shaft } = dimensionsData;

    // Check if essential data is missing
    if (!pit && !trench && !shaft) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Dimensions analysis not available</p>
            </div>
        );
    }

    // Format numbers
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    // Parse cost string and format
    const parseCost = (costString: string) => {
        const numericValue = parseInt(costString.replace(/[^0-9]/g, ''));
        return numericValue;
    };

    const formatCurrency = (costString: string) => {
        const amount = parseCost(costString);
        return `₹${formatNumber(amount)}`;
    };

    // Calculate total cost across all components
    const totalCost = parseCost(pit?.total_cost || '0') +
        parseCost(trench?.total_cost || '0') +
        parseCost(shaft?.total_cost || '0');

    // Get most expensive component
    const getMostExpensive = () => {
        const costs = [
            { name: 'Pit', cost: parseCost(pit?.total_cost || '0'), icon: '⚫', data: pit },
            { name: 'Trench', cost: parseCost(trench?.total_cost || '0'), icon: '📏', data: trench },
            { name: 'Shaft', cost: parseCost(shaft?.total_cost || '0'), icon: '🕳️', data: shaft }
        ];
        return costs.reduce((max, current) => current.cost > max.cost ? current : max);
    };

    const mostExpensive = getMostExpensive();

    return (
        <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 hidden sm:inline">Tank Dimensions Analysis Complete</span>
                <span className="text-sm font-medium text-green-600 sm:hidden">Analysis Ready</span>
            </div>

            {/* Total Cost Summary - Always Visible */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-center">
                    <div className="text-3xl mb-2">🏗️</div>
                    <h3 className="text-lg font-bold text-blue-800 mb-1">
                        ₹{formatNumber(totalCost)}
                    </h3>
                    <div className="text-xs text-blue-600 mb-2">Total Installation Cost</div>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                        {mostExpensive.name} (Highest)
                    </Badge>
                </div>
            </div>

            {/* Component Counts - Always Visible */}
            <div className="grid grid-cols-3 gap-2">
                {pit && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <div className="text-center">
                            <div className="text-lg mb-1">⚫</div>
                            <div className="text-sm font-semibold text-slate-800">{pit.recommended_count}</div>
                            <div className="text-xs text-slate-600">Pits</div>
                        </div>
                    </div>
                )}
                {trench && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <div className="text-center">
                            <div className="text-lg mb-1">📏</div>
                            <div className="text-sm font-semibold text-slate-800">{trench.recommended_length_m}m</div>
                            <div className="text-xs text-slate-600">Trench</div>
                        </div>
                    </div>
                )}
                {shaft && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <div className="text-center">
                            <div className="text-lg mb-1">🕳️</div>
                            <div className="text-sm font-semibold text-slate-800">{shaft.recommended_count}</div>
                            <div className="text-xs text-slate-600">Shafts</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Most Expensive Component - Always Visible */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-center">
                    <div className="text-2xl mb-2">{mostExpensive.icon}</div>
                    <h4 className="text-sm font-bold text-green-800 mb-1">
                        {mostExpensive.name} - Highest Cost
                    </h4>
                    <div className="text-xs text-green-600 mb-2">
                        <span className="hidden sm:inline">{formatCurrency(mostExpensive.data?.total_cost || '0')}</span>
                        <span className="sm:hidden">{formatCurrency(mostExpensive.data?.total_cost || '0')}</span>
                    </div>
                    <Badge variant="secondary" className="text-green-700">
                        {((mostExpensive.cost / totalCost) * 100).toFixed(1)}% of total
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
                        <span className="hidden sm:inline">Hide Component Breakdown</span>
                        <span className="sm:hidden">Less</span>
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Show Component Breakdown</span>
                        <span className="sm:hidden">Details</span>
                    </>
                )}
            </Button>

            {/* Detailed Component Breakdown - Collapsible */}
            {showDetails && (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                    {/* Pit Analysis */}
                    {pit && (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">⚫</span>
                                <span className="text-sm font-medium text-amber-800">Recharge Pits</span>
                                {mostExpensive.name === 'Pit' && (
                                    <Badge variant="default" className="bg-red-100 text-red-800 text-xs">
                                        Highest Cost
                                    </Badge>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <div className="text-xs text-amber-600 mb-1">Recommended Count</div>
                                    <div className="text-lg font-bold text-amber-800">
                                        {pit.recommended_count} pits
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-amber-600 mb-1">Total Cost</div>
                                    <div className="text-lg font-bold text-amber-800">
                                        {formatCurrency(pit.total_cost)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-amber-700">
                                • Vertical infiltration structures for groundwater recharge
                                • Suitable for areas with permeable soil layers
                                • Cost includes excavation, materials, and labor
                            </div>
                        </div>
                    )}

                    {/* Trench Analysis */}
                    {trench && (
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">📏</span>
                                <span className="text-sm font-medium text-purple-800">Infiltration Trench</span>
                                {mostExpensive.name === 'Trench' && (
                                    <Badge variant="default" className="bg-red-100 text-red-800 text-xs">
                                        Highest Cost
                                    </Badge>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <div className="text-xs text-purple-600 mb-1">Recommended Length</div>
                                    <div className="text-lg font-bold text-purple-800">
                                        {trench.recommended_length_m}m
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-purple-600 mb-1">Total Cost</div>
                                    <div className="text-lg font-bold text-purple-800">
                                        {formatCurrency(trench.total_cost)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-purple-700">
                                • Horizontal infiltration for surface water management
                                • Effective for slope areas and contour drainage
                                • Includes excavation, filter media, and protective covering
                            </div>
                        </div>
                    )}

                    {/* Shaft Analysis */}
                    {shaft && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">🕳️</span>
                                <span className="text-sm font-medium text-green-800">Recharge Shafts</span>
                                {mostExpensive.name === 'Shaft' && (
                                    <Badge variant="default" className="bg-red-100 text-red-800 text-xs">
                                        Highest Cost
                                    </Badge>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <div className="text-xs text-green-600 mb-1">Recommended Count</div>
                                    <div className="text-lg font-bold text-green-800">
                                        {shaft.recommended_count} shafts
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-green-600 mb-1">Total Cost</div>
                                    <div className="text-lg font-bold text-green-800">
                                        {formatCurrency(shaft.total_cost)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-green-700">
                                • Deep vertical recharge structures for aquifer injection
                                • Suitable for areas with impermeable surface layers
                                • Includes drilling, casing, screen installation, and development
                            </div>
                        </div>
                    )}

                    {/* Cost Summary */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Calculator className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Cost Analysis</span>
                        </div>
                        <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex justify-between items-center font-bold text-base border-t pt-2">
                                <span>Total Project Cost:</span>
                                <span>₹{formatNumber(totalCost)}</span>
                            </div>
                        </div>
                        <div className="text-xs text-blue-600 mt-2">
                            • Costs are estimated based on standard rates and specifications
                            • Actual costs may vary depending on site conditions and local rates
                            • Professional site assessment recommended before implementation
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};