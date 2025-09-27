import { CheckCircle, DollarSign, TrendingUp, ChevronDown, ChevronUp, Calculator, PiggyBank } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CostAnalysisData {
    data: {
        input: {
            area_m2: number;
            assumed_height_m_for_pit: number;
        };
        pit: {
            unit_dimensions_m: {
                length_m: number;
                width_m: number;
                depth_m: number;
            };
            unit_volume_m3: number;
            units_needed: number;
            cost_per_unit: number;
            total_cost: number;
        };
        trench: {
            unit_dimensions_m: {
                width_m: number;
                depth_m: number;
            };
            length_m_needed: number;
            unit_volume_m3: number;
            cost_total: number;
        };
        shaft: {
            unit_dimensions_m: {
                diameter_m: number;
                depth_m: number;
            };
            unit_volume_m3: number;
            units_needed: number;
            cost_per_unit: number;
            total_cost: number;
        };
        summary: {
            cheapest_option: {
                structure: string;
                cost: number;
            };
        };
    };
}

export const CostAnalysisDataDisplay = ({ data }: CostAnalysisData) => {
    const [showDetails, setShowDetails] = useState(false);
    const costData = data;

    // Handle missing or invalid data
    if (!data || !costData) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load cost analysis</p>
            </div>
        );
    }

    const { input, pit, trench, shaft, summary } = costData;

    // Check if essential data is missing
    if (!pit && !trench && !shaft) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Cost analysis not available</p>
            </div>
        );
    }

    // Format numbers
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    const formatCurrency = (amount: number) => {
        return `₹${formatNumber(amount)}`;
    };

    // Calculate total costs for all options
    const getAllCosts = () => {
        const costs = [];
        if (pit) costs.push({ name: 'Pit', cost: pit.total_cost, icon: '⚫', data: pit });
        if (trench) costs.push({ name: 'Trench', cost: trench.cost_total, icon: '📏', data: trench });
        if (shaft) costs.push({ name: 'Shaft', cost: shaft.total_cost, icon: '🕳️', data: shaft });
        return costs.sort((a, b) => a.cost - b.cost);
    };

    const allCosts = getAllCosts();
    const cheapestOption = allCosts[0];
    const mostExpensiveOption = allCosts[allCosts.length - 1];
    const totalRange = mostExpensiveOption.cost - cheapestOption.cost;

    // Get cost efficiency assessment
    const getCostEfficiency = (cost: number) => {
        if (cost === cheapestOption.cost) return { text: 'Most Efficient', color: 'green' };
        const percentageIncrease = ((cost - cheapestOption.cost) / cheapestOption.cost) * 100;
        if (percentageIncrease <= 50) return { text: 'Good Value', color: 'blue' };
        if (percentageIncrease <= 100) return { text: 'Moderate', color: 'yellow' };
        return { text: 'Expensive', color: 'red' };
    };

    return (
        <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 hidden sm:inline">Financial Analysis Complete</span>
                <span className="text-sm font-medium text-green-600 sm:hidden">Analysis Ready</span>
            </div>

            {/* Cheapest Option - Always Visible */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-center">
                    <div className="text-3xl mb-2">{cheapestOption.icon}</div>
                    <h3 className="text-lg font-bold text-blue-800 mb-1">
                        {formatCurrency(cheapestOption.cost)}
                    </h3>
                    <div className="text-xs text-blue-600 mb-2">
                        {cheapestOption.name} - Most Cost Effective
                    </div>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                        Best Value Option
                    </Badge>
                </div>
            </div>

            {/* Cost Comparison - Always Visible */}
            <div className="grid grid-cols-3 gap-2">
                {allCosts.map((option) => {
                    const efficiency = getCostEfficiency(option.cost);
                    return (
                        <div key={option.name} className={`p-2 rounded-lg border ${option.name === cheapestOption.name ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                            }`}>
                            <div className="text-center">
                                <div className="text-lg mb-1">{option.icon}</div>
                                <div className="text-xs font-semibold text-slate-800">
                                    {formatCurrency(option.cost)}
                                </div>
                                <div className="text-xs text-slate-600 mb-1">{option.name}</div>
                                <Badge
                                    variant="secondary"
                                    className={`text-xs ${efficiency.color === 'green' ? 'bg-green-100 text-green-800' :
                                            efficiency.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                efficiency.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {efficiency.text}
                                </Badge>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Cost Range Analysis */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-center">
                    <h4 className="text-sm font-bold text-green-800 mb-1">
                        Cost Savings Opportunity
                    </h4>
                    <div className="text-xs text-green-600 mb-2">
                        Save up to {formatCurrency(totalRange)} by choosing {cheapestOption.name}
                    </div>
                    <Badge variant="secondary" className="text-green-700">
                        {((totalRange / mostExpensiveOption.cost) * 100).toFixed(1)}% potential savings
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
                        <span className="hidden sm:inline">Hide Detailed Analysis</span>
                        <span className="sm:hidden">Less</span>
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Show Detailed Analysis</span>
                        <span className="sm:hidden">Details</span>
                    </>
                )}
            </Button>

            {/* Detailed Cost Analysis - Collapsible */}
            {showDetails && (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                    {/* Project Input Parameters */}
                    {input && (
                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <Calculator className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-indigo-800">Project Parameters</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-indigo-700">
                                <div>
                                    <span className="font-medium">Area:</span> {input.area_m2.toLocaleString()} m²
                                </div>
                                <div>
                                    <span className="font-medium">Assumed Depth:</span> {input.assumed_height_m_for_pit}m
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pit Cost Analysis */}
                    {pit && (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">⚫</span>
                                <span className="text-sm font-medium text-amber-800">Recharge Pit Analysis</span>
                                {cheapestOption.name === 'Pit' && (
                                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                        Most Cost Effective
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-2 text-sm text-amber-700">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="font-medium">Dimensions:</span>
                                        <div className="text-xs">
                                            {pit.unit_dimensions_m.length_m}m × {pit.unit_dimensions_m.width_m}m × {pit.unit_dimensions_m.depth_m}m
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Unit Volume:</span>
                                        <div className="text-xs">{pit.unit_volume_m3} m³</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Units Needed:</span>
                                        <div className="text-lg font-bold text-amber-800">{pit.units_needed}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Cost per Unit:</span>
                                        <div className="text-xs">{formatCurrency(pit.cost_per_unit)}</div>
                                    </div>
                                </div>
                                <div className="bg-amber-100 p-2 rounded border-t border-amber-300">
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total Cost:</span>
                                        <span className="text-lg text-amber-900">{formatCurrency(pit.total_cost)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trench Cost Analysis */}
                    {trench && (
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">📏</span>
                                <span className="text-sm font-medium text-purple-800">Infiltration Trench Analysis</span>
                                {cheapestOption.name === 'Trench' && (
                                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                        Most Cost Effective
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-2 text-sm text-purple-700">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="font-medium">Dimensions:</span>
                                        <div className="text-xs">
                                            {trench.unit_dimensions_m.width_m}m wide × {trench.unit_dimensions_m.depth_m}m deep
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Total Volume:</span>
                                        <div className="text-xs">{trench.unit_volume_m3.toFixed(1)} m³</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Length Needed:</span>
                                        <div className="text-lg font-bold text-purple-800">{trench.length_m_needed}m</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Cost per m³:</span>
                                        <div className="text-xs">{formatCurrency(trench.cost_total / trench.unit_volume_m3)}</div>
                                    </div>
                                </div>
                                <div className="bg-purple-100 p-2 rounded border-t border-purple-300">
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total Cost:</span>
                                        <span className="text-lg text-purple-900">{formatCurrency(trench.cost_total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shaft Cost Analysis */}
                    {shaft && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">🕳️</span>
                                <span className="text-sm font-medium text-green-800">Recharge Shaft Analysis</span>
                                {cheapestOption.name === 'Shaft' && (
                                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                        Most Cost Effective
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-2 text-sm text-green-700">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="font-medium">Dimensions:</span>
                                        <div className="text-xs">
                                            {shaft.unit_dimensions_m.diameter_m}m dia × {shaft.unit_dimensions_m.depth_m}m deep
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Unit Volume:</span>
                                        <div className="text-xs">{shaft.unit_volume_m3.toFixed(1)} m³</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Units Needed:</span>
                                        <div className="text-lg font-bold text-green-800">{shaft.units_needed}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Cost per Unit:</span>
                                        <div className="text-xs">{formatCurrency(shaft.cost_per_unit)}</div>
                                    </div>
                                </div>
                                <div className="bg-green-100 p-2 rounded border-t border-green-300">
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total Cost:</span>
                                        <span className="text-lg text-green-900">{formatCurrency(shaft.total_cost)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cost Summary & Recommendation */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Cost Analysis Summary</h4>
                        <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Most Cost Effective:</span>
                                <span className="text-blue-900 font-bold">
                                    {summary?.cheapest_option?.structure} ({formatCurrency(summary?.cheapest_option?.cost || 0)})
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Cost Range:</span>
                                <span className="text-blue-900">
                                    {formatCurrency(cheapestOption.cost)} - {formatCurrency(mostExpensiveOption.cost)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Potential Savings:</span>
                                <span className="text-green-700 font-bold">
                                    Up to {formatCurrency(totalRange)}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-blue-600 mt-2">
                            • Cost estimates include materials, labor, and basic installation
                            • Actual costs may vary based on site conditions and local rates
                            • Consider soil permeability and space constraints for final selection
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};