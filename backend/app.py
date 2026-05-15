from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import os

app = Flask(__name__)
CORS(app)  # Allow Chrome extension to call this API

# ─────────────────────────────────────────────
# LOAD MODEL FILES (from Person 1)
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("Loading model files...")
try:
    with open(os.path.join(BASE_DIR, 'model.pkl'), 'rb') as f:
        model = pickle.load(f)
    with open(os.path.join(BASE_DIR, 'vectorizer.pkl'), 'rb') as f:
        vectorizer = pickle.load(f)
    with open(os.path.join(BASE_DIR, 'label_map.pkl'), 'rb') as f:
        int_to_label = pickle.load(f)
    print("Model loaded successfully!")
except FileNotFoundError as e:
    print(f"ERROR: Model file not found — {e}")
    print("Make sure model.pkl, vectorizer.pkl, label_map.pkl are in the same folder.")
    model = None
    vectorizer = None
    int_to_label = {0: 'not_deceptive', 1: 'scarcity', 2: 'urgency', 3: 'social_proof'}

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
CATEGORY_INFO = {
    'scarcity': {
        'label': 'Fake Scarcity',
        'color': '#EF4444',
        'emoji': '🔴',
        'description': 'Creates false impression of limited availability'
    },
    'urgency': {
        'label': 'Fake Urgency',
        'color': '#F97316',
        'emoji': '🟠',
        'description': 'Creates artificial time pressure to rush decisions'
    },
    'social_proof': {
        'label': 'Fake Social Proof',
        'color': '#EAB308',
        'emoji': '🟡',
        'description': 'Uses misleading popularity claims to influence behavior'
    },
    'not_deceptive': {
        'label': 'Not Deceptive',
        'color': '#22C55E',
        'emoji': '✅',
        'description': 'No deceptive pattern detected'
    }
}

def preprocess_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'[^a-z0-9\s!?%$]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def split_into_sentences(text):
    """Split paragraph text into individual sentences for analysis."""
    sentences = re.split(r'(?<=[.!?])\s+|(?<=\n)', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
    return sentences

def predict_text(text):
    """Run prediction on a single piece of text."""
    if not model or not vectorizer:
        return {
            'category': 'error',
            'label': 'Model not loaded',
            'confidence': 0,
            'color': '#gray',
            'emoji': '❌',
            'description': 'Model files missing'
        }
    
    clean = preprocess_text(text)
    if not clean:
        return None
    
    vec = vectorizer.transform([clean])
    pred_int = model.predict(vec)[0]
    proba = model.predict_proba(vec)[0]
    confidence = float(proba[pred_int]) * 100
    category = int_to_label[pred_int]

    # Confidence threshold — ignore weak predictions to reduce false positives
    if category != 'not_deceptive' and confidence < 40:
        category = 'not_deceptive'
        pred_int = 0

    info = CATEGORY_INFO.get(category, CATEGORY_INFO['not_deceptive'])
    
    return {
        'category': category,
        'label': info['label'],
        'confidence': round(confidence, 1),
        'color': info['color'],
        'emoji': info['emoji'],
        'description': info['description']
    }

# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'running',
        'message': 'Deceptive Pattern Detector API',
        'endpoints': {
            '/predict': 'POST - Predict single text',
            '/predict_batch': 'POST - Predict multiple sentences',
            '/analyze_page': 'POST - Analyze full page text',
            '/health': 'GET - Health check'
        }
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict a single text string.
    Request body: { "text": "Only 2 left in stock!" }
    """
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" field in request body'}), 400
    
    text = data['text'].strip()
    if not text:
        return jsonify({'error': 'Text cannot be empty'}), 400
    
    result = predict_text(text)
    if not result:
        return jsonify({'error': 'Could not process text'}), 400
    
    return jsonify({
        'text': text,
        'result': result
    })


@app.route('/predict_batch', methods=['POST'])
def predict_batch():
    """
    Predict multiple texts at once.
    Request body: { "texts": ["Only 2 left!", "Free shipping", "Order now!"] }
    """
    data = request.get_json()
    
    if not data or 'texts' not in data:
        return jsonify({'error': 'Missing "texts" field in request body'}), 400
    
    texts = data['texts']
    if not isinstance(texts, list):
        return jsonify({'error': '"texts" must be a list'}), 400
    
    results = []
    for text in texts:
        text = str(text).strip()
        if len(text) > 3:
            result = predict_text(text)
            if result:
                results.append({
                    'text': text,
                    'result': result
                })
    
    # Filter only deceptive ones for summary
    deceptive = [r for r in results if r['result']['category'] != 'not_deceptive']
    
    return jsonify({
        'total_analyzed': len(results),
        'deceptive_found': len(deceptive),
        'results': results,
        'deceptive_only': deceptive
    })


@app.route('/analyze_page', methods=['POST'])
def analyze_page():
    """
    Analyze full page text — splits into sentences automatically.
    Request body: { "page_text": "Full page text here..." }
    """
    data = request.get_json()
    
    if not data or 'page_text' not in data:
        return jsonify({'error': 'Missing "page_text" field'}), 400
    
    page_text = data['page_text']
    sentences = split_into_sentences(page_text)
    
    if not sentences:
        return jsonify({'error': 'No sentences found in page text'}), 400
    
    results = []
    for sentence in sentences:
        result = predict_text(sentence)
        if result:
            results.append({
                'text': sentence,
                'result': result
            })
    
    deceptive = [r for r in results if r['result']['category'] != 'not_deceptive']
    
    # Category summary
    summary = {'scarcity': 0, 'urgency': 0, 'social_proof': 0}
    for r in deceptive:
        cat = r['result']['category']
        if cat in summary:
            summary[cat] += 1
    
    return jsonify({
        'total_sentences': len(results),
        'deceptive_found': len(deceptive),
        'summary': summary,
        'deceptive_patterns': deceptive,
        'all_results': results
    })


# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────
if __name__ == '__main__':
    print("\n" + "="*50)
    print("Deceptive Pattern Detector API")
    print("Running on: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
