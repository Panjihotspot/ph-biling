
import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY string directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSystemHealth = async (logs: any[], stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this ISP system data and provide a short summary of health and revenue risks.
      
      Logs: ${JSON.stringify(logs.slice(0, 5))}
      Stats: ${JSON.stringify(stats)}
      
      Give me a concise report in Indonesian.`,
      config: {
        temperature: 0.7,
        // Recommendation: Avoid setting maxOutputTokens if not required to prevent thinking budget issues.
      }
    });

    // The text property directly returns the string output.
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Gagal melakukan analisis AI saat ini.";
  }
};

export const generateWhatsAppTemplate = async (type: string, data: any) => {
  try {
    const prompt = `Buatkan template pesan WhatsApp untuk ${type} pelanggan internet. 
    Data Pelanggan: ${JSON.stringify(data)}. 
    Pastikan profesional, jelas, dan menyertakan instruksi pembayaran.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // The text property directly returns the string output.
    return response.text;
  } catch (error) {
    return "Halo, ini adalah notifikasi dari ISP. Silakan cek tagihan Anda.";
  }
};
