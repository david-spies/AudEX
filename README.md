![AudEX - Professional Audio to Text Transcription](docs/banner.svg)

# 🎵 AudEX - Professional Audio to Text Transcription

![AudEX Banner](https://img.shields.io/badge/AudEX-Audio%20Transcription-blueviolet?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=flat-square&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)

**AudEX** is a modern, production-ready audio and video transcription application that converts speech to text with high accuracy using OpenAI's Whisper AI model. Features a beautiful React frontend and robust Python backend with support for multiple export formats.

## ✨ Features

### Core Functionality
- 🎙️ **Audio Transcription** - Convert MP3, WAV, M4A, FLAC, OGG, WebM to text
- 🎬 **Video Support** - Extract audio from MP4, AVI, MOV, MKV videos automatically
- 🤖 **AI-Powered** - Uses OpenAI Whisper for state-of-the-art accuracy
- 🌍 **Multilingual** - Supports 99+ languages with automatic detection
- 📥 **Drag & Drop** - Intuitive drag-and-drop file upload interface
- 📤 **Multiple Exports** - TXT, DOCX, and PDF format support

### User Interface
- ✨ Modern glassmorphism design with gradient backgrounds
- 📱 Fully responsive (desktop, tablet, mobile)
- 🎨 Customizable color schemes
- ⚡ Real-time progress tracking
- 🔔 Instant feedback and error handling

### Technical Excellence
- 🚀 Production-ready deployment configurations
- 🐳 Docker and Docker Compose support
- 📦 PWA (Progressive Web App) ready
- 🔒 Secure file handling with cleanup
- 📊 Comprehensive logging and error tracking
- ⚙️ RESTful API architecture

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18+ with Hooks
- Tailwind CSS for styling
- Vite for build tooling
- Axios for API communication
- Lucide React for icons

**Backend:**
- Flask 3.0+ web framework
- OpenAI Whisper for speech recognition
- MoviePy for video processing
- Python-docx for DOCX generation
- FPDF for PDF generation
- Gunicorn for production serving

**Infrastructure:**
- Docker & Docker Compose
- Nginx (reverse proxy)
- FFmpeg for multimedia processing
- Systemd for service management

## 📋 Prerequisites

### Hugging Face Access (Required for Diarization)
To use the Speaker ID feature, you must accept the user conditions on Hugging Face for the following models:
1. [pyannote/speaker-diarization-3.1](https://huggingface.co/pyannote/speaker-diarization-3.1)
2. [pyannote/segmentation-3.0](https://huggingface.co/pyannote/segmentation-3.0)

Create a **User Access Token** (Read) at [hf.co/settings/tokens](https://hf.co/settings/tokens).

### System Requirements
- **Python:** 3.10 or higher
- **Node.js:** v18 or higher
- **npm:** 8 or higher
- **FFmpeg:** Latest stable version - Must be installed on your system path.
- **RAM:** 4GB minimum (8GB recommended for better performance)
- **Disk Space:** 2GB+ for Whisper models

### Installation

**macOS:**
```bash
brew install python node ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv nodejs npm ffmpeg -y
```

**Windows:**
```bash
# Using Chocolatey
choco install python nodejs ffmpeg -y

# Or download installers:
# Python: https://www.python.org/downloads/
# Node.js: https://nodejs.org/
# FFmpeg: https://ffmpeg.org/download.html
```

## 🚀 Quick Start

For detailed quick start instructions, see [QUICKSTART.md](./QUICKSTART.md)

### 30-Second Setup:

```bash
# 1. Clone or download the project
cd audex

# 2. Run automated setup
chmod +x setup.sh
./setup.sh

# 3. Start both servers
./start.sh

# 4. Open in browser
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## 📁 Project Structure

```
audex/
├── backend/
│   ├── app.py                    # Flask application (main entry point)
│   ├── requirements.txt          # Python dependencies
│   ├── venv/                     # Virtual environment (auto-created)
│   ├── uploads/                  # User uploads (auto-created)
│   └── outputs/                  # Export files (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind CSS imports
│   ├── public/
│   │   ├── vite.svg             # SVG favicon
│   │   ├── favicon-*.png        # PNG favicon fallbacks
│   │   ├── apple-touch-icon.png # iOS icon
│   │   ├── manifest.json        # PWA manifest
│   │   └── index.html           # HTML template
│   ├── index.html               # Entry HTML
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   └── .env                     # Environment variables
├── setup.sh                     # Automated setup script
├── start.sh                     # Concurrent server starter
├── build.sh                     # Production build script
└── README.md                    # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
FLASK_ENV=production
WHISPER_MODEL=base
MAX_FILE_SIZE=500
PORT=5000
DEBUG=False
```

**Whisper Model Options:**
- `tiny` - Fastest, lowest accuracy (~39M parameters)
- `base` - Balanced (recommended) (~74M parameters)
- `small` - Better accuracy (~244M parameters)
- `medium` - High accuracy (~769M parameters)
- `large` - Highest accuracy (~1.5B parameters)

### Frontend Configuration

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

For production:
```env
VITE_API_URL=https://your-backend-domain.com
```

## 📝 API Endpoints

### Health Check
```
GET /health
Response: {"status": "healthy", "service": "AudEX"}
```

### Transcribe Audio/Video
```
POST /api/transcribe
Content-Type: multipart/form-data
Body: file (audio/video file)

Response:
{
  "success": true,
  "transcription": "Full transcribed text...",
  "language": "en",
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 5.5,
      "text": "Segment text...",
      "tokens": [...],
      "temperature": 0.0,
      "avg_logprob": -0.35,
      "compression_ratio": 1.2,
      "no_speech_prob": 0.001
    }
  ]
}
```

### Export Transcription
```
POST /api/export
Content-Type: application/json
Body: {
  "text": "transcription text",
  "format": "txt|docx|pdf"
}

Response: File download
```

### Get Supported Formats
```
GET /api/formats
Response: {
  "audio": [".mp3", ".wav", ".m4a", ".flac", ".ogg", ".webm"],
  "video": [".mp4", ".avi", ".mov", ".mkv", ".webm"],
  "export": ["txt", "docx", "pdf"]
}
```

## 🧪 Testing

### Run Both Servers (Recommended)
```bash
./start.sh
```

### Test Backend Separately
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

### Test Frontend Separately
```bash
cd frontend
npm run dev
```

### API Testing
```bash
# Health check
curl http://localhost:5000/health

# Transcribe (with audio file)
curl -X POST -F "file=@sample.mp3" http://localhost:5000/api/transcribe

# Get formats
curl http://localhost:5000/api/formats
```

## 🏗️ Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```

Output: `frontend/dist/` - Ready for deployment

### Create Production Build Script
```bash
chmod +x build.sh
./build.sh
```

## 🚢 Deployment

### Docker Deployment
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Traditional Server Deployment

**Backend (Gunicorn):**
```bash
cd backend
source venv/bin/activate
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 300 app:app
```

**Frontend (Nginx):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/audex/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

### Cloud Deployment

**Netlify (Frontend):**
```bash
netlify deploy --prod --dir=frontend/dist
```

**Vercel (Frontend):**
```bash
vercel --prod
```

**Render (Full Stack):**
1. Connect GitHub repository
2. Set environment variables
3. Deploy backend and frontend separately

**Railway (Backend):**
1. New project → Deploy from GitHub
2. Set root directory to `backend`
3. Configure start command

See [QUICKSTART.md](./QUICKSTART.md) for detailed deployment instructions.

## 🎨 Customization

### Colors & Branding

Update frontend color scheme in `frontend/src/App.jsx`:

```jsx
// Search for gradient-to-r and gradient-to-br classes
// Modify Tailwind color values to match your brand
```

### Icons

Generate custom icons using the AudEX Icon Generator (interactive tool in artifacts).

Update favicon placement:
1. Generate icons
2. Place in `frontend/public/`
3. Update `frontend/index.html` as needed

## 🐛 Troubleshooting

### Port Already in Use
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### FFmpeg Not Found
```bash
# Verify installation
which ffmpeg  # macOS/Linux
where ffmpeg  # Windows

# Reinstall
brew install ffmpeg       # macOS
sudo apt install ffmpeg   # Ubuntu
```

### Python Dependencies Issue
```bash
cd backend
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Node Modules Error
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
Ensure Flask-CORS is installed and initialized in `app.py`:
```python
from flask_cors import CORS
CORS(app)
```

## 📊 Performance Optimization

### Whisper Model Selection
- Use `base` model for most use cases (good balance)
- Use `tiny` for quick transcriptions (lower accuracy)
- Use `small`/`medium` for professional quality

### File Size Limits
- Default: 500MB maximum
- Adjust in `app.py`: `MAX_CONTENT_LENGTH`
- Consider infrastructure limits for larger files

### Concurrent Requests
- Configure worker processes in Gunicorn
- Use Redis for caching if needed
- Implement job queues for long operations

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Fast setup and deployment
- **API Documentation** - See endpoints section above
- **[Whisper Documentation](https://github.com/openai/whisper)** - Model details
- **[Flask Documentation](https://flask.palletsprojects.com/)** - Backend framework
- **[React Documentation](https://react.dev)** - Frontend framework

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Create feature branch: `git checkout -b feature/AmazingFeature`
2. Commit changes: `git commit -m 'Add AmazingFeature'`
3. Push to branch: `git push origin feature/AmazingFeature`
4. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

### Getting Help
- **Issues:** Open a GitHub issue with detailed information
- **Discussions:** Use GitHub discussions for questions
- **Documentation:** Check QUICKSTART.md and README thoroughly

### Reporting Bugs
1. Describe the bug clearly
2. Steps to reproduce
3. Expected vs actual behavior
4. System information (OS, Python version, etc.)
5. Log output from `backend/error.log`

## 🎯 Roadmap

- ✅  Speaker diarization support
- [ ] Real-time transcription (streaming)
- [ ] Custom vocabulary support
- [ ] Batch processing for multiple files
- [ ] Transcription quality metrics
- [ ] User authentication and accounts
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] Advanced editing interface
- [ ] Subtitle generation (SRT, VTT)
- [ ] Cost estimation/usage tracking

## 🔐 Security & Privacy Notes

- ✅ Secure file upload and validation
- ✅ Automatic file cleanup after processing
- ✅ HTTPS support ready
- ✅ Input validation on all endpoints
- ✅ CORS properly configured
- ✅ No sensitive data logging

* Local Processing: Audio files are processed on your local machine. No audio data is sent to external APIs (except for downloading model weights from Hugging Face during the first run).

* Environment Variables: Never hardcode your HF_TOKEN. Use a .env file or system environment variables.

* Network Timeouts: For files longer than 5 minutes, ensure vite.config.js and App.jsx timeout settings are set to 0 (infinity) to allow the AI engine time to complete the inference.

### Security Best Practices

1. **Always use HTTPS in production**
2. **Validate file types server-side**
3. **Implement rate limiting**
4. **Use environment variables for secrets**
5. **Keep dependencies updated**
6. **Monitor logs for suspicious activity**

## ⚡ Performance Metrics

- **Transcription Speed:** ~1.5x real-time with base model
- **Average Response Time:** 5-30 seconds (varies by file size)
- **Memory Usage:** ~1-4GB depending on model size
- **Supported File Sizes:** Up to 500MB
- **Concurrent Users:** Scales horizontally with Docker

## Final Step
Add your `HF_TOKEN` to a `.env` file in your `/backend` folder so you don't have to `export` it every time you restart your terminal:

    Install the loader: Run pip install python-dotenv in your backend virtual environment.

    Create the file: Create a new file named .env in the backend/ directory.

    Add your token: Inside .env, add the following line:
    HF_TOKEN=hf_your_actual_token_here

    When you run python app.py, the AI engine will authenticate automatically.

---

<div align="center">

**Made with ❤️ by the AudEX Team**

[⭐ Star us on GitHub](https://github.com/david-spies/AudEX) 

</div>
