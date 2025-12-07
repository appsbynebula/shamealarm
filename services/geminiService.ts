import { GoogleGenAI, Modality } from "@google/genai";
import { ShameContent } from "../types";
import { decodeAudioData } from "./audioService";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// UPDATED: Much more aggressive system instruction
const SYSTEM_INSTRUCTION_TEXT = `
You are the "Shame Alarm". Your user just failed a productivity timer. They are weak, pathetic, and deserve to be publicly roasted.
Your job is to generate a brutal, biting, and hilarious tweet to shame them.
- Be direct and mean. Use words like "pathetic", "clown", "weak", "useless".
- Mock their inability to focus for even a few minutes.
- Keep it under 140 characters.
- NO hashtags (I will add them).
- Example style: "Look at this absolute clown. 5 minutes in and already scrolling TikTok. Enjoy being average forever."
`;

// UPDATED: Brutal fallback list
const FALLBACK_INSULTS = [
    "I have the attention span of a gnat and the discipline of a toddler.",
    "Look at me, I'm a failure who can't even sit still for 10 minutes.",
    "I am physically incapable of doing hard work. Roast me.",
    "I just quit my work timer to look at memes. I will never be successful.",
    "My willpower is non-existent. I am destined for mediocrity.",
    "WARNING: I am a productivity coward who runs away from effort.",
    "I clicked 'Give Up' because I'm addicted to cheap dopamine.",
    "Imagine being so weak you can't focus for 20 minutes. Couldn't be me. Oh wait, it IS me.",
    "I am a slave to my notifications. Shame me.",
    "I traded my dreams for 30 seconds of Instagram. I am a clown.",
    "Pathetic. I just gave up immediately. Weak mindset.",
    "My ancestors survived wars, but I can't survive 15 minutes of studying.",
    "I am the reason society is collapsing. Zero discipline.",
    "I panicked and quit because actual work is too scary for me.",
    "I literally have no excuse. I'm just lazy.",
    "Certified quitter. Please unfollow me, I don't deserve friends."
];

export const generateShame = async (): Promise<ShameContent> => {
  try {
    // 1. Generate the text insult
    let insultText = "";
    
    // If we have an API key, try to use it
    if (process.env.API_KEY) {
        const modelText = 'gemini-2.5-flash';
        const textResponse = await ai.models.generateContent({
        model: modelText,
        contents: "Generate one brutal failure tweet.",
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_TEXT,
            temperature: 1.5, // High temperature for creative insults
        },
        });
        insultText = textResponse.text || "";
    }

    // Fallback logic
    if (!insultText) {
        const randomIndex = Math.floor(Math.random() * FALLBACK_INSULTS.length);
        insultText = FALLBACK_INSULTS[randomIndex];
    }

    // 2. Generate the Audio (TTS)
    let audioBuffer: AudioBuffer | undefined;
    
    if (process.env.API_KEY) {
        try {
            const modelTTS = 'gemini-2.5-flash-preview-tts';
            // The TTS should also sound disappointed/angry
            const ttsResponse = await ai.models.generateContent({
                model: modelTTS,
                contents: [{ parts: [{ text: `You failed! ${insultText}` }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Fenrir sounds deeper/scarier
                        },
                    },
                },
            });

            const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                audioBuffer = await decodeAudioData(base64Audio);
            }
        } catch (ttsError) {
            console.warn("TTS Generation failed, continuing with text only", ttsError);
        }
    }

    return {
      text: insultText,
      audioBuffer
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    const randomIndex = Math.floor(Math.random() * FALLBACK_INSULTS.length);
    return {
      text: FALLBACK_INSULTS[randomIndex],
    };
  }
};