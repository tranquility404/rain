import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Droplets, Home, TrendingUp, MapPin, Calendar, DollarSign, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnalysisResults = () => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        // Get session ID from localStorage
        const storedSessionId = localStorage.getItem("assessment_session_id");
        if (!storedSessionId) {
            // If no session ID, redirect back to self-assessment
            navigate("/self-assessment");
            return;
        }
        setSessionId(storedSessionId);
    }, [navigate]);

    if (!sessionId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your results...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500 mr-3" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                            Assessment Complete!
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Your rainwater harvesting potential has been analyzed
                    </p>
                    <Badge variant="outline" className="mt-2">
                        Session ID: {sessionId}
                    </Badge>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Harvest Potential */}
                    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-blue-700">
                                <Droplets className="w-5 h-5 mr-2" />
                                Annual Harvest Potential
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600 mb-2">12,500L</div>
                            <p className="text-sm text-muted-foreground">
                                Based on your roof area and local rainfall data
                            </p>
                            <Progress value={85} className="mt-3" />
                            <p className="text-xs text-muted-foreground mt-1">85% efficiency expected</p>
                        </CardContent>
                    </Card>

                    {/* Cost Savings */}
                    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-green-700">
                                <DollarSign className="w-5 h-5 mr-2" />
                                Annual Savings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600 mb-2">₹8,750</div>
                            <p className="text-sm text-muted-foreground">
                                Estimated water bill reduction
                            </p>
                            <div className="flex items-center mt-3">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">12% monthly reduction</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Environmental Impact */}
                    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-emerald-700">
                                <Leaf className="w-5 h-5 mr-2" />
                                Environmental Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-600 mb-2">4.2 tons</div>
                            <p className="text-sm text-muted-foreground">
                                CO₂ emissions saved annually
                            </p>
                            <div className="mt-3">
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                    Carbon Neutral
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Location Analysis
                            </CardTitle>
                            <CardDescription>
                                Based on your geographic location and climate data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Average Annual Rainfall:</span>
                                <span className="font-medium">1,250mm</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Roof Area:</span>
                                <span className="font-medium">100 m²</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Collection Efficiency:</span>
                                <span className="font-medium">85%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Material Suitability:</span>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    Excellent
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Monthly Breakdown
                            </CardTitle>
                            <CardDescription>
                                Expected water collection throughout the year
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { month: "Monsoon (Jun-Sep)", amount: "8,500L", percentage: 68 },
                                    { month: "Post-Monsoon (Oct-Nov)", amount: "2,200L", percentage: 18 },
                                    { month: "Winter (Dec-Feb)", amount: "1,100L", percentage: 9 },
                                    { month: "Summer (Mar-May)", amount: "700L", percentage: 5 },
                                ].map((period) => (
                                    <div key={period.month} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span>{period.month}</span>
                                            <span className="font-medium">{period.amount}</span>
                                        </div>
                                        <Progress value={period.percentage} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recommendations */}
                <Alert className="mb-6 border-blue-200 bg-blue-50">
                    <Droplets className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Recommendation:</strong> Your roof is well-suited for rainwater harvesting!
                        Consider installing a 5,000L storage system to maximize your water collection potential
                        during the monsoon season.
                    </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="text-center space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                    <Button size="lg" onClick={() => navigate("/contractors")}>
                        <Home className="w-4 h-4 mr-2" />
                        Find Contractors
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate("/marketplace")}>
                        View Equipment
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate("/self-assessment")}>
                        New Assessment
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResults;