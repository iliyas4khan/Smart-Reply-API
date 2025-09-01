# SmartReplyAPI

AI-Powered Response Generator (Node.js, Express, REST, JWT, Gemini)

Features:

JWT-based Authentication (Register/Login, token verification)

Secure AI Endpoints (polish, tone, reply)

Gemini API Integration for real AI responses

Clean Modular Structure (routes, services, middleware)

Environment Config with dotenv

All AI routes protected with JWT


src/
 ├─ routes/
 │   └─ ai.js         # AI endpoints
 ├─ services/
 │   └─ aiService.js  # Gemini API integration + prompt engineering
 ├─ middleware/
 │   └─ auth.js       # JWT verification middleware
 └─ server.js         # Express app entry point