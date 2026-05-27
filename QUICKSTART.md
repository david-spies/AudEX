# 🚀 AudEX Quick Start Guide

Get AudEX up and running in minutes!

## ⏱️ Time Estimates

- **Full Setup:** 5-10 minutes
- **Development Start:** 2 minutes (after setup)
- **Production Build:** 3-5 minutes
- **Deployment:** Varies by platform (10-30 minutes)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup (5 Minutes)](#quick-setup-5-minutes)
3. [Running the App](#running-the-app)
4. [Testing](#testing)
5. [Building for Production](#building-for-production)
6. [Deployment Options](#deployment-options)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Check Your System

```bash
# Verify Python
python3 --version      # Should be 3.8+

# Verify Node.js
node --version         # Should be 16+
npm --version          # Should be 8+

# Verify FFmpeg
ffmpeg -version        # Should show version info
```

### Missing Something?

**macOS:**
```bash
brew install python node ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install python3 python3-pip python3-venv nodejs npm ffmpeg -y
```

**Windows (Chocolatey):**
```bash
choco install python nodejs ffmpeg
```

**Windows (Manual):**
- Download Python: https://www.python.org/downloads/
- Download Node.js: https://nodejs.org/
- Download FFmpeg: https://ffmpeg.org/download.html

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Create Project Folder

```bash
mkdir audex
cd audex
```

### Step 2: Create Directory Structure

```bash
mkdir -p backend/{uploads,outputs} frontend/{src,public}
```

### Step 3: Copy All Files

Copy these from the provided artifacts to their respective locations:

**Backend files:**
- `app.py` → `backend/app.py`
- `requirements.txt` → `backend/requirements.txt`

**Frontend files:**
- `package.json` → `frontend/package.json`
- `vite.config.js` → `frontend/vite.config.js`
- `tailwind.config.js` → `frontend/tailwind.config.js`
- `postcss.config.js` → `frontend/postcss.config.js`
- `index.html` → `frontend/index.html`
- `src/main.jsx` → `frontend/src/main.jsx`
- `src/App.jsx` → `frontend/src/App.jsx`
- `src/index.css` → `frontend/src/index.css`

**Root scripts:**
- `start.sh` → `start.sh` (chmod +x after copying)
- `build.sh` → `build.sh` (chmod +x after copying)

### Step 4: Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate    # macOS/Linux
# OR
.\venv\Scripts\activate     # Windows (PowerShell)

# Install dependencies
pip install -r requirements.txt

# Return to root
cd ..
```

### Step 5: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Return to root
cd ..
```

### Step 6: Make Scripts Executable (macOS/Linux only)

```bash
chmod +x start.sh
chmod +x build.sh
```

✅ **Setup Complete!**

---

## 🎬 Running the App

### Option 1: Start Both Servers (Recommended)

```bash
./start.sh
```

You should see:
```
🎬 Starting AudEX Application
==================================
Starting Backend (Port 5000)...
Starting Frontend (Port 5173)...

✅ Servers Running!
==================================
Frontend: http://localhost:5173
Backend:  http://localhost:5000
==================================
Press Ctrl+C to stop
```

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate    # macOS/Linux
.\venv\Scripts\activate     # Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 3: Stop Servers

Press `Ctrl+C` in the terminal running `./start.sh`

Or kill the processes:
```bash
# macOS/Linux
kill $(lsof -t -i:5000)
kill $(lsof -t -i:5173)

# Windows
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

---

## 🧪 Testing

### Test Backend is Running

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"healthy","service":"AudEX"}
```

### Test Frontend is Running

Open in browser: http://localhost:5173

You should see the AudEX interface with:
- Upload area with drag-and-drop
- Transcription result panel
- Export buttons (TXT, DOCX, PDF)

### Test Full Workflow

1. **Open** http://localhost:5173 in browser
2. **Find** an audio file (MP3, WAV, etc.) on your computer
3. **Drag & drop** the file into the upload area
4. **Click** "Start Transcription"
5. **Wait** for processing (takes 10-30 seconds depending on file size)
6. **View** the transcription in the right panel
7. **Export** as TXT, DOCX, or PDF

---

## 📦 Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized `frontend/dist/` folder with all your static files.

### Or use the build script

```bash
./build.sh
```

---

## 🚀 Deployment Options

### Option 1: Deploy Frontend to Netlify (Free)

**Easiest for demo/prototype:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

Gets you a live URL like: `https://audex-abc123.netlify.app`

### Option 2: Deploy Frontend to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

### Option 3: Deploy Full Stack to Render (Free Tier)

**Best for complete solution:**

1. Push code to GitHub
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. **For Backend:**
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
6. **For Frontend:**
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Update `VITE_API_URL` environment variable

### Option 4: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 5: Traditional VPS (DigitalOcean, Linode, AWS)

**Backend:**
```bash
# SSH into server
ssh user@your-server.com

# Clone project
git clone your-repo
cd audex/backend

# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start with Gunicorn
gunicorn -w 4 -b 127.0.0.1:5000 app:app
```

**Frontend:**
```bash
# On same server
cd audex/frontend
npm install
npm run build

# Copy to web root
sudo cp -r dist/* /var/www/html/
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
    }
}
```

---

## ⚠️ Troubleshooting

### Error: "Port 5000/5173 already in use"

**macOS/Linux:**
```bash
lsof -i :5000  # Find process
kill -9 <PID>  # Kill it
```

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: "Command not found: python3"

Make sure Python is installed:
```bash
python3 --version
# If not found, install from https://www.python.org/downloads/
```

### Error: "Cannot find module 'flask'"

Make sure virtual environment is activated:
```bash
cd backend
source venv/bin/activate    # macOS/Linux
.\venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### Error: "ffmpeg not found"

Install FFmpeg:
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt install ffmpeg

# Windows - download from https://ffmpeg.org/download.html
```

### Error: "CORS policy error in browser"

This means the frontend can't reach the backend. Make sure:
1. Backend is running on http://localhost:5000
2. Frontend is running on http://localhost:5173
3. Check `frontend/.env` has correct API URL
4. Restart both servers

### Error: "npm install fails"

Clear cache and retry:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error: "Module not found" when building frontend

```bash
cd frontend
npm install  # Ensure all dependencies installed
npm run build
```

### Transcription takes too long

This is normal! It depends on:
- File size (larger = longer)
- Audio quality
- Whisper model (larger models = slower but more accurate)
- System specs (more RAM/CPU = faster)

Expected times with base model:
- 1 minute audio: ~5-10 seconds
- 30 minutes audio: ~10-30 seconds
- 1 hour audio: ~20-60 seconds

---

## 📝 Common Tasks

### Change API Port

Edit `backend/app.py`:
```python
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8000)  # Change 5000 to 8000
```

### Change Frontend Port

Edit `frontend/vite.config.js`:
```javascript
server: {
    port: 3000,  // Change from 5173 to 3000
    ...
}
```

### Update API URL for Production

Edit `frontend/.env`:
```env
VITE_API_URL=https://your-api-domain.com
```

### Customize Colors

Edit `frontend/src/App.jsx` and search for gradient colors:
```jsx
className="bg-gradient-to-r from-purple-400 to-pink-400"
// Change to your colors
```

### Generate Custom Icons

Use the AudEX Icon Generator tool (interactive artifact) to:
1. Customize colors
2. Download vite.svg and PNG icons
3. Place in `frontend/public/`

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured (`.env` files created)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend starts without errors (`python app.py`)
- [ ] All API endpoints tested (`curl http://localhost:5000/health`)
- [ ] Upload/download working locally
- [ ] All export formats tested (TXT, DOCX, PDF)
- [ ] HTTPS enabled (if deploying publicly)
- [ ] Rate limiting configured (if needed)
- [ ] Logging enabled for debugging
- [ ] Error messages user-friendly (no stack traces)

---

## 🎯 Next Steps

1. **Local Development:**
   - Run `./start.sh`
   - Test with audio files
   - Customize as needed

2. **Test Production Build:**
   - Run `./build.sh` or `cd frontend && npm run build`
   - Test `frontend/dist/` locally

3. **Deploy:**
   - Choose deployment platform above
   - Follow platform-specific instructions
   - Update `VITE_API_URL` for production

4. **Monitor:**
   - Check logs for errors
   - Monitor performance
   - Track API usage

---

## 📚 Additional Resources

- **Full Documentation:** See [README.md](./README.md)
- **Whisper Docs:** https://github.com/openai/whisper
- **Flask Docs:** https://flask.palletsprojects.com/
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

---

## 🆘 Need Help?

1. **Check logs:**
   ```bash
   # Backend errors
   tail -f backend/error.log
   
   # Frontend errors - check browser console (F12)
   ```

2. **Verify setup:**
   ```bash
   python3 --version
   node --version
   npm --version
   ffmpeg -version
   ```

3. **Test endpoints:**
   ```bash
   curl http://localhost:5000/health
   curl http://localhost:5000/api/formats
   ```

4. **Check README.md** for comprehensive troubleshooting

---

<div align="center">

**🎉 You're ready to use AudEX!**

Happy transcribing! 🎵

</div>