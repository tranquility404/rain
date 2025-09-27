import { AquiferDataDisplay } from "@/components/analysis/AquiferDataDisplay";
import { CostAnalysisDataDisplay } from "@/components/analysis/CostAnalysisDataDisplay";
import { DimensionsAnalysisDataDisplay } from "@/components/analysis/DimensionsAnalysisDataDisplay";
import { GroundwaterDataDisplay } from "@/components/analysis/GroundwaterDataDisplay";
import { DataDisplay, RainfallDataDisplay } from "@/components/analysis/RainfallDataDisplay";
import { RTRWHSuggestionsDataDisplay } from "@/components/analysis/RTRWHSuggestionsDataDisplay";
import { RunoffCapacityDataDisplay } from "@/components/analysis/RunoffCapacityDataDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import {
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Calculator,
    CheckCircle,
    Clock,
    Cloud,
    DollarSign,
    Loader2,
    MapPin,
    Mountain,
    RefreshCw,
    Settings,
    TrendingUp,
    Users,
    Waves
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Types for API responses (generic for now)
interface ApiSectionData {
    [key: string]: any;
}

interface SectionState {
    loading: boolean;
    data: ApiSectionData | null;
    error: string | null;
}

interface AnalysisData {
    rainfallData: SectionState;
    aquiferData: SectionState;
    groundwaterData: SectionState;
    runoffCapacity: SectionState;
    suggestRTRWH: SectionState;
    dimensionsAnalysis: SectionState;
    costAnalysis: SectionState;
}

