import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

// Function for rule-based fallback responses
function getRuleBasedResponse(message: string): string {
    const userMessage = message.toLowerCase();

    // Detect Telugu: Telugu script OR common romanized Telugu words
    const hasTeluguScript = /[\u0C00-\u0C7F]/.test(message);
    const hasRomanizedTelugu = /\b(namasthe|namaskaram|meeku|mana|maa|daggara|deggara|ye|unnai|unnayi|naku|entha|kaaram|karam|chaala|baga|istam|ishtam|kavali|kavalaa|ante|achar|pickles|unnai)\b/i.test(message);
    const isTelugu = hasTeluguScript || hasRomanizedTelugu;

    if (userMessage.includes("pickle") || userMessage.includes("ఆచార") || userMessage.includes("achar") || userMessage.includes("available") || userMessage.includes("have") || userMessage.includes("unnai") || userMessage.includes("unnayi") || userMessage.includes("ye ") || userMessage.includes("daggara") || userMessage.includes("deggara")) {
        return isTelugu
            ? "Maa daggara 3 rakala acharlu unnayi:\n1. Avakaya (chaala kaaram) - ₹220-₹750\n2. Gongura (madhyama kaaram) - ₹200-₹720\n3. Nimmakaya (takkuva kaaram) - ₹180-₹650"
            : "We have 3 delicious pickles:\n1. Avakai (Very Spicy) - ₹220-₹750\n2. Gongura (Medium Spicy) - ₹200-₹720\n3. Lemon (Mild) - ₹180-₹650";
    } else if (userMessage.includes("spicy") || userMessage.includes("hot") || userMessage.includes("కారం") || userMessage.includes("kaaram") || userMessage.includes("karam") || (userMessage.includes("baga") && userMessage.includes("istam"))) {
        return isTelugu
            ? "Meeku kaaram ishtama? Avakaya acharnu sifarsu chesthunnanu! Idi maa spicy special! 🌶️"
            : "Love spicy food? Try our Avakai pickle! It's our spiciest option with a spice level of 5/5! 🌶️";
    } else if (userMessage.includes("mild") || userMessage.includes("beginner") || userMessage.includes("తక్కువ") || userMessage.includes("takkuva")) {
        return isTelugu
            ? "Takkuva masala kavalaa? Nimmakaya achar sarainadi! Chaala ruchiga untundi! 😊"
            : "For mild spice, our Lemon pickle is perfect! It's tangy and not too spicy! 😊";
    } else if (userMessage.includes("gongura") || userMessage.includes("గోంగూర")) {
        return isTelugu
            ? "Gongura achar! Chaala aarogyakaramainadi, iron pushkalanga untundi. Madhyama kaaram. 250g: ₹200, 500g: ₹380, 1kg: ₹720"
            : "Gongura pickle! Rich in iron, tangy and medium spicy. Sizes: 250g (₹200), 500g (₹380), 1kg (₹720)";
    } else if (userMessage.includes("avakai") || userMessage.includes("avakaya") || userMessage.includes("అవకాయ")) {
        return isTelugu
            ? "Avakaya achar! Sampradaya Andhra mamidi achar - chaala kaaram! 250g: ₹220, 500g: ₹400, 1kg: ₹750"
            : "Avakai pickle! Traditional Andhra mango pickle - very spicy! Sizes: 250g (₹220), 500g (₹400), 1kg (₹750)";
    } else if (userMessage.includes("lemon") || userMessage.includes("నిమ్మ")) {
        return isTelugu
            ? "Nimmakaya achar! Takkuva masala, chaala ruchi. 250g: ₹180, 500g: ₹340, 1kg: ₹650"
            : "Lemon pickle! Mild and tangy. Sizes: 250g (₹180), 500g (₹340), 1kg (₹650)";
    } else if (userMessage.includes("price") || userMessage.includes("cost") || userMessage.includes("ధర")) {
        return isTelugu
            ? "Dharalu:\n- Avakaya: ₹220/250g\n- Gongura: ₹200/250g\n- Nimmakaya: ₹180/250g\nPedda sizes kooda unnayi!"
            : "Prices:\n- Avakai: ₹220/250g\n- Gongura: ₹200/250g\n- Lemon: ₹180/250g\nLarger sizes available!";
    } else if (userMessage.includes("hi") || userMessage.includes("hello") || userMessage.includes("నమస్కారం") || userMessage.includes("హలో") || userMessage.includes("namasthe") || userMessage.includes("namaskaram") || userMessage.includes("namaste")) {
        return isTelugu
            ? "Namaskaram! Meeku ela sahayam cheyagalanu? Maa acharla gurinchi adagandi! 🌶️"
            : "Hello! How can I help you today? Ask me about our pickles! 🌶️";
    } else if (userMessage.includes("recommend") || userMessage.includes("suggest") || userMessage.includes("సిఫార్సు") || userMessage.includes("sifarsu") || userMessage.includes("kavali") || userMessage.includes("kavalaa")) {
        return isTelugu
            ? "Meeku entha kaaram kavali? Chaala kaaram ante Avakaya, madhyama ante Gongura, takkuva ante Nimmakaya!"
            : "What's your spice preference? Very spicy → Avakai, Medium → Gongura, Mild → Lemon!";
    } else {
        return isTelugu
            ? "Kshaminchhandi, mee prashna artham kaaledu. Maa acharla gurinchi adagandi! 😊"
            : "I can help you choose a pickle! Ask me about spice levels, prices, or specific varieties! 😊";
    }
}

