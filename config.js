// Production configuration for self-hosted deployment
export const config = {
  // Your hosting server domain - update this to your actual domain
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' // Replace with your actual domain
    : 'http://localhost:5000',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/sehha_db',
  
  // AI Service endpoints (self-hosted)
  AI_ENDPOINTS: {
    GROQ_API_URL: process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1',
    OPENAI_API_URL: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
  },
  
  // Email service (self-hosted)
  EMAIL_CONFIG: {
    SMTP_HOST: process.env.SMTP_HOST || 'localhost',
    SMTP_PORT: process.env.SMTP_PORT || 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
  },
  
  // Application settings
  APP_CONFIG: {
    NAME: 'Sehha+',
    VERSION: '1.0.0',
    DESCRIPTION: 'AI-powered medical pre-diagnosis platform',
    SUPPORT_EMAIL: 'contact@sehhaplus.com',
    SUPPORT_PHONE: '+212 5 22 25 15 45',
  }
};