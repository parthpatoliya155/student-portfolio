/*
  aiRoutes.js
  Secure Backend Route for External AI Service Integration (OpenAI / Gemini)
  Author: Parth Patoliya | Practical 13: External AI Service Integration & Responsible AI

  Architecture & Security:
  - API keys are strictly server-side (stored in .env), NEVER exposed to client.
  - Rate limiting protects against denial-of-wallet / quota exhaustion.
  - Implements Graceful Degradation: If OpenAI/Gemini fails or key is missing,
    a high-quality fallback suggestion is returned so the app never crashes.
*/

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI client (API key read securely from process.env)
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_key_here' || apiKey === 'your_openai_api_key_here') {
        return null;
    }
    return new OpenAI({ apiKey });
};

// Simple In-Memory Rate Limiting: Max 1 request per 5 seconds per client
const clientLastRequest = new Map();
const RATE_LIMIT_WINDOW_MS = 5000;

// POST /api/ai/generate-description (and /ai/generate-description)
router.post('/generate-description', async (req, res) => {
    const { title } = req.body;

    // 1. Input Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
            error: "Task title is required to generate a description."
        });
    }

    const trimmedTitle = title.trim();

    // 2. Simple Rate Limiting Check (Responsible AI Usage)
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
    const now = Date.now();
    const lastRequest = clientLastRequest.get(clientIp);

    if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW_MS) {
        const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequest)) / 1000);
        return res.status(429).json({
            error: `Rate limit exceeded. Please wait ${waitSeconds}s before requesting another AI suggestion.`
        });
    }
    clientLastRequest.set(clientIp, now);

    // 3. Graceful Fallback Helper
    const generateFallback = (reason) => {
        return {
            description: `Complete the task "${trimmedTitle}" by reviewing requirements, executing key milestones, verifying acceptance criteria, and updating progress documentation.`,
            suggestedPriority: trimmedTitle.toLowerCase().includes('urgent') || trimmedTitle.toLowerCase().includes('bug') ? 'high' : 'medium',
            fallback: true,
            source: 'rule-based-fallback',
            message: reason || "AI service currently unavailable. Applied rule-based smart suggestion."
        };
    };

    // 4. Call External AI Service (with Graceful Degradation)
    try {
        const openai = getOpenAIClient();

        // If no API key configured, degrade gracefully without crashing
        if (!openai) {
            return res.status(200).json(generateFallback("No active external AI key configured in server environment."));
        }

        // Call OpenAI Chat Completion API (gpt-4o-mini)
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an AI assistant integrated into a student Task Management application. Given a task title, generate a clear, professional, concise 2-sentence description of the actionable steps required. Do not wrap in quotes.'
                },
                {
                    role: 'user',
                    content: `Write a concise task description for: "${trimmedTitle}"`
                }
            ],
            max_tokens: 120,
            temperature: 0.7
        });

        const aiText = completion.choices[0]?.message?.content?.trim();

        if (!aiText) {
            return res.status(200).json(generateFallback("Empty response from AI model."));
        }

        return res.status(200).json({
            description: aiText,
            fallback: false,
            source: 'openai-gpt-4o-mini'
        });

    } catch (err) {
        // Log server-side diagnostic error
        console.warn(`[AI SERVICE WARNING] External API call failed: ${err.message}. Triggering graceful degradation.`);

        // Return HTTP 200 with fallback payload so frontend flow never breaks
        return res.status(200).json(generateFallback(`AI call encountered an issue (${err.message}). Safe fallback provided.`));
    }
});

module.exports = router;
