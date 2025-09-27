import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    MapPin,
    Upload,
    Ruler,
    Droplets,
    Search,
    CheckCircle,
    AlertCircle,
    Info,
    FileImage,
    Calculator,
    Loader2,
    RefreshCw,
    Cloud,
    Zap,
    Waves,
} from "lucide-react";
import {
    getMaterialTypes,
    submitAssessment,
    type MaterialTypesResponse,
    type ApiResponse,
    type AssessmentFormData
} from "@/lib/apiClient";

/**
 * SelfAssessment Component
 * 
 * This component handles the initial rainwater harvesting assessment.
 * Upon successful submission, it navigates to the analysis page with
 * the session_id as a URL parameter.
 */

// Types
interface FormData {
    name: string;
    dwellers: string;
    latitude: string;
    longitude: string;
    area_image: File | null;
    area_length_m: string;
    area_width_m: string;
    material_type: string;
}

interface FormErrors {
    [key: string]: string;
}

const SelfAssessment = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        dwellers: "",
        latitude: "",
        longitude: "",
        area_image: null,
        area_length_m: "",
        area_width_m: "",
        material_type: "",
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [materialTypes, setMaterialTypes] = useState<MaterialTypesResponse | null>(null);
    const [filteredMaterials, setFilteredMaterials] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string>("");

    // Auto-fetch current location on component mount
    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        setIsLocationLoading(true);
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser");
            setIsLocationLoading(false);
            toast({
                title: "Location Error",
                description: "Geolocation is not supported by this browser. Please enter coordinates manually.",
                variant: "destructive",
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({
                    ...prev,
                    latitude: latitude.toFixed(6),
                    longitude: longitude.toFixed(6),
                }));
                setIsLocationLoading(false);
                toast({
                    title: "Location Found",
                    description: "Successfully retrieved your current location.",
                });
            },
            (error) => {
                let errorMessage = "Failed to retrieve location";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied by user";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out";
                        break;
                }

                setLocationError(errorMessage);
                setIsLocationLoading(false);
                toast({
                    title: "Location Error",
                    description: errorMessage + ". You can manually enter coordinates if needed.",
                    variant: "destructive",
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            }
        );
    };

    // Fetch material types on component mount
    useEffect(() => {
        const fetchMaterialTypes = async () => {
            setIsLoading(true);
            try {
                const data = await getMaterialTypes();
                setMaterialTypes(data);
                setFilteredMaterials(data.data.all_material_types);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load material types. Please try again.",
                    variant: "destructive",
                });
                console.error("Error fetching material types:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterialTypes();
    }, [toast]);

    // Filter materials based on search term
    useEffect(() => {
        if (materialTypes && searchTerm) {
            const filtered = materialTypes.data.all_material_types.filter((material) =>
                material.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMaterials(filtered);
        } else if (materialTypes) {
            setFilteredMaterials(materialTypes.data.all_material_types);
        }
    }, [searchTerm, materialTypes]);

    // Update progress based on form completion
    useEffect(() => {
        const fields = Object.entries(formData);
        const completedFields = fields.filter(([key, value]) => {
            if (key === "roof_image") return value !== null;
            return value !== "";
        }).length;
    }, [formData]);

    // Validation functions
    const validateLatitude = (value: string): string => {
        const lat = parseFloat(value);
        if (isNaN(lat)) return "Latitude must be a valid number";
        if (lat < -90 || lat > 90) return "Latitude must be between -90 and 90";
        return "";
    };

    const validateLongitude = (value: string): string => {
        const lng = parseFloat(value);
        if (isNaN(lng)) return "Longitude must be a valid number";
        if (lng < -180 || lng > 180) return "Longitude must be between -180 and 180";
        return "";
    };

    const validateDimension = (value: string, fieldName: string): string => {
        const dim = parseFloat(value);
        if (isNaN(dim)) return `${fieldName} must be a valid number`;
        if (dim <= 0) return `${fieldName} must be positive`;
        return "";
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        // Validate name
        if (!formData.name.trim()) {
            errors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters long";
        }

        // Validate dwellers
        if (!formData.dwellers) {
            errors.dwellers = "Number of dwellers is required";
        } else {
            const dwellersCount = parseInt(formData.dwellers);
            if (isNaN(dwellersCount) || dwellersCount <= 0) {
                errors.dwellers = "Number of dwellers must be a positive number";
            } else if (dwellersCount > 100) {
                errors.dwellers = "Number of dwellers seems unreasonably high";
            }
        }

        // Only validate coordinates if they're empty (auto-fetch should fill them)
        if (!formData.latitude) {
            errors.latitude = "Location is required. Please allow location access or enter manually.";
        } else {
            const latError = validateLatitude(formData.latitude);
            if (latError) errors.latitude = latError;
        }

        if (!formData.longitude) {
            errors.longitude = "Location is required. Please allow location access or enter manually.";
        } else {
            const lngError = validateLongitude(formData.longitude);
            if (lngError) errors.longitude = lngError;
        }

        if (!formData.area_image) {
            errors.area_image = "Roof image is required";
        }

        if (!formData.area_length_m) {
            errors.roof_length_m = "Roof length is required";
        } else {
            const lengthError = validateDimension(formData.area_length_m, "Roof length");
            if (lengthError) errors.roof_length_m = lengthError;
        }

        if (!formData.area_width_m) {
            errors.roof_width_m = "Roof width is required";
        } else {
            const widthError = validateDimension(formData.area_width_m, "Roof width");
            if (widthError) errors.roof_width_m = widthError;
        }

        if (!formData.material_type) {
            errors.material_type = "Material type is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string | File | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            // Validate file type
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                setFormErrors((prev) => ({
                    ...prev,
                    roof_image: "Please upload a valid image file (JPEG, PNG, GIF)",
                }));
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                setFormErrors((prev) => ({
                    ...prev,
                    roof_image: "File size must be less than 10MB",
                }));
                return;
            }
        }
        handleInputChange("area_image", file);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fix the errors in the form before submitting.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit assessment using API client
            const result = await submitAssessment(formData);

            if (result.status === "success") {
                // Optional: Log session data for debugging
                console.log("Assessment submitted successfully:", {
                    session_id: result.session_id,
                    coordinates: result.data_summary.coordinates
                });

                // Show success toast
                toast({
                    title: "Success!",
                    description: result.message || "Your self-assessment has been submitted successfully.",
                });

                // Navigate to analysis dashboard with session ID in URL
                setTimeout(() => {
                    navigate(`/analysis/${result.session_id}`);
                }, 1500);

            } else {
                throw new Error(result.message || "Submission failed");
            }

        } catch (error) {
            console.error("Submission error:", error);

            let errorMessage = "Failed to submit assessment. Please try again.";

            if (error instanceof Error) {
                if (error.message.includes("Failed to fetch")) {
                    errorMessage = "Network error. Please check your internet connection and try again.";
                } else if (error.message.includes("413")) {
                    errorMessage = "File too large. Please upload a smaller image.";
                } else if (error.message.includes("400")) {
                    errorMessage = "Invalid data provided. Please check your inputs.";
                } else if (error.message.includes("500")) {
                    errorMessage = "Server error. Please try again later.";
                }
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMaterialSelect = (material: string) => {
        handleInputChange("material_type", material);
        setSearchTerm(""); // Clear search after selection
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading material types...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Cool loading screen during submission
    if (isSubmitting) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-500 flex items-center justify-center relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    {/* Floating water droplets */}
                    <div className="absolute top-20 left-20 animate-bounce">
                        <Droplets className="w-8 h-8 text-white/20" />
                    </div>
                    <div className="absolute top-40 right-32 animate-bounce" style={{ animationDelay: '0.5s' }}>
                        <Droplets className="w-6 h-6 text-white/15" />
                    </div>
                    <div className="absolute bottom-32 left-32 animate-bounce" style={{ animationDelay: '1s' }}>
                        <Droplets className="w-10 h-10 text-white/10" />
                    </div>
                    <div className="absolute top-60 left-1/2 animate-bounce" style={{ animationDelay: '1.5s' }}>
                        <Cloud className="w-12 h-12 text-white/10" />
                    </div>
                    <div className="absolute bottom-20 right-20 animate-bounce" style={{ animationDelay: '2s' }}>
                        <Waves className="w-14 h-14 text-white/10" />
                    </div>

                    {/* Animated circles */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Main loading content */}
                <div className="relative z-10 text-center text-white">
                    <div className="mb-8">
                        {/* Central loading animation */}
                        <div className="relative inline-block">
                            <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-r-white/40 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                            <div className="absolute inset-2 w-20 h-20 border-2 border-white/30 border-b-white rounded-full animate-spin mx-auto" style={{ animationDuration: '2s' }}></div>

                            {/* Center icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap className="w-8 h-8 text-white animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                            Processing Your Assessment
                        </h2>

                        <div className="space-y-2">
                            <p className="text-xl text-white/90 animate-pulse">
                                Analyzing your roof data...
                            </p>
                            <p className="text-lg text-white/70">
                                This may take a few moments
                            </p>
                        </div>

                        {/* Progress dots */}
                        <div className="flex justify-center space-x-2 mt-6">
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>

                        {/* Status text */}
                        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-white/80">Fetching rainfall data and analyzing roof potential...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="max-w-4xl mx-auto">
                    {/* Enhanced Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 mb-6">
                            <Droplets className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent mb-4">
                            Self-Assessment
                        </h1>
                        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                            Help us assess your property for optimal rainwater harvesting system design and implementation
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700 font-medium">Takes about 5 minutes to complete</span>
                        </div>
                    </div>

                    {/* Enhanced Form Card */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-6 sm:p-8 lg:p-10">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Property Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Info className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-800">Property Information</h2>
                                            <p className="text-sm text-muted-foreground">Basic details about your property</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="name" className="text-base font-medium text-slate-700">
                                                Property Owner Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className={`h-12 transition-all duration-200 border-2 focus:ring-2 focus:ring-blue-500/20 ${formErrors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                                                    }`}
                                            />
                                            {formErrors.name && (
                                                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                    <span>{formErrors.name}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="dwellers" className="text-base font-medium text-slate-700">
                                                Number of Dwellers *
                                            </Label>
                                            <Input
                                                id="dwellers"
                                                type="number"
                                                min="1"
                                                max="100"
                                                placeholder="e.g., 4"
                                                value={formData.dwellers}
                                                onChange={(e) => handleInputChange("dwellers", e.target.value)}
                                                className={`h-12 transition-all duration-200 border-2 focus:ring-2 focus:ring-blue-500/20 ${formErrors.dwellers ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                                                    }`}
                                            />
                                            {formErrors.dwellers && (
                                                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                    <span>{formErrors.dwellers}</span>
                                                </div>
                                            )}
                                            <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-lg">
                                                💡 Total number of people living in the property
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Location Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-slate-800">Location Information</h2>
                                                <p className="text-sm text-muted-foreground">Your property's geographic coordinates</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={getCurrentLocation}
                                            disabled={isLocationLoading}
                                            className="flex items-center gap-2 border-2 hover:border-green-300 hover:bg-green-50"
                                        >
                                            {isLocationLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="w-4 h-4" />
                                            )}
                                            <span className="hidden sm:inline">
                                                {isLocationLoading ? "Getting Location..." : "Refresh Location"}
                                            </span>
                                            <span className="sm:hidden">
                                                {isLocationLoading ? "Loading..." : "Refresh"}
                                            </span>
                                        </Button>
                                    </div>

                                    {isLocationLoading && (
                                        <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                                <div>
                                                    <AlertDescription className="text-blue-800 font-medium">
                                                        Fetching your current location...
                                                    </AlertDescription>
                                                    <p className="text-xs text-blue-600 mt-1">Please allow location access when prompted.</p>
                                                </div>
                                            </div>
                                        </Alert>
                                    )}

                                    {locationError && (
                                        <Alert className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <AlertDescription className="text-red-800 font-medium">
                                                        {locationError}
                                                    </AlertDescription>
                                                    <p className="text-xs text-red-600 mt-1">You can manually enter your coordinates below if needed.</p>
                                                </div>
                                            </div>
                                        </Alert>
                                    )}

                                    {formData.latitude && formData.longitude && !isLocationLoading && (
                                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <span className="font-semibold text-green-800">Location Successfully Detected</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="bg-white/50 p-3 rounded-lg">
                                                        <span className="text-sm text-muted-foreground block">Latitude:</span>
                                                        <span className="font-mono font-bold text-green-700 text-lg">{formData.latitude}°</span>
                                                    </div>
                                                    <div className="bg-white/50 p-3 rounded-lg">
                                                        <span className="text-sm text-muted-foreground block">Longitude:</span>
                                                        <span className="font-mono font-bold text-green-700 text-lg">{formData.longitude}°</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Manual input fallback */}
                                    <details className="group border border-slate-200 rounded-lg overflow-hidden">
                                        <summary className="cursor-pointer p-4 hover:bg-slate-50 transition-colors border-b border-slate-200 group-open:border-b-slate-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Calculator className="w-4 h-4 text-slate-600" />
                                                    <span className="text-sm font-medium text-slate-700">Manual Coordinate Entry</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">Click to expand</span>
                                            </div>
                                        </summary>
                                        <div className="p-4 bg-slate-50">
                                            <p className="text-sm text-muted-foreground mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                💡 If automatic location detection fails, you can manually enter your coordinates here
                                            </p>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <Label htmlFor="latitude" className="text-base font-medium text-slate-700">
                                                        Latitude *
                                                    </Label>
                                                    <Input
                                                        id="latitude"
                                                        type="number"
                                                        step="0.000001"
                                                        placeholder="e.g., 40.712776"
                                                        value={formData.latitude}
                                                        onChange={(e) => handleInputChange("latitude", e.target.value)}
                                                        className={`h-12 transition-all duration-200 border-2 focus:ring-2 focus:ring-blue-500/20 ${formErrors.latitude ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                                                            }`}
                                                    />
                                                    {formErrors.latitude && (
                                                        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                            <span>{formErrors.latitude}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <Label htmlFor="longitude" className="text-base font-medium text-slate-700">
                                                        Longitude *
                                                    </Label>
                                                    <Input
                                                        id="longitude"
                                                        type="number"
                                                        step="0.000001"
                                                        placeholder="e.g., -74.005974"
                                                        value={formData.longitude}
                                                        onChange={(e) => handleInputChange("longitude", e.target.value)}
                                                        className={`h-12 transition-all duration-200 border-2 focus:ring-2 focus:ring-blue-500/20 ${formErrors.longitude ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                                                            }`}
                                                    />
                                                    {formErrors.longitude && (
                                                        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                            <span>{formErrors.longitude}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>

                                <Separator className="my-8" />

                                {/* Roof Image Upload */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FileImage className="w-6 h-6 text-primary" />
                                        <h2 className="text-xl font-semibold">Roof Image Upload</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="roof_image" className="text-base font-medium">
                                                Roof Image *
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="roof_image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className={`file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 ${formErrors.roof_image ? "border-red-500" : ""
                                                        }`}
                                                />
                                                <Upload className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Accepted formats: JPEG, PNG, GIF (Max size: 10MB)
                                            </p>
                                            {formErrors.roof_image && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {formErrors.roof_image}
                                                </p>
                                            )}
                                        </div>

                                        {formData.area_image && (
                                            <div className="p-4 border rounded-lg bg-muted/50">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <div>
                                                        <p className="font-medium">{formData.area_image.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {(formData.area_image.size / (1024 * 1024)).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Roof Dimensions */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Ruler className="w-6 h-6 text-primary" />
                                        <h2 className="text-xl font-semibold">Roof Dimensions</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="roof_length" className="text-base font-medium">
                                                Roof Length (meters) *
                                            </Label>
                                            <Input
                                                id="roof_length"
                                                type="number"
                                                placeholder="e.g., 150"
                                                value={formData.area_length_m}
                                                onChange={(e) => handleInputChange("area_length_m", e.target.value)}
                                                className={`transition-all duration-200 ${formErrors.area_length_m ? "border-red-500 focus:ring-red-500" : ""
                                                    }`}
                                            />
                                            {formErrors.roof_length_m && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {formErrors.roof_length_m}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="roof_width" className="text-base font-medium">
                                                Roof Width (meters) *
                                            </Label>
                                            <Input
                                                id="roof_width"
                                                type="number"
                                                placeholder="e.g., 100"
                                                value={formData.area_width_m}
                                                onChange={(e) => handleInputChange("area_width_m", e.target.value)}
                                                className={`transition-all duration-200 ${formErrors.area_width_m ? "border-red-500 focus:ring-red-500" : ""
                                                    }`}
                                            />
                                            {formErrors.roof_width_m && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {formErrors.roof_width_m}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {formData.area_length_m && formData.area_width_m && (
                                        <Alert className="bg-primary/5 border-primary/20">
                                            <Calculator className="w-4 h-4" />
                                            <AlertDescription>
                                                <strong>Calculated Roof Area:</strong>{" "}
                                                {(parseFloat(formData.area_length_m) * parseFloat(formData.area_width_m)).toLocaleString()}{" "}
                                                square meters
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <Separator />

                                {/* Surface Material */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Droplets className="w-6 h-6 text-primary" />
                                        <h2 className="text-xl font-semibold">Surface Material</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {!formData.material_type && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label className="text-base font-medium">Search Materials</Label>
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Search for material type..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-base font-medium">
                                                        Select Material Type *
                                                    </Label>
                                                    <div className="border rounded-lg p-2">
                                                        <ScrollArea className="h-48">
                                                            <div className="space-y-1">
                                                                {filteredMaterials.slice(0, 100).map((material) => (
                                                                    <div
                                                                        key={material}
                                                                        onClick={() => handleMaterialSelect(material)}
                                                                        className="p-3 rounded-md cursor-pointer transition-colors hover:bg-muted/60 border border-transparent hover:border-primary/20"
                                                                    >
                                                                        <span className="capitalize text-sm">
                                                                            {material.replace(/_/g, " ")}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                    </div>
                                                    {formErrors.material_type && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {formErrors.material_type}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {formData.material_type && (
                                            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 border-primary/20">
                                                <div>
                                                    <Label className="text-base font-medium">Selected Material:</Label>
                                                    <p className="capitalize text-lg font-semibold">
                                                        {formData.material_type.replace(/_/g, " ")}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        handleInputChange("material_type", "");
                                                    }}
                                                >
                                                    Change Selection
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="space-y-6 pt-8 border-t border-slate-200">
                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-800 mb-2">Ready to Submit?</h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Please review all information above before submitting your assessment.
                                                    Our analysis will begin immediately after submission.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        size="lg"
                                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                                <span>Processing Assessment...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>Submit Assessment</span>
                                                                <CheckCircle className="w-5 h-5 ml-2" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SelfAssessment;