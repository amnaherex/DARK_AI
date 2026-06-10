# Deceptive Pattern Detector — AI Browser Extension

Detects **Fake Scarcity**, **Fake Urgency**, and **Fake Social Proof** on websites using Machine Learning.



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


