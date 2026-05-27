import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileAudio, Download, X, AlertCircle, Loader2, Waves, Users, Clock, RotateCcw, FolderOpen, UserPlus } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

export default function App() {
  const [file, setFile] = useState(null);
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Speaker Mapping State
  const [speakerNames, setSpeakerNames] = useState({});

  // Build Specs
  const [diarization, setDiarization] = useState(false);
  const [timestamps, setTimestamps] = useState(false);

  const fileInputRef = useRef(null);

  const supportedFormats = [
    '.mp3', '.wav', '.m4a', '.flac', '.ogg', '.webm',
    '.mp4', '.avi', '.mov', '.mkv'
  ];

  // Effect to extract unique speakers when transcription finishes
  useEffect(() => {
    if (transcriptionData) {
      const uniqueSpeakers = [...new Set(transcriptionData.map(s => s.speaker))];
      const initialMap = {};
      uniqueSpeakers.forEach(spk => {
        initialMap[spk] = spk; 
      });
      setSpeakerNames(initialMap);
    }
  }, [transcriptionData]);

  const resetAll = () => {
    setFile(null);
    setTranscriptionData(null);
    setStatus('idle');
    setErrorMsg('');
    setProgress(0);
    setSpeakerNames({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSpeakerMapChange = (originalLabel, newName) => {
    setSpeakerNames(prev => ({
      ...prev,
      [originalLabel]: newName
    }));
  };

  // Logic to get the mapped data for display and export
  const getMappedData = () => {
    if (!transcriptionData) return [];
    return transcriptionData.map(seg => ({
      ...seg,
      displaySpeaker: speakerNames[seg.speaker] || seg.speaker
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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
    const fileExt = `.${selectedFile.name.split('.').pop().toLowerCase()}`;
    if (!supportedFormats.includes(fileExt)) {
      setErrorMsg(`Unsupported format. Please use: ${supportedFormats.join(', ')}`);
      setStatus('error');
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
    setErrorMsg('');
    setTranscriptionData(null);
    setProgress(0);
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
    formData.append('diarization', diarization);
    formData.append('timestamps', timestamps);

    try {
      const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 0,
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      });

      if (response.data.success) {
        setTranscriptionData(response.data.transcription);
        setStatus('success');
      }
    } catch (error) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('Network Error');
      const message = isTimeout
        ? "The AI is taking a bit longer to process this large file. Please don't refresh."
        : (error.response?.data?.error || error.message || 'Processing failed.');
      setErrorMsg(message);
      setStatus('error');
    }
  };

  const exportFile = async (format) => {
    const finalData = getMappedData().map(seg => ({
      ...seg,
      speaker: seg.displaySpeaker // Swap for the export logic
    }));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/export`,
        { transcription: finalData, format },
        { responseType: 'blob' }
      );

      const blobType = format === 'pdf' ? 'application/pdf' :
        format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
          'text/plain';

      const blob = new Blob([response.data], { type: blobType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audex-transcription.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setErrorMsg('Export failed.');
    }
  };

  const mappedSegments = getMappedData();

  return (
    <div className="min-h-screen bg-surface-900 text-slate-100 font-sans selection:bg-brand/30">
      <div className="container mx-auto px-4 py-12 max-w-7xl">

        <header className="text-center mb-16 animate-subtle-float">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-brand/20 rounded-2xl border border-brand/30">
              <Waves className="w-10 h-10 text-brand-light" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-brand-light to-purple-400 bg-clip-text text-transparent">
              AudEX
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Neural audio intelligence. Transcribe, analyze, and export with precision.
          </p>
        </header>

        {/* Updated Grid: Transcription Output increased by ~15% width */}
        <main className="grid lg:grid-cols-[1fr_1.5fr] gap-10 items-start">

          <div className="space-y-8">
            {/* Source Material Card */}
            <section className="glass-panel p-8 transition-all duration-500 hover:border-brand/40">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold tracking-tight">Source Material</h2>
                <span className="text-[10px] px-2 py-1 bg-brand/10 text-brand-light rounded-full uppercase font-bold tracking-widest">v2.1 AI-Enhanced</span>
              </div>

              {!file ? (
                <div
                  className={`group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive ? 'border-brand bg-brand/10 scale-[1.02]' : 'border-slate-700 hover:border-brand/50 hover:bg-white/5'
                    }`}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500 group-hover:text-brand-light transition-colors" />
                  <p className="text-slate-300 font-medium">Drop audio or video files here</p>
                  <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">"MP3, WAV, MP4, M4a, MKV, FLAC, OGG, WEBM, AVI, MOV supported"</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="h-[1px] w-8 bg-slate-700"></div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">OR</span>
                    <div className="h-[1px] w-8 bg-slate-700"></div>
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="mt-4 flex items-center gap-2 mx-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-brand-light rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-slate-700">
                    <FolderOpen size={14} /> Browse Files
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" accept={supportedFormats.join(',')} onChange={handleFileInput} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-2 bg-brand/20 rounded-lg"><FileAudio className="text-brand-light" size={24} /></div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-sm">{file.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-tighter">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={resetAll} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-full transition-colors"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <button onClick={() => setDiarization(!diarization)} className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${diarization ? 'bg-brand/20 border-brand text-brand-light' : 'bg-slate-800/40 border-slate-700 text-slate-500'}`}>
                      <Users size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Speaker ID</span>
                    </button>
                    <button onClick={() => setTimestamps(!timestamps)} className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${timestamps ? 'bg-brand/20 border-brand text-brand-light' : 'bg-slate-800/40 border-slate-700 text-slate-500'}`}>
                      <Clock size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Timestamps</span>
                    </button>
                  </div>
                  <button onClick={transcribeAudio} disabled={status === 'processing'} className={`w-full py-4 text-lg shadow-lg flex items-center justify-center gap-3 transition-all duration-500 rounded-xl font-bold uppercase tracking-widest ${status === 'success' ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20 backdrop-blur-md' : 'btn-brand shadow-brand/20'}`}>
                    {status === 'processing' ? <><Loader2 className="animate-spin" size={20} /> Analyzing... {progress}%</> : status === 'success' ? <><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Process Complete</> : 'Process Stream'}
                  </button>
                </div>
              )}
              {status === 'error' && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 items-center animate-pulse">
                  <AlertCircle className="text-red-400" size={18} />
                  <p className="text-red-200 text-xs font-medium">{errorMsg}</p>
                </div>
              )}
            </section>

            {/* NEW: Speaker Mapping Window (Appears after success) */}
            {status === 'success' && Object.keys(speakerNames).length > 0 && (
              <section className="glass-panel p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 mb-6">
                  <UserPlus className="text-brand-light" size={20} />
                  <h2 className="text-xl font-bold tracking-tight">Speaker Mapping</h2>
                </div>
                <div className="space-y-4">
                  {Object.keys(speakerNames).map((original) => (
                    <div key={original} className="flex items-center gap-4 bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[80px]">{original}</span>
                      <input 
                        type="text" 
                        value={speakerNames[original]} 
                        onChange={(e) => handleSpeakerMapChange(original, e.target.value)}
                        placeholder="Enter name..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand/50 transition-colors"
                      />
                    </div>
                  ))}
                  <p className="text-[9px] text-slate-500 uppercase tracking-tighter mt-4 italic">Update names above to sync the global transcript and export files.</p>
                </div>
              </section>
            )}
          </div>

          {/* Results Card - Now wider via grid settings */}
          <section className="glass-panel p-8 min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold tracking-tight">Transcription Output</h2>
              {(file || transcriptionData) && (
                <button onClick={resetAll} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-red-400 transition-colors">
                  <RotateCcw size={14} /> Clear All
                </button>
              )}
            </div>

            {transcriptionData ? (
              <div className="flex-1 flex flex-col space-y-6">
                <div className="flex-1 bg-slate-950/50 rounded-xl p-6 border border-slate-800 overflow-y-auto max-h-[600px]">
                  {mappedSegments.map((seg, i) => (
                    <div key={i} className="mb-4 last:mb-0 group">
                      <div className="flex items-center gap-3 mb-1">
                        {seg.speaker && <span className="text-[10px] font-bold text-brand-light bg-brand/10 px-2 py-0.5 rounded">{seg.displaySpeaker}</span>}
                        {seg.start && <span className="text-[10px] font-mono text-slate-500">[{seg.start}]</span>}
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm selection:bg-brand selection:text-white">
                        {seg.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Export Protocol</p>
                  <div className="grid grid-cols-3 gap-4">
                    {['txt', 'docx', 'pdf'].map((fmt) => (
                      <button key={fmt} onClick={() => exportFile(fmt)} className="flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-slate-700">
                        <Download size={12} /> {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                <div className="mb-4 relative">
                  <FileAudio size={80} className="opacity-10" />
                  {status === 'processing' && <Loader2 size={80} className="absolute inset-0 animate-spin opacity-40 text-brand" />}
                </div>
                <p className="text-sm font-medium tracking-wide">Waiting for input stream...</p>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-12 text-center">
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em]">AudEX Engine v2.1 • 2026 Neural Processing</p>
        </footer>
      </div>
    </div>
  );
}
