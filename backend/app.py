# app.py - AudEX Intelligence Engine (Faster-Whisper & CPU Stability Version)
import os
import warnings

# --- PRE-IMPORT STABILITY HEADERS ---
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

# Fix for the SyntaxWarning
warnings.filterwarnings("ignore", message=r"std\(\): degrees of freedom is <= 0")

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv # Added for .env support
from werkzeug.utils import secure_filename
from faster_whisper import WhisperModel 
import torch
import numpy as np
import logging
import uuid
import subprocess
from pathlib import Path
from pyannote.audio import Pipeline
from docx import Document
from fpdf import FPDF

# Load environment variables
load_dotenv() 

# Force CPU thread limits to prevent hardware "thrashing"
torch.set_num_threads(6)
os.environ["OMP_NUM_THREADS"] = "6"
os.environ["MKL_NUM_THREADS"] = "6"

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 1. LOAD FASTER-WHISPER
logger.info("Initializing Faster-Whisper Engine (int8)...")
model = WhisperModel("base", device="cpu", compute_type="int8")

# 2. LOAD DIARIZATION PIPELINE
# Retrieving token from .env instead of hardcoded string
HF_TOKEN = os.getenv("HF_TOKEN") 

try:
    diarization_pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1", 
        token=HF_TOKEN
    )
    if diarization_pipeline:
        diarization_pipeline.to(torch.device("cpu"))
except Exception as e:
    logger.error(f"Diarization model failed to load: {e}")
    diarization_pipeline = None

def format_timestamp(seconds: float):
    td = int(seconds)
    return f"{td // 3600:02d}:{(td % 3600) // 60:02d}:{td % 60:02d}"

def normalize_audio(input_path):
    output_path = os.path.join(UPLOAD_FOLDER, f"norm_{uuid.uuid4()}.wav")
    try:
        command = [
            'ffmpeg', '-y', '-i', input_path,
            '-ac', '1', '-ar', '16000', '-vn',
            output_path
        ]
        subprocess.run(command, capture_output=True, text=True, check=True)
        return output_path if os.path.exists(output_path) else None
    except Exception as e:
        logger.error(f"FFmpeg error: {e}")
        return None

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    use_diarization = request.form.get('diarization') == 'true'
    use_timestamps = request.form.get('timestamps') == 'true'

    temp_orig = None
    temp_norm = None

    try:
        file_id = str(uuid.uuid4())
        orig_ext = Path(file.filename).suffix
        temp_orig = os.path.join(UPLOAD_FOLDER, f"{file_id}{orig_ext}")
        file.save(temp_orig)

        temp_norm = normalize_audio(temp_orig)
        if not temp_norm:
            return jsonify({'error': 'Audio normalization failed.'}), 500

        # --- TRANSCRIPTION PHASE ---
        logger.info(f"Processing transcription for: {file.filename}")
        
        segments, info = model.transcribe(temp_norm, language='en', beam_size=5)
        
        whisper_segments = []
        for s in segments:
            whisper_segments.append({
                "start": s.start,
                "end": s.end,
                "text": s.text.strip()
            })

        # --- DIARIZATION PHASE ---
        speaker_segments = []
        if use_diarization and diarization_pipeline:
            try:
                logger.info("Running Speaker Identification...")
                dz = diarization_pipeline(temp_norm)
                annotation = dz if hasattr(dz, 'itertracks') else getattr(dz, 'speaker_diarization', None)
                
                if annotation:
                    for turn, _, speaker in annotation.itertracks(yield_label=True):
                        speaker_segments.append({
                            "start": turn.start, 
                            "end": turn.end, 
                            "speaker": speaker
                        })
                    logger.info(f"Successfully extracted {len(speaker_segments)} speaker segments.")
            except Exception as dz_err:
                logger.error(f"Diarization logic failed: {dz_err}")
                use_diarization = False

        # --- ALIGNMENT PHASE ---
        final_transcription = []
        speaker_map = {} 
        speaker_counter = 1

        for seg in whisper_segments:
            current_label = "Speaker 1" 
            
            if use_diarization and speaker_segments:
                mid_time = (seg['start'] + seg['end']) / 2
                best_speaker = None
                
                for s_seg in speaker_segments:
                    if s_seg['start'] <= mid_time <= s_seg['end']:
                        best_speaker = s_seg['speaker']
                        break
                
                if best_speaker:
                    if best_speaker not in speaker_map:
                        speaker_map[best_speaker] = f"Speaker {speaker_counter}"
                        speaker_counter += 1
                    current_label = speaker_map[best_speaker]

            final_transcription.append({
                "speaker": current_label,
                "start": format_timestamp(seg['start']) if use_timestamps else None,
                "text": seg['text']
            })

        if not final_transcription:
            logger.warning("Transcription resulted in empty list.")

        return jsonify({'success': True, 'transcription': final_transcription}), 200
            
    except Exception as e:
        logger.error(f"Critical System Error: {str(e)}")
        return jsonify({'error': f"Hardware/Logic Error: {str(e)}"}), 500
    finally:
        for p in [temp_orig, temp_norm]:
            if p and os.path.exists(p):
                try: os.remove(p)
                except: pass

@app.route('/api/export', methods=['POST'])
def export():
    data = request.get_json()
    raw_segments = data['transcription']
    format_type = data['format'].lower()
    
    formatted_text = ""
    for item in raw_segments:
        ts = f"[{item['start']}] " if item.get('start') else ""
        spk = f"{item['speaker']}: " if item.get('speaker') else ""
        formatted_text += f"{ts}{spk}{item['text']}\n\n"

    file_id = str(uuid.uuid4())
    output_path = os.path.join(OUTPUT_FOLDER, f"audex_{file_id}.{format_type}")
    
    if format_type == 'txt':
        with open(output_path, 'w') as f: f.write(formatted_text)
    elif format_type == 'docx':
        doc = Document()
        doc.add_paragraph(formatted_text)
        doc.save(output_path)
    elif format_type == 'pdf':
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, txt=formatted_text.encode('latin-1', 'replace').decode('latin-1'))
        pdf.output(output_path)
        
    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000, threaded=False)
