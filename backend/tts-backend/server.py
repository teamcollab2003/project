import os
import io
import uuid
import pyttsx3
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)

# We will save the unique files in the same directory as this script
BASE_DIR = os.path.dirname(__file__)

# --- 2. ADD THIS NEW TRANSLATION API ROUTE ---
@app.route('/api/translate', methods=['POST'])
def translate_text():
    data = request.json
    texts = data.get('texts', [])
    target_lang = data.get('target', 'eng')
    
    if not texts:
        return jsonify({"translations": []})
        
    # Map Angular language codes to Google Translate's official ISO codes
    lang_mapping = {
        'eng': 'en',
        'fra': 'fr',
        'mfe': 'mfe' # Mauritian Creole is officially 'mfe'
    }
    
    google_target = lang_mapping.get(target_lang, 'en')
    
    try:
        print(f"🌐 Batch Translating {len(texts)} elements to {google_target.upper()}...")
        
        # Initialize the translator
        translator = GoogleTranslator(source='auto', target=google_target)
        
        # Translate the entire array of strings in one single batch!
        translations = translator.translate_batch(texts)
        
        return jsonify({"translations": translations})
    except Exception as e:
        print("❌ Translation Server Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/tts', methods=['POST'])
def text_to_speech():
    data = request.json
    text_to_speak = data.get('text')
    language = data.get('language', 'eng') # Default to English
    
    if not text_to_speak:
        return jsonify({"error": "No text provided"}), 400

    # 1. Generate a completely unique filename for this specific hover request
    unique_filename = f"temp_{uuid.uuid4().hex}.wav"
    unique_path = os.path.join(BASE_DIR, unique_filename)

    try:
        print(f"🔊 Processing Offline Voice Synthesizer: '{text_to_speak}' [{language.upper()}]")
        
        # 2. Initialize the offline system engine
        engine = pyttsx3.init()
        
        # Adjust speaking rate to a natural speed (150 words per minute)
        engine.setProperty('rate', 150)
        
        # 3. Look for a matching local voice (English or French)
        # 3. Look for a matching local voice (English or French)
        voices = engine.getProperty('voices')
        selected_voice = None
        
        for voice in voices:
            voice_languages = [lang.lower() for lang in getattr(voice, 'languages', [])]
            
            # Change 'if language == 'fra'' to 'if language in ['fra', 'mfe']'
            if language in ['fra', 'mfe'] and ('fr' in voice.id.lower() or any('fr' in l for l in voice_languages)):
                selected_voice = voice.id
                break
            elif language == 'eng' and ('en' in voice.id.lower() or any('en' in l for l in voice_languages)):
                selected_voice = voice.id
                break
        
        if selected_voice:
            engine.setProperty('voice', selected_voice)

        # 4. Generate the unique audio file locally
        engine.save_to_file(text_to_speak, unique_path)
        engine.runAndWait()

        # 5. Create a generator to stream the audio and immediately delete the file once sent
        def stream_and_remove_file():
            # Open and yield the file contents
            with open(unique_path, "rb") as f:
                while chunk := f.read(4096):
                    yield chunk
            
            # The file is fully closed now, so Windows will let us delete it safely!
            try:
                os.remove(unique_path)
                print(f"🧹 Cleaned up temporary file: {unique_filename}")
            except Exception as e:
                print(f"⚠️ Could not delete temp file {unique_filename}: {e}")

        # Stream the audio response back to Angular
        return Response(stream_and_remove_file(), mimetype="audio/wav")

    except Exception as e:
        print("❌ Offline Engine Error:", str(e))
        # Ensure we try to clean up if the script crashed mid-process
        if os.path.exists(unique_path):
            try:
                os.remove(unique_path)
            except OSError:
                pass
        return jsonify({"error": "An internal server error occurred"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)