// ============================================
// FILE: frontend/package.json
// ============================================
{
  "name": "audex-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "serve": "vite preview --port 4173"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.0"
  }
}

// ============================================
// FILE: frontend/vite.config.js
// ============================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  }
})

// ============================================
// FILE: frontend/tailwind.config.js
// ============================================
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// ============================================
// FILE: frontend/postcss.config.js
// ============================================
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// ============================================
// FILE: frontend/index.html
// ============================================
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AudEX - Professional Audio to Text Transcription" />
    <title>AudEX - Audio Transcription</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// ============================================
// FILE: frontend/src/main.jsx
// ============================================
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// ============================================
// FILE: frontend/src/index.css
// ============================================
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

// ============================================
// FILE: frontend/src/App.jsx
// ============================================
import React, { useState, useRef } from 'react';
import { Upload, FileAudio, Download, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const supportedFormats = [
    '.mp3', '.wav', '.m4a', '.flac', '.ogg', '.webm',
    '.mp4', '.avi', '.mov', '.mkv'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!supportedFormats.includes(fileExt)) {
      setErrorMsg(`Unsupported file format. Please use: ${supportedFormats.join(', ')}`);
      setStatus('error');
      return;
    }
    
    setFile(selectedFile);
    setStatus('idle');
    setErrorMsg('');
    setTranscription('');
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const transcribeAudio = async () => {
    if (!file) return;

    setStatus('processing');
    setErrorMsg('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setTranscription(response.data.transcription);
        setStatus('success');
      } else {
        throw new Error('Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      setErrorMsg(error.response?.data?.error || 'Transcription failed. Please try again.');
      setStatus('error');
    }
  };

  const exportFile = async (format) => {
    if (!transcription) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/export`,
        {
          text: transcription,
          format: format
        },
        {
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transcription.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      setErrorMsg('Export failed. Please try again.');
    }
  };

  const reset = () => {
    setFile(null);
    setTranscription('');
    setStatus('idle');
    setErrorMsg('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileAudio className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AudEX
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Professional Audio to Text Transcription
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Audio/Video</h2>
            
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-gray-500 hover:border-purple-400 hover:bg-white/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <p className="text-white text-lg mb-2">
                  Drag & drop your file here
                </p>
                <p className="text-gray-400 mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={supportedFormats.join(',')}
                  onChange={handleFileInput}
                />
                <p className="text-gray-500 text-sm mt-4">
                  Supported: MP3, WAV, M4A, FLAC, OGG, MP4, AVI, MOV, MKV
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileAudio className="w-8 h-8 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <button
                  onClick={transcribeAudio}
                  disabled={status === 'processing'}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-4 rounded-lg font-semibold transition-all text-lg flex items-center justify-center gap-2"
                >
                  {status === 'processing' ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing... {progress}%
                    </>
                  ) : (
                    'Start Transcription'
                  )}
                </button>

                {status === 'error' && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <p className="text-red-200">{errorMsg}</p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <p className="text-green-200">Transcription completed!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Transcription Result</h2>
            
            {transcription ? (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {transcription}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-white font-semibold">Export Options:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => exportFile('txt')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      TXT
                    </button>
                    <button
                      onClick={() => exportFile('docx')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      DOCX
                    </button>
                    <button
                      onClick={() => exportFile('pdf')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <FileAudio className="w-20 h-20 mb-4 opacity-50" />
                <p className="text-lg">No transcription yet</p>
                <p className="text-sm">Upload and process a file to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3">Features:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-300 text-sm">
            <div>
              <CheckCircle className="w-4 h-4 inline mr-2 text-green-400" />
              Drag & drop interface
            </div>
            <div>
              <CheckCircle className="w-4 h-4 inline mr-2 text-green-400" />
              Multiple audio/video formats
            </div>
            <div>
              <CheckCircle className="w-4 h-4 inline mr-2 text-green-400" />
              Export to TXT, DOCX, PDF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// FILE: frontend/.env.example
// ============================================
VITE_API_URL=http://localhost:5000