from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import os

app = Flask(__name__)
CORS(app)  

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

# Baseline defensive whitelists for standard legal text structures
WHITELISTED_PHRASES = [
    "privacy policy", "terms and conditions", "terms of service", "terms of use",
    "all rights reserved", "limited warranty", "return policy", "refund policy",
    "cookie preferences", "cookie policy", "contact us", "about us"
]

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

# HYBRID PREDICTION ENGINE WITH BALANCED PRODUCTION TOLERANCE
def predict_text(text):
    """Run pipeline check using heuristics + tightened machine learning tolerance fallback."""
    if not model or not vectorizer:
        return {
            'category': 'error', 'label': 'Model not loaded', 'confidence': 0,
            'color': '#gray', 'emoji': 'X', 'description': 'Model files missing'
        }
    
    clean = preprocess_text(text)
    if not clean:
        return None

    text_lower = text.lower()
    
    # Initialize developer metrics dictionary for transparency auditing
    developer_metrics = {
        "pipeline_layer": "unknown",
        "raw_preprocessed_input": clean,
        "top_contributing_features": []
    }
    
    # LAYER 0: Whitelist Intercept (Immediate protection)
    if any(phrase in text_lower for phrase in WHITELISTED_PHRASES):
        developer_metrics["pipeline_layer"] = "layer_0_whitelist_intercept"
        developer_metrics["top_contributing_features"] = [p for p in WHITELISTED_PHRASES if p in text_lower]
        
        info = CATEGORY_INFO['not_deceptive']
        return {
            'category': 'not_deceptive', 'label': info['label'], 'confidence': 100.0,
            'color': info['color'], 'emoji': info['emoji'], 'description': 'Administrative boilerplate / Whitelisted safe text',
            'developer_metrics': developer_metrics
        }

 
    # LAYER 1: Heuristic Keyword Intercept (Guarantees live popup catches)
   
    heuristic_triggered = False
    category = 'not_deceptive'
    confidence = 95.0
    
    social_words = ['purchased', 'just ordered', 'bought', 'people added', 'viewing this']
    scarcity_words = ['left in stock', 'limited stock', 'items left', 'only a few left', 'only 3 left', 'only 2 left']
    urgency_words = ['ends soon', 'offer ends', 'countdown', 'limited time only', 'ends in']

    if any(word in text_lower for word in social_words):
        category = 'social_proof'
        heuristic_triggered = True
        developer_metrics["pipeline_layer"] = "layer_1_heuristic_social_proof"
        developer_metrics["top_contributing_features"] = [w for w in social_words if w in text_lower]
    elif any(word in text_lower for word in scarcity_words):
        category = 'scarcity'
        heuristic_triggered = True
        developer_metrics["pipeline_layer"] = "layer_1_heuristic_scarcity"
        developer_metrics["top_contributing_features"] = [w for w in scarcity_words if w in text_lower]
    elif any(word in text_lower for word in urgency_words):
        category = 'urgency'
        heuristic_triggered = True
        developer_metrics["pipeline_layer"] = "layer_1_heuristic_urgency"
        developer_metrics["top_contributing_features"] = [w for w in urgency_words if w in text_lower]

    # LAYER 2: ML Fallback Pipeline (Runs if no keywords trigger)
  
    if not heuristic_triggered:
        developer_metrics["pipeline_layer"] = "layer_2_ml_fallback"
        
        vec = vectorizer.transform([clean])
        pred_int = model.predict(vec)[0]
        proba = model.predict_proba(vec)[0]
        confidence = float(proba[pred_int]) * 100
        category = int_to_label[pred_int]

        # Extract structural words that the vocabulary recognized
        words_in_input = clean.split()
        if hasattr(vectorizer, 'get_feature_names_out'):
            vocab = set(vectorizer.get_feature_names_out())
            matched_features = [w for w in words_in_input if w in vocab]
            developer_metrics["top_contributing_features"] = matched_features[:4]

        if category != 'not_deceptive' and confidence < 45:
            category = 'not_deceptive'

    info = CATEGORY_INFO.get(category, CATEGORY_INFO['not_deceptive'])
    
    return {
        'category': category,
        'label': info['label'],
        'confidence': round(confidence, 1),
        'color': info['color'],
        'emoji': info['emoji'],
        'description': info['description'],
        'developer_metrics': developer_metrics
    }

# ROUTES

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'running',
        'endpoints': {
            '/predict': 'POST', '/predict_batch': 'POST', '/analyze_page': 'POST', '/health': 'GET'
        }
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" field'}), 400
    
    text = data['text'].strip()
    result = predict_text(text)
    if not result:
        return jsonify({'error': 'Could not process text'}), 400
    
    return jsonify({'text': text, 'result': result})

@app.route('/predict_batch', methods=['POST'])
def predict_batch():
    data = request.get_json()
    if not data or 'texts' not in data:
        return jsonify({'error': 'Missing "texts" field'}), 400
    
    results = []
    for text in data['texts']:
        text = str(text).strip()
        if len(text) > 3:
            result = predict_text(text)
            if result:
                results.append({'text': text, 'result': result})
                
    deceptive = [r for r in results if r['result']['category'] != 'not_deceptive']
    return jsonify({
        'total_analyzed': len(results),
        'deceptive_found': len(deceptive),
        'results': results,
        'deceptive_only': deceptive
    })

@app.route('/analyze_page', methods=['POST'])
def analyze_page():
    data = request.get_json()
    if not data or 'page_text' not in data:
        return jsonify({'error': 'Missing "page_text" field'}), 400
    
    sentences = split_into_sentences(data['page_text'])
    if not sentences:
        return jsonify({'error': 'No sentences found'}), 400
    
    results = []
    for sentence in sentences:
        result = predict_text(sentence)
        if result:
            results.append({'text': sentence, 'result': result})
            
    deceptive = [r for r in results if r['result']['category'] != 'not_deceptive']
    
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

if __name__ == '__main__':
    print("\n" + "="*50)
    print("Deceptive Pattern Detector API (With 45% Tolerance Guardrail)")
    print("Running on: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)