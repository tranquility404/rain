import { CheckCircle, Settings, Target, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RTRWHSuggestionsData {
    data: {
        min_area: number;
        max_area: number | null;
        suggested_structure: string;
        details: {
            capacity: string;
            best_for: string;
        };
    };
}

export const RTRWHSuggestionsDataDisplay = ({ data }: RTRWHSuggestionsData) => {
    const [showDetails, setShowDetails] = useState(false);
    const suggestionsData = data;

    // Handle missing or invalid data
    if (!data || !suggestionsData) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load RTRWH suggestions</p>
            </div>
        );
    }

    const { min_area, max_area, suggested_structure, details } = suggestionsData;

    // Check if essential data is missing
    if (!suggested_structure) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">RTRWH recommendations not available</p>
            </div>
        );
    }

    // Helper function to format area ranges
    const formatAreaRange = (min: number, max: number | null) => {
        const formatArea = (area: number) => {
            if (area >= 10000) return `${(area / 10000).toFixed(1)}ha`;
            if (area >= 1000) return `${(area / 1000).toFixed(1)}K m²`;
            return `${area} m²`;
        };

        if (max === null) {
            return `${formatArea(min)}+`;
        }
        return `${formatArea(min)} - ${formatArea(max)}`;
    };

    // Get structure emoji
    const getStructureEmoji = (structure: string) => {
        const structureMap: { [key: string]: string } = {
            "Percolation Tank": "🏗️",
            "Rooftop Collection": "🏠",
            "Check Dam": "🌊",
            "Infiltration Trench": "🚧"
        };
        return structureMap[structure] || "⚡";
    };

    return (
        <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 hidden sm:inline">RTRWH Recommendations Ready</span>
                <span className="text-sm font-medium text-green-600 sm:hidden">Ready</span>
            </div>

            {/* Recommended Structure - Always Visible */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-center">
                    <div className="text-3xl mb-2">{getStructureEmoji(suggested_structure || 'Unknown')}</div>
                    <h3 className="text-lg font-bold text-blue-800 mb-1">{suggested_structure || 'No recommendation available'}</h3>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                        Optimized Choice
                    </Badge>
                </div>
            </div>

            {/* Key Info */}
            <div className="bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-800 hidden sm:inline">Suitable Area</span>
                        <span className="text-sm font-medium text-slate-800 sm:hidden">Area</span>
                    </div>
                    <div className="text-xs text-slate-600">
                        {(min_area !== undefined && min_area !== null) ? formatAreaRange(min_area, max_area) : 'N/A'}
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
                    {/* Best For */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Settings className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Application</span>
                        </div>
                        <p className="text-sm text-green-700">
                            {details?.best_for || 'Application details not available'}
                        </p>
                    </div>

                    {/* Capacity Information */}
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <Settings className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Capacity Design</span>
                        </div>
                        <p className="text-sm text-purple-700">
                            {details?.capacity || 'Capacity details not available'}
                        </p>
                        <Badge variant="secondary" className="text-purple-700 mt-2">
                            Custom Solution
                        </Badge>
                    </div>

                    {/* Implementation Note */}
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">Next Steps</h4>
                        <div className="space-y-1 text-xs text-yellow-700">
                            <div>• Professional site assessment recommended</div>
                            <div>• Soil and drainage analysis required</div>
                            <div>• Consult certified contractors for implementation</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};