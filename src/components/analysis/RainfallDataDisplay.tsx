import { CheckCircle, MapPin, Thermometer, CloudRain, ChevronDown, ChevronUp, Droplets, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Generic data display component
export const DataDisplay = ({ data }: { data: any }) => (
    <div className="space-y-2">
        <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">Data Ready</span>
        </div>
    </div>
);

// Specialized rainfall data display component
export const RainfallDataDisplay = ({ data }: { data: any }) => {
    const [showDetails, setShowDetails] = useState(false);
    const rainfallData = data?.rainfall_data;

    // Handle missing or invalid data
    if (!data) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load rainfall data</p>
            </div>
        );
    }

    if (!rainfallData) return <DataDisplay data={data} />;

    const formatTemp = (temp?: number) => (temp !== undefined && temp !== null) ? `${temp}°C` : 'N/A';
    const formatHumidity = (humidity?: number) => (humidity !== undefined && humidity !== null) ? `${humidity}%` : 'N/A';
    const formatRainfall = (value?: number) => (value !== undefined && value !== null) ? `${value}` : 'N/A';

    return (
        <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 hidden sm:inline">Rainfall Analysis Complete</span>
                <span className="text-sm font-medium text-green-600 sm:hidden">Ready</span>
            </div>

            {/* Key Metrics - Always Visible */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-200">
                    <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-blue-700">
                            {formatRainfall(rainfallData.annual_summary?.estimated_annual_rainfall_mm)}
                        </p>
                        <p className="text-xs text-blue-600">Annual (mm)</p>
                    </div>
                </div>
                <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                    <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-green-700">
                            {formatRainfall(rainfallData.detailed_statistics?.monthly_average)}
                        </p>
                        <p className="text-xs text-green-600">Monthly Avg (mm)</p>
                    </div>
                </div>
            </div>

            {/* Weather Summary */}
            <div className="bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-800 hidden sm:inline">Current Weather</span>
                        <span className="text-sm font-medium text-slate-800 sm:hidden">Weather</span>
                    </div>
                    <div className="text-xs text-slate-600">
                        {formatTemp(rainfallData.current_weather?.temperature_celsius)} • {formatHumidity(rainfallData.current_weather?.humidity_percent)}
                    </div>
                </div>
                {rainfallData.current_weather?.description && (
                    <div className="text-xs text-slate-500 mt-1 capitalize">
                        {rainfallData.current_weather.description}
                    </div>
                )}
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
                    {/* Location Info */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Location</span>
                        </div>
                        <p className="text-sm text-blue-700">
                            {rainfallData.location_info?.location_name || 'Location data unavailable'}
                        </p>
                        {rainfallData.location_info?.coordinates && (
                            <div className="text-xs text-blue-600 mt-1">
                                {rainfallData.location_info.coordinates.latitude.toFixed(4)}, {rainfallData.location_info.coordinates.longitude.toFixed(4)}
                            </div>
                        )}
                    </div>

                    {/* Seasonal Analysis */}
                    {rainfallData.seasonal_analysis?.seasonal_totals && (
                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                            <h4 className="text-sm font-medium text-indigo-800 mb-2">Seasonal Pattern</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(rainfallData.seasonal_analysis.seasonal_totals).map(([season, amount]) => (
                                    <div key={season} className="text-center bg-white p-2 rounded border border-indigo-200">
                                        <p className="text-sm font-bold text-indigo-700">{Number(amount) || 0}mm</p>
                                        <p className="text-xs text-indigo-600 capitalize">{season}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-xs text-indigo-600">
                                Wettest: {rainfallData.seasonal_analysis.wettest_season} •
                                Driest: {rainfallData.seasonal_analysis.driest_season}
                            </div>
                        </div>
                    )}

                    {/* Assessment & Recommendations */}
                    {rainfallData.rainfall_assessment && (
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <CloudRain className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-800">Assessment</span>
                                </div>
                                <Badge variant="secondary" className="text-emerald-700">
                                    {rainfallData.rainfall_assessment.category} ({rainfallData.rainfall_assessment.overall_score}/100)
                                </Badge>
                            </div>
                            <p className="text-xs text-emerald-700 mb-2">
                                <span className="font-medium">Potential:</span> {rainfallData.rainfall_assessment.harvesting_potential}
                            </p>
                            {rainfallData.rainfall_assessment.recommendations && (
                                <div className="space-y-1">
                                    {rainfallData.rainfall_assessment.recommendations.slice(0, 2).map((rec: string, index: number) => (
                                        <div key={index} className="text-xs text-emerald-600">
                                            • {rec}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Data Quality & Statistics */}
                    {rainfallData.annual_summary && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-yellow-800">Data Quality</span>
                                <Badge variant="secondary" className="text-yellow-700">
                                    {rainfallData.annual_summary.data_quality}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-yellow-700">
                                <div>Rainy Days: {rainfallData.annual_summary.rainy_days_count}</div>
                                <div>Max Daily: {rainfallData.annual_summary.maximum_daily_rainfall_mm}mm</div>
                                <div>Data Points: {rainfallData.annual_summary.data_points_available}</div>
                                <div>Period: 2 years</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};