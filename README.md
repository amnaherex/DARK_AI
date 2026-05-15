# 🕵️ Deceptive Pattern Detector — AI Browser Extension

Detects **Fake Scarcity**, **Fake Urgency**, and **Fake Social Proof** on websites using Machine Learning.

---

## Project Structure

```
project/
├── person1_model/
│   └── train_model.py        ← Person 1: Train ML model
│
├── person2_flask/
│   ├── app.py                ← Person 2: Flask API
│   ├── requirements.txt
│   ├── model.pkl             ← Copy from Person 1 output
│   ├── vectorizer.pkl        ← Copy from Person 1 output
│   └── label_map.pkl         ← Copy from Person 1 output
│
├── person3_extension/
│   ├── manifest.json         ← Person 3: Chrome Extension
│   ├── content.js
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   └── icons/                ← Add icon images here
│
└── person4_testing/
    └── test_api.py           ← Person 4: Testing & Evaluation
```

---

## Setup Instructions (Run in Order)

### Step 1 — Person 1: Train the Model
```bash
cd person1_model
pip install pandas scikit-learn matplotlib seaborn
# Place dark_patterns.csv in this folder (from Kaggle)
python train_model.py
# Output: model.pkl, vectorizer.pkl, label_map.pkl
```

### Step 2 — Person 2: Run Flask API
```bash
cd person2_flask
# Copy model.pkl, vectorizer.pkl, label_map.pkl here from Step 1
pip install -r requirements.txt
python app.py
# API now running at http://localhost:5000
```

### Step 3 — Person 3: Load Chrome Extension
```
1. Open Chrome → go to chrome://extensions/
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the person3_extension/ folder
5. Extension icon appears in toolbar
```

### Step 4 — Person 4: Run Tests
```bash
cd person4_testing
# Make sure Flask is running first (Step 2)
pip install requests matplotlib numpy
python test_api.py
# Output: evaluation_report.png
```

---

## How to Use

1. Start Flask API: `python app.py`
2. Open Chrome with extension loaded
3. Visit any shopping website (Daraz.pk, Amazon, etc.)
4. Click the 🕵️ extension icon
5. Click **Scan This Page**
6. See highlighted patterns with color codes

### Highlight Colors
| Color | Pattern |
|-------|---------|
| 🔴 Red | Fake Scarcity |
| 🟠 Orange | Fake Urgency |
| 🟡 Yellow | Fake Social Proof |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/predict` | POST | Single text prediction |
| `/predict_batch` | POST | Multiple texts |
| `/analyze_page` | POST | Full page text analysis |

### Example API Call
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Only 2 left in stock!"}'
```

### Example Response
```json
{
  "text": "Only 2 left in stock!",
  "result": {
    "category": "scarcity",
    "label": "Fake Scarcity",
    "confidence": 91.3,
    "color": "#EF4444",
    "emoji": "🔴",
    "description": "Creates false impression of limited availability"
  }
}
```

---

## Dataset
- **Source:** Kaggle — "Dark Patterns in Online Shopping"
- **Categories used:** scarcity, urgency, social_proof, not_deceptive
- **Algorithm:** TF-IDF + Logistic Regression

---

## Team
| Person | Role |
|--------|------|
| Person 1 | Data & ML Model |
| Person 2 | Flask API |
| Person 3 | Chrome Extension |
| Person 4 | Testing & Report |
