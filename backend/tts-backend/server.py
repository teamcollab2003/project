import os
import io
import uuid
import pyttsx3
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)

# --- 2. ADD THIS NEW TRANSLATION API ROUTE ---
@app.route('/api/translate', methods=['POST'])
def translate_text():
    data = request.json
    texts = data.get('texts', [])
    target_lang = data.get('target', 'eng')
    
    if not texts:
        return jsonify({"translations": []})
        
    lang_mapping = {
        'eng': 'en',
        'fra': 'fr',
        'mfe': 'mfe' 
    }
    
    google_target = lang_mapping.get(target_lang, 'en')
    
    try:
        print(f"🌐 Super-Fast Translating {len(texts)} elements to {google_target.upper()}...")
        
        translator = GoogleTranslator(source='auto', target=google_target)
        
        # --- THE SPEED FIX: DELIMITER TRICK ---
        # 1. Join the 27 items into ONE single string using a weird symbol Google won't translate
        delimiter = " ||| "
        combined_string = delimiter.join(texts)
        
        # 2. Make exactly ONE request to Google Translate
        translated_chunk = translator.translate(combined_string)
        
        # 3. Split the giant translated string back into a list of 27 items
        # We also use .strip() to clean up any extra spaces Google might have added
        translations = [t.strip() for t in translated_chunk.split(delimiter)]
        
        return jsonify({"translations": translations})
        
    except Exception as e:
        print("❌ Translation Server Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/tts', methods=['POST'])
def text_to_speech():
    data = request.json
    text_to_speak = data.get('text')
    language = data.get('language', 'eng') 
    
    if not text_to_speak:
        return jsonify({"error": "No text provided"}), 400

    unique_filename = f"temp_{uuid.uuid4().hex}.wav"
    unique_path = os.path.join(BASE_DIR, unique_filename)

    try:
        print(f"🔊 Processing Offline Voice Synthesizer: '{text_to_speak}' [{language.upper()}]")
        
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)
        
        voices = engine.getProperty('voices')
        selected_voice = None
        
        for voice in voices:
            voice_languages = [lang.lower() for lang in getattr(voice, 'languages', [])]
            
            if language in ['fra', 'mfe'] and ('fr' in voice.id.lower() or any('fr' in l for l in voice_languages)):
                selected_voice = voice.id
                break
            elif language == 'eng' and ('en' in voice.id.lower() or any('en' in l for l in voice_languages)):
                selected_voice = voice.id
                break
        
        if selected_voice:
            engine.setProperty('voice', selected_voice)

        engine.save_to_file(text_to_speak, unique_path)
        engine.runAndWait()

        def stream_and_remove_file():
            with open(unique_path, "rb") as f:
                while chunk := f.read(4096):
                    yield chunk
            
            try:
                os.remove(unique_path)
                print(f"🧹 Cleaned up temporary file: {unique_filename}")
            except Exception as e:
                print(f"⚠️ Could not delete temp file {unique_filename}: {e}")

        return Response(stream_and_remove_file(), mimetype="audio/wav")

    except Exception as e:
        print("❌ Offline Engine Error:", str(e))
        if os.path.exists(unique_path):
            try:
                os.remove(unique_path)
            except OSError:
                pass
        return jsonify({"error": "An internal server error occurred"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)