# AudEX
Audio to Text Transcription Application

A production-ready audio-to-text transcription application with a modern web interface. This application uses Python with Flask for the backend and a clean HTML/CSS/JS frontend.

Tech Stack

### Frontend:

React with Tailwind CSS for modern, responsive UI
Lucide React for icons
Drag-and-drop file upload support

### Backend:

Flask - Python web framework
OpenAI Whisper - State-of-the-art speech recognition
MoviePy - Video processing and audio extraction
python-docx - DOCX file generation
FPDF - PDF file generation
Gunicorn - Production WSGI server

### Infrastructure:

Docker & Docker Compose for containerization
FFmpeg for audio/video processing

Audio-to-Text Conversion Process
Step-by-Step Process:

File Upload & Validation

User drags/drops or browses for audio/video file
Frontend validates file type against supported formats
File sent to backend via multipart/form-data POST request


### Backend Processing

Flask receives file and generates unique UUID
Saves file securely to uploads directory
Validates file extension


### Audio Extraction (for video files)

If video file detected, MoviePy extracts audio track
Converts to WAV format for optimal processing
Temporary audio file created


### Whisper Transcription

Whisper model loads audio file
Uses deep learning neural network trained on 680,000 hours of multilingual data
Processes audio in segments for accuracy
Returns:

Full transcription text
Individual segments with timestamps
Detected language
Confidence scores


### Post-Processing

Cleans up temporary files
Returns JSON response with transcription
Frontend displays results in real-time


### Export Generation

User selects export format (TXT/DOCX/PDF)
Backend generates formatted document
File sent as downloadable attachment

### Dependencies

* Python 3.12

Built with prompts utilizing Claude AI - Python and Tkinter GUI library.

Authors

    David Spies
