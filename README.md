# Sehha+ Medical Platform

An AI-powered medical pre-diagnosis platform designed for Moroccan users, providing comprehensive healthcare support in French.

## Features

- **AI Medical Consultations** - Advanced symptom analysis with specialist recommendations
- **Doctor Directory** - Comprehensive database of Moroccan medical professionals
- **Health Passport** - Digital health records with QR code access
- **Anonymous Mental Health Support** - Private psychological consultations
- **Medical Reports** - Professional PDF reports with personalized recommendations
- **Multi-language Support** - French interface optimized for Moroccan healthcare

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **AI Services**: Groq (Llama 3.1), OpenAI GPT-4
- **Deployment**: Railway, Vercel compatible

## Quick Deployment

### Railway (Recommended)
1. Fork this repository
2. Connect to Railway at railway.app
3. Add environment variables from `.env.example`
4. Deploy automatically

### Local Development
```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
SUPABASE_DATABASE_URL=your_supabase_url
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key
NODE_ENV=development
```

## API Endpoints

- `/api/consultations` - Medical consultations
- `/api/doctors` - Doctor directory
- `/api/health-passport` - Health records
- `/api/mental-health` - Anonymous support

## Medical Specialties Supported

- Cardiology
- Gynecology
- Pediatrics
- Dermatology
- Neurology
- Psychiatry
- General Medicine

## License

MIT License - Healthcare platform for educational and research purposes.

## Contact

For medical platform inquiries and deployment support.