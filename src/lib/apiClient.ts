// API Client Configuration and Functions
// Base URL for all API requests
const BASE_URL = "/api";

// Types for API responses
export interface MaterialTypesResponse {
    success: boolean;
    message: string;
    total_count: number;
    data: {
        all_material_types: string[];
        categorized_materials: {
            [key: string]: any[];
        };
    };
}

export interface ApiResponse {
    status: string;
    message: string;
    session_id: string;
    data_summary: {
        coordinates: {
            latitude: number;
            longitude: number;
        };
        [key: string]: any;
    };
}

export interface AssessmentFormData {
    name: string;
    dwellers: string;
    latitude: string;
    longitude: string;
    area_image: File | null;
    area_length_m: string;
    area_width_m: string;
    material_type: string;
}

// API Client class
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Generic fetch method with error handling
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultHeaders = {
            'Accept': 'application/json',
        };

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Fetch material types
    async getMaterialTypes(): Promise<MaterialTypesResponse> {
        return this.request<MaterialTypesResponse>('/material-types');
    }

    // Submit assessment data
    async submitAssessment(formData: AssessmentFormData): Promise<ApiResponse> {
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("dwellers", formData.dwellers);
        submitData.append("latitude", formData.latitude);
        submitData.append("longitude", formData.longitude);
        submitData.append("area_length_m", formData.area_length_m);
        submitData.append("area_width_m", formData.area_width_m);
        submitData.append("material_type", formData.material_type);

        // Add the roof image file if present
        if (formData.area_image) {
            submitData.append("area_image", formData.area_image);
        }

        return this.request<ApiResponse>('/api/fetch-data', {
            method: 'POST',
            body: submitData,
            // Don't set Content-Type header for FormData, let browser handle it
            headers: {},
        });
    }

    // Get session ID from localStorage
    getSessionId(): string | null {
        return localStorage.getItem("session_id");
    }

    // Save session ID to localStorage
    saveSessionId(sessionId: string): void {
        localStorage.setItem("session_id", sessionId);
    }

    // Clear session data
    clearSessionData(): void {
        localStorage.removeItem("session_id");
    }

    // Analysis API methods
    async getRainfallData(sessionId: string) {
        return this.request(`/api/rainfall-data/${sessionId}`, {
            method: 'GET',
        });
    }

    async getAquiferData(sessionId: string) {
        return this.request(`/api/aquifier/${sessionId}`, {
            method: 'GET',
        });
    }

    async getGroundwaterData(sessionId: string) {
        return this.request(`/api/groundwater-data/${sessionId}`, {
            method: 'GET',
        });
    }

    async getRunoffCapacity(sessionId: string) {
        return this.request(`/runoff-capacity/${sessionId}`, {
            method: 'GET',
        });
    }

    async getSuggestRTRWH(sessionId: string) {
        return this.request(`/api/suggest-rtrwh/${sessionId}`, {
            method: 'GET',
        });
    }

    async getDimensionsAnalysis(sessionId: string) {
        return this.request(`/api/dimensions-analysis/${sessionId}`, {
            method: 'GET',
        });
    }

    async getCostAnalysis(sessionId: string) {
        return this.request(`/api/cost-analysis/${sessionId}`, {
            method: 'GET',
        });
    }

    // Future API methods can be added here
    // Example: async getAssessmentResult(sessionId: string): Promise<AssessmentResult>
    // Example: async updateAssessment(sessionId: string, data: UpdateData): Promise<ApiResponse>
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual functions for backward compatibility
export const getMaterialTypes = () => apiClient.getMaterialTypes();
export const submitAssessment = (formData: AssessmentFormData) => apiClient.submitAssessment(formData);
export const getSessionId = () => apiClient.getSessionId();
export const saveSessionId = (sessionId: string) => apiClient.saveSessionId(sessionId);
export const clearSessionData = () => apiClient.clearSessionData();

// Export the class for advanced usage
export { ApiClient };
export default apiClient;