const Analysis = () => {
    const navigate = useNavigate();
    const { sessionId } = useParams<{ sessionId: string }>();
    const { toast } = useToast();
    const [analysisData, setAnalysisData] = useState<AnalysisData>({
        rainfallData: { loading: true, data: null, error: null },
        aquiferData: { loading: true, data: null, error: null },
        groundwaterData: { loading: true, data: null, error: null },
        runoffCapacity: { loading: true, data: null, error: null },
        suggestRTRWH: { loading: true, data: null, error: null },
        dimensionsAnalysis: { loading: true, data: null, error: null },
        costAnalysis: { loading: true, data: null, error: null },
    });

    useEffect(() => {
        // Validate session ID from URL parameter
        if (!sessionId) {
            toast({
                title: "Session Not Found",
                description: "Please complete the self-assessment first.",
                variant: "destructive",
            });
            navigate("/self-assessment");
            return;
        }

        // Start fetching all analysis data
        fetchAllAnalysisData(sessionId);
    }, [sessionId, navigate, toast]);

    const fetchAllAnalysisData = async (sessionId: string) => {
        // Define all API calls with their corresponding keys
        const apiCalls = [
            { key: 'rainfallData', fn: () => apiClient.getRainfallData(sessionId) },
            { key: 'aquiferData', fn: () => apiClient.getAquiferData(sessionId) },
            { key: 'groundwaterData', fn: () => apiClient.getGroundwaterData(sessionId) },
            { key: 'runoffCapacity', fn: () => apiClient.getRunoffCapacity(sessionId) },
            { key: 'suggestRTRWH', fn: () => apiClient.getSuggestRTRWH(sessionId) },
            { key: 'dimensionsAnalysis', fn: () => apiClient.getDimensionsAnalysis(sessionId) },
            { key: 'costAnalysis', fn: () => apiClient.getCostAnalysis(sessionId) },
        ];

        // Execute all API calls simultaneously
        apiCalls.forEach(async ({ key, fn }) => {
            try {
                const response = await fn();
                updateSectionData(key as keyof AnalysisData, {
                    loading: false,
                    data: response,
                    error: null
                });
            } catch (error) {
                console.error(`Error fetching ${key}:`, error);
                const errorMessage = error instanceof Error ? error.message : `Failed to load ${key}`;
                updateSectionData(key as keyof AnalysisData, {
                    loading: false,
                    data: null,
                    error: errorMessage
                });
            }
        });
    };

    const updateSectionData = (key: keyof AnalysisData, newState: SectionState) => {
        setAnalysisData(prev => ({
            ...prev,
            [key]: newState
        }));
    };

    const retrySection = async (key: keyof AnalysisData, apiFunction: () => Promise<any>) => {
        updateSectionData(key, { loading: true, data: null, error: null });

        try {
            const response = await apiFunction();
            updateSectionData(key, { loading: false, data: response, error: null });
        } catch (error) {
            console.error(`Error retrying ${key}:`, error);
            const errorMessage = error instanceof Error ? error.message : `Failed to load ${key}`;
            updateSectionData(key, { loading: false, data: null, error: errorMessage });
        }
    };

    // Enhanced loading animation component
    const LoadingAnimation = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => (
        <div className="flex flex-col items-center justify-center h-48 space-y-6 p-6">
            <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <div className="absolute inset-0">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
            <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-slate-700">{title}</p>
                <div className="flex space-x-1 justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-3 w-24 mx-auto" />
            </div>
        </div>
    );

    // Enhanced error display component
    const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
        <div className="flex flex-col items-center justify-center h-48 space-y-6 p-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-center space-y-3 max-w-sm">
                <h3 className="text-sm font-semibold text-red-700">Unable to Load Data</h3>
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</p>
                <div className="text-xs text-muted-foreground">
                    Check your connection and try again
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-4 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        </div>
    );

    // Enhanced section component with status indicators
    const AnalysisSection = ({
        title,
        description,
        icon: Icon,
        sectionKey,
        apiFunction,
        customDataDisplay
    }: {
        title: string;
        description: string;
        icon: React.ElementType;
        sectionKey: keyof AnalysisData;
        apiFunction: () => Promise<any>;
        customDataDisplay?: (data: any) => JSX.Element;
    }) => {
        const section = analysisData[sectionKey];
        const getStatusBadge = () => {
            if (section.loading) return <Badge variant="secondary" className="ml-auto"><Clock className="w-3 h-3 mr-1" />Loading</Badge>;
            if (section.error) return <Badge variant="destructive" className="ml-auto">Failed</Badge>;
            if (section.data) return <Badge variant="default" className="ml-auto bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Complete</Badge>;
            return null;
        };

        return (
            <Card className={`h-full transition-all duration-300 hover:shadow-lg ${section.data ? 'ring-1 ring-green-200 bg-gradient-to-br from-white to-green-50/30' :
                section.error ? 'ring-1 ring-red-200 bg-gradient-to-br from-white to-red-50/30' :
                    'hover:ring-1 hover:ring-blue-200'
                }`}>
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.data ? 'bg-green-100 text-green-700' :
                                section.error ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-lg font-semibold">{title}</span>
                            </div>
                        </CardTitle>
                        {getStatusBadge()}
                    </div>
                    <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {section.loading && (
                        <LoadingAnimation title="Loading data..." icon={Icon} />
                    )}

                    {section.error && (
                        <ErrorDisplay
                            error={section.error}
                            onRetry={() => retrySection(sectionKey, apiFunction)}
                        />
                    )}

                    {section.data && !section.loading && !section.error && (
                        customDataDisplay ? customDataDisplay(section.data) : <DataDisplay data={section.data} />
                    )}
                </CardContent>
            </Card>
        );
    };

    if (!sessionId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Validating session...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const completedSections = Object.values(analysisData).filter(section =>
        section.data && !section.loading && !section.error
    ).length;

    const totalSections = Object.keys(analysisData).length;
    const progressPercentage = (completedSections / totalSections) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Enhanced Header with Progress Tracking */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent">
                                    Analysis Dashboard
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Comprehensive rainwater harvesting analysis and recommendations
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="px-4 py-2">
                                Session: {sessionId?.slice(-8).toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Analysis Progress</h3>
                                <p className="text-sm text-muted-foreground">
                                    {completedSections} of {totalSections} sections completed
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl font-bold text-slate-700">
                                    {Math.round(progressPercentage)}%
                                </span>
                                {progressPercentage === 100 && (
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Complete
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                            <span>Started</span>
                            <span>{progressPercentage === 100 ? 'All data loaded' : 'Loading...'}</span>
                        </div>
                    </div>
                </div>

                {/* Analysis Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <AnalysisSection
                        title="Rainfall Data"
                        description="Historical and current rainfall patterns in your area"
                        icon={Cloud}
                        sectionKey="rainfallData"
                        apiFunction={() => apiClient.getRainfallData(sessionId!)}
                        customDataDisplay={(data) => <RainfallDataDisplay data={data} />}
                    />

                    <AnalysisSection
                        title="Aquifer Analysis"
                        description="Underground water table and aquifer information"
                        icon={Mountain}
                        sectionKey="aquiferData"
                        apiFunction={() => apiClient.getAquiferData(sessionId!)}
                        customDataDisplay={(data) => <AquiferDataDisplay data={data} />}
                    />

                    <AnalysisSection
                        title="Groundwater Data"
                        description="Groundwater levels and quality assessment"
                        icon={Waves}
                        sectionKey="groundwaterData"
                        apiFunction={() => apiClient.getGroundwaterData(sessionId!)}
                        customDataDisplay={(data) => <GroundwaterDataDisplay data={data} />}
                    />

                    <AnalysisSection
                        title="Runoff Capacity"
                        description="Surface water runoff potential analysis"
                        icon={TrendingUp}
                        sectionKey="runoffCapacity"
                        apiFunction={() => apiClient.getRunoffCapacity(sessionId!)}
                        customDataDisplay={(data) => <RunoffCapacityDataDisplay data={data} />}
                    />

                    <AnalysisSection
                        title="RTRWH Suggestions"
                        description="Rooftop rainwater harvesting recommendations"
                        icon={Settings}
                        sectionKey="suggestRTRWH"
                        apiFunction={() => apiClient.getSuggestRTRWH(sessionId!)}
                        customDataDisplay={(data) => <RTRWHSuggestionsDataDisplay data={data} />}
                    />

                    <AnalysisSection
                        title="Dimensions Analysis"
                        description="Optimal system sizing and configuration"
                        icon={Calculator}
                        sectionKey="dimensionsAnalysis"
                        apiFunction={() => apiClient.getDimensionsAnalysis(sessionId!)}
                        customDataDisplay={(data) => <DimensionsAnalysisDataDisplay data={data} />}
                    />
                </div>

                {/* Cost Analysis - Full Width */}
                <div className="mb-10">
                    <AnalysisSection
                        title="Cost Analysis"
                        description="Complete cost breakdown and investment analysis for your rainwater harvesting system options"
                        icon={DollarSign}
                        sectionKey="costAnalysis"
                        apiFunction={() => apiClient.getCostAnalysis(sessionId!)}
                        customDataDisplay={(data) => <CostAnalysisDataDisplay data={data} />}
                    />
                </div>

                {/* Enhanced Action Section */}
                {progressPercentage === 100 && (
                    <Alert className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <AlertDescription>
                            <div className="space-y-2">
                                <p className="font-semibold text-green-800">🎉 Analysis Complete!</p>
                                <p className="text-green-700">All data has been successfully analyzed. You can now explore contractors, equipment options, or start a new assessment.</p>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm overflow-hidden">
                    <div className="text-center space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-800">Next Steps</h3>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">Ready to implement your rainwater harvesting system?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
                            <Button
                                size="lg"
                                onClick={() => navigate("/contractors")}
                                disabled={progressPercentage < 100}
                                className="min-h-[3.5rem] sm:min-h-[6rem] px-4 py-3 flex flex-col justify-center items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white transition-all duration-200 overflow-hidden"
                            >
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base leading-tight">Find Contractors</span>
                                <span className="text-[10px] sm:text-xs opacity-90 hidden sm:block leading-tight">Get professional help</span>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate("/marketplace")}
                                className="min-h-[3.5rem] sm:min-h-[6rem] px-4 py-3 flex flex-col justify-center items-center gap-1 border-2 hover:bg-slate-50 transition-all duration-200 overflow-hidden"
                            >
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base leading-tight">View Equipment</span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block leading-tight">Browse products</span>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate("/self-assessment")}
                                className="min-h-[3.5rem] sm:min-h-[6rem] px-4 py-3 flex flex-col justify-center items-center gap-1 border-2 hover:bg-slate-50 transition-all duration-200 overflow-hidden"
                            >
                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base leading-tight">New Assessment</span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block leading-tight">Start over</span>
                            </Button>
                        </div>

                        {progressPercentage < 100 && (
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground bg-slate-50 rounded-lg p-3 max-w-sm mx-auto">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="text-center leading-tight">Complete analysis to unlock all features</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;