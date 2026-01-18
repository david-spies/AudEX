# Installation & Setup
Option 1: Local Development

bash# 1. Install system dependencies

# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install ffmpeg python3-pip python3-venv

# macOS:
brew install ffmpeg python

# 2. Clone and setup
git clone <your-repo>
cd audex

# 3. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Run the application
python app.py

# Or with Gunicorn (production):
chmod +x run.sh
./run.sh
