
import { GoogleGenAI } from "@google/genai";

// Mengamankan akses API_KEY untuk lingkungan browser tanpa bundler
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const analyzeSystemHealth = async (logs: any[], stats: any) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return "Layanan AI memerlukan API Key yang valid.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this ISP system data and provide a short summary of health and revenue risks.
      
      Logs: ${JSON.stringify(logs.slice(0, 5))}
      Stats: ${JSON.stringify(stats)}
      
      Give me a concise report in Indonesian.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Gagal melakukan analisis AI saat ini.";
  }
};

export const generateWhatsAppTemplate = async (type: string, data: any) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return "Halo, silakan cek tagihan internet Anda.";

    const prompt = `Buatkan template pesan WhatsApp untuk ${type} pelanggan internet. 
    Data Pelanggan: ${JSON.stringify(data)}. 
    Pastikan profesional, jelas, dan menyertakan instruksi pembayaran.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Halo, ini adalah notifikasi dari ISP. Silakan cek tagihan Anda.";
  }
};
