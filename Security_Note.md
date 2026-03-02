## 🔐 Security Notes

This application requires a Hugging Face token for the Diarization pipeline. Ensure your token is stored in an environment variable HF_TOKEN rather than hardcoded in app.py.

Hugging Face Access (Required for Diarization)
To use the Speaker ID feature, you must accept the user conditions on Hugging Face for the following models:
1. [pyannote/speaker-diarization-3.1](https://huggingface.co/pyannote/speaker-diarization-3.1)
2. [pyannote/segmentation-3.0](https://huggingface.co/pyannote/segmentation-3.0)

Create a **User Access Token** (Read) at [hf.co/settings/tokens](https://hf.co/settings/tokens).

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
