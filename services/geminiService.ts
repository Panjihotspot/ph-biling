
import { GoogleGenAI } from "@google/genai";

// Inisialisasi API dengan aman
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeSystemHealth = async (logs: any[], stats: any) => {
  try {
    if (!process.env.API_KEY) return "AI Analis tidak aktif (API Key Kosong).";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan analisis singkat kesehatan ISP berdasarkan data berikut:
      Logs: ${JSON.stringify(logs.slice(0, 3))}
      Stats: ${JSON.stringify(stats)}
      Gunakan bahasa Indonesia yang profesional.`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal melakukan analisis kesehatan sistem.";
  }
};

export const generateWhatsAppTemplate = async (type: string, data: any) => {
  try {
    if (!process.env.API_KEY) return "Halo, silakan cek tagihan internet Anda.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan pesan WhatsApp singkat untuk ${type} pelanggan internet. Data: ${JSON.stringify(data)}`,
    });
    return response.text;
  } catch (error) {
    return "Notifikasi Sistem: Mohon segera melakukan pembayaran tagihan internet Anda.";
  }
};
