# API Client Usage Guide

This file contains the API client configuration and functions for the Rain Harvesting application.

## Base URL Configuration

The API client uses the base URL: `http://4.240.107.18:443`

## Available Functions

### Material Types API
```typescript
import { getMaterialTypes } from '@/lib/apiClient';

const fetchMaterials = async () => {
  try {
    const materials = await getMaterialTypes();
    console.log(materials.data.all_material_types);
  } catch (error) {
    console.error('Failed to fetch materials:', error);
  }
};
```

### Assessment Submission
```typescript
import { submitAssessment, type AssessmentFormData } from '@/lib/apiClient';

const formData: AssessmentFormData = {
  latitude: "40.7128",
  longitude: "-74.0060",
  roof_image: fileObject,
  roof_length_m: "150",
  roof_width_m: "100",
  material_type: "roof_metal"
};

const handleSubmit = async () => {
  try {
    const result = await submitAssessment(formData);
    console.log('Session ID:', result.session_id);
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
```

### Session Management
```typescript
import { getSessionId, saveSessionId, clearSessionData } from '@/lib/apiClient';

// Get current session
const sessionId = getSessionId();

// Save new session
saveSessionId('new-session-id-123');

// Clear session data
clearSessionData();
```

## Using the API Client Class Directly

For advanced usage, you can import and use the ApiClient class:

```typescript
import { ApiClient } from '@/lib/apiClient';

const apiClient = new ApiClient();

// Use all available methods
const materials = await apiClient.getMaterialTypes();
const result = await apiClient.submitAssessment(formData);
```

## Adding New API Endpoints

To add new API endpoints, extend the ApiClient class in `/src/lib/apiClient.ts`:

```typescript
// Add new method to ApiClient class
async getAssessmentResults(sessionId: string): Promise<AssessmentResults> {
  return this.request<AssessmentResults>(`/api/results/${sessionId}`);
}

// Export convenience function
export const getAssessmentResults = (sessionId: string) => 
  apiClient.getAssessmentResults(sessionId);
```

## Error Handling

The API client includes automatic error handling and logging. All methods will throw errors that can be caught with try/catch blocks.

## TypeScript Support

All API functions are fully typed with TypeScript interfaces for better development experience and type safety.