import { CheckCircle, Droplets, DollarSign, Gauge, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RunoffCapacityData {
    data: {
        success: boolean;
        message: string;
        data: {
            session_id: string;
            calculation_timestamp: string;
            location_info: {
                latitude: number;
                longitude: number;
            };
            area_specifications: {
                area_length_m: number;
                area_width_m: number;
                area_sqm: number;
                material_type: string;
                runoff_coefficient: number;
            };
            rainfall_data: {
                annual_rainfall_mm: number;
                monthly_average_rainfall_mm: number;
                daily_average_rainfall_mm: number;
            };
            comprehensive_runoff_analysis: {
                input_parameters: {
                    area_sqm: number;
                    annual_rainfall_mm: number;
                    material_type: string;
                };
                material_analysis: {
                    material_type: string;
                    runoff_coefficient: number;
                    collection_efficiency_percentage: number;
                    water_loss_percentage: number;
                    efficiency_rating: string;
                };
                volume_calculations: {
                    estimated_annual_runoff_liters: number;
                    estimated_monthly_average_liters: number;
                    estimated_daily_average_liters: number;
                    estimated_annual_runoff_cubic_meters: number;
                    potential_annual_collection_liters: number;
                    annual_water_loss_liters: number;
                };
                storage_recommendations: {
                    recommended_tank_capacity_liters: number;
                    minimum_tank_size_liters: number;
                    peak_monthly_capacity_needed_liters: number;
                    tank_capacity_explanation: string;
                };
                economic_analysis: {
                    annual_water_bill_savings_rs: number;
                    ten_year_savings_estimate_rs: number;
                    cost_per_liter_saved: number;
                    payback_period_note: string;
                };
                efficiency_metrics: {
                    collection_efficiency_percentage: number;
                    water_loss_percentage: number;
                    daily_collection_per_sqm_liters: number;
                    annual_collection_per_sqm_liters: number;
                };
            };
        };
    };
}

export const RunoffCapacityDataDisplay = ({ data }: RunoffCapacityData) => {
    const [showDetails, setShowDetails] = useState(false);
    const responseData = data;

    // Handle missing or invalid data
    if (!data || !responseData || !responseData.success || !responseData.data) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load runoff capacity data</p>
            </div>
        );
    }

    const runoffData = responseData.data;
    const { area_specifications, comprehensive_runoff_analysis, rainfall_data, location_info } = runoffData;

    // Check if essential data is missing
    if (!comprehensive_runoff_analysis || !comprehensive_runoff_analysis.volume_calculations) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Collection data not available</p>
            </div>
        );
    }

    // Format numbers safely
    const formatNumber = (num?: number) => {
        if (num === undefined || num === null) return 'N/A';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return 'N/A';
        return `₹${formatNumber(amount)}`;
    };

    const formatPercentage = (value?: number) => {
        if (value === undefined || value === null) return 'N/A';
        return `${value.toFixed(1)}%`;
    };

    return (
        <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 hidden sm:inline">Runoff Analysis Complete</span>
                <span className="text-sm font-medium text-green-600 sm:hidden">Complete</span>
            </div>

            {/* Key Metrics - Always Visible */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="text-center">
                        <div className="text-2xl mb-1">💧</div>
                        <div className="text-lg font-bold text-blue-800">
                            {formatNumber(comprehensive_runoff_analysis.volume_calculations?.estimated_annual_runoff_liters)}L
                        </div>
                        <div className="text-xs text-blue-600">Annual Collection</div>
                    </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-center">
                        <div className="text-2xl mb-1">⚡</div>
                        <div className="text-lg font-bold text-green-800">
                            {formatPercentage(comprehensive_runoff_analysis.material_analysis?.collection_efficiency_percentage)}
                        </div>
                        <div className="text-xs text-green-600">
                            {comprehensive_runoff_analysis.material_analysis?.efficiency_rating || 'Efficiency'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Area Summary */}
            {area_specifications && (
                <div className="bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-slate-800 hidden sm:inline">Area Specs</span>
                            <span className="text-sm font-medium text-slate-800 sm:hidden">Area</span>
                        </div>
                        <div className="text-xs text-slate-600">
                            {area_specifications.area_sqm ? `${area_specifications.area_sqm.toLocaleString()} m²` : 'N/A'}
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                        <span>Material: {area_specifications.material_type}</span>
                        <span>Coeff: {area_specifications.runoff_coefficient}</span>
                    </div>
                </div>
            )}

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
                    {/* Volume Analysis */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Volume Breakdown</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-700">
                            <div>
                                <span className="font-medium">Monthly Avg:</span>
                                <div className="text-lg font-bold">{formatNumber(comprehensive_runoff_analysis.volume_calculations?.estimated_monthly_average_liters)}L</div>
                            </div>
                            <div>
                                <span className="font-medium">Daily Avg:</span>
                                <div className="text-lg font-bold">{formatNumber(comprehensive_runoff_analysis.volume_calculations?.estimated_daily_average_liters)}L</div>
                            </div>
                            <div className="sm:col-span-2 text-xs text-blue-600 mt-2">
                                <div>• Potential Collection: {formatNumber(comprehensive_runoff_analysis.volume_calculations?.potential_annual_collection_liters)}L</div>
                                <div>• Water Loss: {formatNumber(comprehensive_runoff_analysis.volume_calculations?.annual_water_loss_liters)}L</div>
                            </div>
                        </div>
                    </div>

                    {/* Storage Recommendations */}
                    {comprehensive_runoff_analysis.storage_recommendations && (
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <Gauge className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">Storage Requirements</span>
                            </div>
                            <div className="space-y-2 text-sm text-purple-700">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div>
                                        <span className="font-medium">Minimum:</span>
                                        <div className="text-lg font-bold">{formatNumber(comprehensive_runoff_analysis.storage_recommendations.minimum_tank_size_liters)}L</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Recommended:</span>
                                        <div className="text-lg font-bold">{formatNumber(comprehensive_runoff_analysis.storage_recommendations.recommended_tank_capacity_liters)}L</div>
                                    </div>
                                </div>
                                <div className="text-xs text-purple-600 mt-2">
                                    <div>• Peak Monthly: {formatNumber(comprehensive_runoff_analysis.storage_recommendations.peak_monthly_capacity_needed_liters)}L</div>
                                    <div>• {comprehensive_runoff_analysis.storage_recommendations.tank_capacity_explanation}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Economic Analysis */}
                    {comprehensive_runoff_analysis.economic_analysis && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <DollarSign className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">Economic Benefits</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-yellow-700">
                                <div>
                                    <span className="font-medium">Annual Savings:</span>
                                    <div className="text-lg font-bold">
                                        {formatCurrency(comprehensive_runoff_analysis.economic_analysis.annual_water_bill_savings_rs)}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium">10-Year Savings:</span>
                                    <div className="text-lg font-bold">
                                        {formatCurrency(comprehensive_runoff_analysis.economic_analysis.ten_year_savings_estimate_rs)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-yellow-600 mt-2">
                                <div>• Cost per liter: ₹{comprehensive_runoff_analysis.economic_analysis.cost_per_liter_saved?.toFixed(3)}</div>
                                <div>• {comprehensive_runoff_analysis.economic_analysis.payback_period_note}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};