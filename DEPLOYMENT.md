# Deploy Sehha+ to Railway

## Step 1: Upload to GitHub
1. Create repository at github.com/new
2. Name it "sehha-medical-platform"
3. Upload all project files
4. Ensure .env file is NOT uploaded (protected by .gitignore)

## Step 2: Deploy to Railway
1. Go to railway.app
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your sehha-medical-platform repository
5. Railway automatically detects Node.js and deploys

## Step 3: Add Environment Variables
In Railway dashboard, add these variables:

```
SUPABASE_DATABASE_URL=your_supabase_connection_string
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
NODE_ENV=production
```

## Result
Your medical platform will be live at: `your-app.railway.app`

## Features Working
- AI Medical Consultations
- Doctor Search & Reviews
- Health Passport with QR codes
- Anonymous Mental Health Chat
- PDF Medical Reports
- Supabase Database Integration

## Cost
$5 free credits monthly (sufficient for medical platform traffic)