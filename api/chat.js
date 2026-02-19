import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { model, contents, config } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Server Error: GEMINI_API_KEY is not set");
            return res.status(500).json({ error: 'Server configuration error: API Key missing' });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Use the model specified in request or default to 1.5-flash
        const targetModel = model || "gemini-1.5-flash";

        const result = await ai.models.generateContent({
            model: targetModel,
            contents,
            config
        });

        const responseText = result.response.text();
        return res.status(200).json({ text: responseText });

    } catch (error) {
        console.error("Gemini API Error details:", error);
        return res.status(500).json({
            error: error.message || 'Internal Server Error',
            details: error.toString()
        });
    }
}
