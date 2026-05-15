import pickle

with open('model.pkl', 'rb') as f: model = pickle.load(f)
with open('vectorizer.pkl', 'rb') as f: vec = pickle.load(f)
with open('label_map.pkl', 'rb') as f: labels = pickle.load(f)

tests = [
    '9 sold',
    'Almost sold out buy now',
    'Ends in 06 51 09',
    'Only 3 left',
    'Chat now',
    'Free shipping',
]
for t in tests:
    v = vec.transform([t.lower()])
    pred = model.predict(v)[0]
    prob = model.predict_proba(v)[0]
    print(f'{t:35} -> {labels[pred]:15} ({max(prob)*100:.1f}%)')