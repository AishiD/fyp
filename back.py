from flask import Flask, request, jsonify
from transformers import pipeline
import cors

app = Flask(__name__)
cors = CORS(app)

# Initialize the translation pipeline
translation_pipeline = pipeline("translation", model="arunapriyad24/MT")

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    source_text = data.get('text', '')
    
    # Perform translation
    result = translation_pipeline(source_text)
    translated_text = result[0]['generated_text']
    
    return jsonify({
        'translation': translated_text
    })

if __name__ == '__main__':
    app.run(debug=True)