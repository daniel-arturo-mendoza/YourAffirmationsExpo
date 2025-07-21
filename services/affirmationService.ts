import { getStoredUUID } from "../utils/uuidGenerator";
import { API_APP_LAMBDA_URL } from "../utils/constants";

export interface AffirmationRequest {
  labels?: string[]; // was chips
  need?: string;
  tone?: string;
  uuid: string; // was userUUID
}

export interface AffirmationResponse {
  affirmation: string;
}

export class AffirmationService {
  private static async getRequestHeaders(): Promise<Record<string, string>> {
    return {
      'Content-Type': 'application/json',
    };
  }

  private static async createRequestBody(data: Partial<AffirmationRequest>): Promise<AffirmationRequest> {
    // Map internal variable names to backend-required keys
    const userUUID = await getStoredUUID();
    // If 'chips' is present, map it to 'labels'
    const labels = (data as any).chips || data.labels;
    return {
      ...data,
      labels,
      uuid: userUUID,
    };
  }

  private static async makeRequest(requestBody: AffirmationRequest): Promise<AffirmationResponse> {
    const headers = await this.getRequestHeaders();
    
    const response = await fetch(API_APP_LAMBDA_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.affirmation) {
      throw new Error("No affirmation in response");
    }

    return data;
  }

  static async generateAffirmation(selectedChips: string[]): Promise<string> {
    console.log("🎯 Generating affirmation...");
    
    if (selectedChips.length === 0) {
      throw new Error("Please select at least one category to generate an affirmation!");
    }

    // Map 'selectedChips' to 'labels' for the backend
    const requestBody = await this.createRequestBody({ labels: selectedChips });
    console.log("📤 Request body:", requestBody);

    try {
      const data = await this.makeRequest(requestBody);
      console.log("📥 Response data:", data);
      return data.affirmation;
    } catch (error) {
      console.error("❌ Error generating affirmation:", error);
      throw error;
    }
  }

  static async generateSpecialAffirmation(need: string, tone: string): Promise<string> {
    console.log("🎯 Generating special affirmation...");
    
    if (!need.trim() || !tone.trim()) {
      throw new Error("Please fill in both questions to generate a special affirmation!");
    }

    const requestBody = await this.createRequestBody({
      need: need.trim(),
      tone: tone.trim(),
    });
    console.log("📤 Special request body:", requestBody);

    try {
      const data = await this.makeRequest(requestBody);
      console.log("📥 Special response data:", data);
      return data.affirmation;
    } catch (error) {
      console.error("❌ Error generating special affirmation:", error);
      throw error;
    }
  }

  static async generateSpecialAffirmationAfterAd(need: string, tone: string): Promise<string> {
    console.log("🎯 Generating special affirmation after ad...");
    
    if (!need.trim() || !tone.trim()) {
      throw new Error("Please fill in both questions to generate a special affirmation!");
    }

    const requestBody = await this.createRequestBody({
      need: need.trim(),
      tone: tone.trim(),
    });
    console.log("📤 After-ad request body:", requestBody);

    try {
      const data = await this.makeRequest(requestBody);
      console.log("📥 After-ad response data:", data);
      return data.affirmation;
    } catch (error) {
      console.error("❌ Error generating special affirmation after ad:", error);
      throw error;
    }
  }
} 