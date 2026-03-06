<img width="1280" height="632" alt="AudEX - Transcriber" src="https://github.com/user-attachments/assets/aadeffd2-4d2e-4b43-aff7-765f2e4b2d1d" />

## 🎙️ AudEX: Neural Audio Intelligence

AudEX is a neural transcription engine that leverages OpenAI's Whisper models and a modern React 19/Vite 6 frontend to transform audio and video into structured text.

## 🚀 Features
***Neural Transcription:* Powered by `faster-whisper` (int8 quantization) for near-real-time CPU processing.
*** Speaker Diarization:* Automated identification of multiple speakers with timestamped segments.
*** Live Speaker Mapping:* Update "Speaker 1, 2, 3" labels globally in the UI and export files instantly.
*** Multi-Format Export:* Precision exports to `.txt`, `.docx`, and `.pdf`.
*** Widescreen UI:* Enhanced 15% width transcription output for deep readability.

## 📦 Local Deployment

### 1. Prerequisites
* **FFmpeg:   Must be installed on your system path.
* **Python:   3.10 or higher.
* **Node.js:  v18 or higher.


### 2. Hugging Face Access (Required for Diarization)
To use the Speaker ID feature, you must accept the user conditions on Hugging Face for the following models:
1. [pyannote/speaker-diarization-3.1](https://huggingface.co/pyannote/speaker-diarization-3.1)
2. [pyannote/segmentation-3.0](https://huggingface.co/pyannote/segmentation-3.0)

Create a **User Access Token** (Read) at [hf.co/settings/tokens](https://hf.co/settings/tokens).


### 3. Backend Setup
bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Set your token
export HF_TOKEN="your_token_here" 
python app.py


### 4. Frontend Setup
bash
cd frontend
npm install
npm run dev

The app will be available at http://localhost:5173.
⚙️ Configuration & Environment
Frontend (frontend/.env)

The frontend is pre-configured to use a Vite Proxy. For local development, variables are optional unless you're bypassing the proxy.

    VITE_API_URL: (Optional) Defaults to /api via vite.config.js.

Backend (backend/.env)

Create a .env file in the root of the /backend directory.

Add or edit .env

cd backend
nano .env


🛠️ Tech Stack
Layer	    Technology	         Purpose
Frontend	Vite 6 + React 19	 Ultra-fast HMR and optimized builds.
Styling	    Tailwind CSS v4	     Design tokens and Glassmorphism UI.
Processing	OpenAI Whisper	     Neural speech-to-text.
Video	    MoviePy + FFmpeg	 Multi-format audio extraction.
Builds	    Esbuild	             20x faster minification than Terser.
Backend     Flask (Python 3.10+), Faster-Whisper, Pyannote.audio.

Inference: Optimized for CPU/GPU using CTranslate2.

🏗️ Architectural Workflow

Audio or Video files travel from the user's browser through the neural processing layer and back as an exported document.


📂 Project Structure

    /frontend: React application, Tailwind config, and Vite logic.

    /backend: Flask API, Whisper model integration, and file processing.

    /uploads: Temporary storage for processing (auto-cleaned).


🔐 Security & Privacy Notes

* Local Processing: Audio files are processed on your local machine. No audio data is sent to external APIs (except for downloading model weights from Hugging Face during the first run).

* Environment Variables: Never hardcode your HF_TOKEN. Use a .env file or system environment variables.

* Network Timeouts: For files longer than 5 minutes, ensure vite.config.js and App.jsx timeout settings are set to 0 (infinity) to allow the AI engine time to complete the inference.

## Final Step
Add your `HF_TOKEN` to a `.env` file in your `/backend` folder so you don't have to `export` it every time you restart your terminal:


    Install the loader: Run pip install python-dotenv in your backend virtual environment.

    Create the file: Create a new file named .env in the backend/ directory.

    Add your token: Inside .env, add the following line:
    HF_TOKEN=hf_your_actual_token_here

    When you run python app.py, the AI engine will authenticate automatically.


Built with prompts utilizing Claude AI, Google Gemini

Authors

    David Spies