export async function POST(request: NextRequest) {
    let message = "";
    try {
        const body = await request.json();
        message = body.message;
        const conversationHistory = body.conversationHistory;

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Check if OpenAI API key is configured
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey || apiKey === "your_openai_api_key_here") {
            console.log("⚠️  No valid OpenAI API key, using RULE-BASED fallback chatbot");
            const response = getRuleBasedResponse(message);
            return NextResponse.json({ response, source: "rule-based" });
        }

        // Try OpenAI first
        try {
            console.log("🤖 Attempting OpenAI ChatGPT request...");
            const openai = new OpenAI({ apiKey });

            const systemPrompt = `You are a helpful pickle store assistant. Help customers choose pickles based on their spice preference. We have:
1. Avakai (Very Spicy, ₹220-₹750)
2. Gongura (Medium Spicy, ₹200-₹720)
3. Lemon (Mild, ₹180-₹650)

IMPORTANT: Respond in the same language as the user. 
- If the user speaks in English, respond in English.
- If the user speaks in Telugu (either Telugu script or romanized), respond in ROMANIZED TELUGU using ENGLISH LETTERS ONLY (e.g., "Namaskaram" not "నమస్కారం", "Meeku kaaram ishtama?" not "మీకు కారం ఇష్టమా?").
Keep responses concise (2-3 sentences).`;

            const messages: any[] = [{ role: "system", content: systemPrompt }];

            if (conversationHistory && conversationHistory.length > 0) {
                conversationHistory.slice(-4).forEach((msg: any) => {
                    messages.push({
                        role: msg.role === "assistant" ? "assistant" : "user",
                        content: msg.content
                    });
                });
            }

            messages.push({ role: "user", content: message });

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
                max_tokens: 150,
                temperature: 0.7,
            });

            const responseText = completion.choices[0]?.message?.content;

            if (responseText) {
                console.log("✅ OpenAI ChatGPT response received successfully");
                return NextResponse.json({ response: responseText, source: "openai" });
            }
        } catch (openaiError: any) {
            console.error("❌ OpenAI failed, using RULE-BASED fallback:", openaiError.message);
        }

        // Fallback to rule-based
        console.log("💬 Using RULE-BASED response");
        const response = getRuleBasedResponse(message);
        return NextResponse.json({ response, source: "rule-based" });

    } catch (error: any) {
        console.error("❌ Chatbot Error:", error);
        const fallbackResponse = getRuleBasedResponse(message || "hi");
        return NextResponse.json({ response: fallbackResponse, source: "rule-based-error" });
    }
}
