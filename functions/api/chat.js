export async function onRequest(context) {
    const { request, env } = context;

    // Handle CORS
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const payload = await request.json();
        // Default model to 1.5-flash if not specified
        const { model = "gemini-1.5-flash", contents, config } = payload;
        const apiKey = env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "Server Error: GEMINI_API_KEY is not set" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Construct the Gemini REST API URL
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Call Google's API directly using fetch
        const apiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents,
                generationConfig: config,
            }),
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            return new Response(JSON.stringify({ error: `Gemini API Error: ${apiResponse.status}`, details: errorText }), {
                status: apiResponse.status,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await apiResponse.json();

        // Extract text from REST API response structure
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        return new Response(JSON.stringify({ text: responseText }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }
}
