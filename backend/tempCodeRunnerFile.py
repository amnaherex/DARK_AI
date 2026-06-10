import pandas as pd
import numpy as np
import re
import pickle
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, classification_report,
                             confusion_matrix, ConfusionMatrixDisplay)
from sklearn.utils import resample

print("Loading dataset...")
try:
    df = pd.read_csv("dark_patterns.csv", usecols=['text', 'Pattern Category'])
    df = df.rename(columns={'Pattern Category': 'label'})
    print(f"Loaded {len(df)} rows")
    print("Columns:", df.columns.tolist())
    print(df['label'].value_counts())
except FileNotFoundError:
    print("Dataset file not found. Creating a small sample dataset for testing...")
   
    sample_data = {
        "text": [
            "Only 2 left in stock!",
            "Hurry! Limited stock available",
            "Just 1 item remaining",
            "Last few pieces left",
            "Almost sold out!",
            "Sale ends in 10 minutes!",
            "Deal expires today only!",
            "Order in the next 5 mins to get discount",
            "Offer valid for next 2 hours only",
            "Flash sale ending soon!",
            "500 people are viewing this right now",
            "200 sold in the last 24 hours",
            "10,000 happy customers",
            "Trending - Most popular item",
            "1000 people bought this today",
            "This is a great product",
            "Free shipping on all orders",
            "New collection available now",
            "Check out our latest products",
            "Shop our wide range of items",
        ],
        "label": [
            "scarcity", "scarcity", "scarcity", "scarcity", "scarcity",
            "urgency", "urgency", "urgency", "urgency", "urgency",
            "social_proof", "social_proof", "social_proof", "social_proof", "social_proof",
            "not_deceptive", "not_deceptive", "not_deceptive", "not_deceptive", "not_deceptive",
        ]
    }
    df = pd.DataFrame(sample_data)
    df.to_csv("dark_patterns.csv", index=False)
    print("Sample dataset created.")


print("\nFiltering categories...")

df['label'] = df['label'].str.lower().str.strip()


label_map = {
    'scarcity': 'scarcity',
    'fake scarcity': 'scarcity',
    'limited': 'scarcity',
    'urgency': 'urgency',
    'fake urgency': 'urgency',
    'countdown': 'urgency',
    'social_proof': 'social_proof',
    'social proof': 'social_proof',
    'testimonial': 'social_proof',
    'not_deceptive': 'not_deceptive',
    'none': 'not_deceptive',
    'normal': 'not_deceptive',
    'benign': 'not_deceptive',
    'not dark pattern': 'not_deceptive',
    'Not Dark Pattern': 'not_deceptive',
}
df['label'] = df['label'].map(label_map)
df = df.dropna(subset=['label'])


keep_labels = ['scarcity', 'urgency', 'social_proof', 'not_deceptive']
df = df[df['label'].isin(keep_labels)]
print(f"After filtering: {len(df)} rows")
print(df['label'].value_counts())

def preprocess_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+', '', text)       
    text = re.sub(r'[^a-z0-9\s!?%$]', '', text)      
    text = re.sub(r'\s+', ' ', text).strip()           
    return text

print("\nPreprocessing text...")
df['clean_text'] = df['text'].apply(preprocess_text)
df = df[df['clean_text'].str.len() > 3]  

min_count = df['label'].value_counts().min()
max_count = df['label'].value_counts().max()

if max_count > min_count * 2:
    print("\nBalancing dataset...")
    balanced_dfs = []
    target_count = min(max_count, min_count * 2)
    for label in keep_labels:
        subset = df[df['label'] == label]
        if len(subset) > target_count:
            subset = resample(subset, replace=False, n_samples=target_count, random_state=42)
        balanced_dfs.append(subset)
    df = pd.concat(balanced_dfs).sample(frac=1, random_state=42).reset_index(drop=True)
    print(f"Balanced dataset: {len(df)} rows")
    print(df['label'].value_counts())

label_to_int = {
    'not_deceptive': 0,
    'scarcity': 1,
    'urgency': 2,
    'social_proof': 3
}
int_to_label = {v: k for k, v in label_to_int.items()}
df['label_int'] = df['label'].map(label_to_int)


X = df['clean_text']
y = df['label_int']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\nTrain size: {len(X_train)} | Test size: {len(X_test)}")


print("\nApplying TF-IDF vectorization...")
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),  
    min_df=1,
    sublinear_tf=True
)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


print("\nTraining Logistic Regression model...")
model = LogisticRegression(
    max_iter=1000,
    C=1.0,
    solver='lbfgs',
    random_state=42
)
model.fit(X_train_tfidf, y_train)
print("Training complete!")


y_pred = model.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n{'='*50}")
print(f"MODEL ACCURACY: {accuracy * 100:.2f}%")
print(f"{'='*50}")
print("\nClassification Report:")
target_names = ['not_deceptive', 'scarcity', 'urgency', 'social_proof']

print("\nGenerating confusion matrix...")
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=target_names)
disp.plot(cmap='Blues', ax=plt.gca())
plt.title('Confusion Matrix — Deceptive Pattern Detector', fontsize=14, pad=15)
plt.xticks(rotation=15)
plt.tight_layout()
plt.savefig('confusion_matrix.png', dpi=150)
plt.close()
print("Saved: confusion_matrix.png")


plt.figure(figsize=(8, 5))
colors = ['#4CAF50', '#F44336', '#FF9800', '#2196F3']
df['label'].value_counts()[keep_labels].plot(
    kind='bar', color=colors, edgecolor='white', linewidth=0.5
)
plt.title('Dataset Label Distribution', fontsize=14)
plt.xlabel('Category')
plt.ylabel('Count')
plt.xticks(rotation=15)
plt.tight_layout()
plt.savefig('label_distribution.png', dpi=150)
plt.close()
print("Saved: label_distribution.png")


print("\nSaving model and vectorizer...")
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)
with open('label_map.pkl', 'wb') as f:
    pickle.dump(int_to_label, f)

print("Saved: model.pkl, vectorizer.pkl, label_map.pkl")
print("\nDone! Share these 3 .pkl files with Person 2 (Flask developer).")


print("\n--- Quick Prediction Test ---")
test_sentences = [
    "Only 3 left in stock!",
    "Sale ends in 5 minutes!",
    "1000 people bought this today",
    "Free shipping on all orders",
]
for sentence in test_sentences:
    clean = preprocess_text(sentence)
    vec = vectorizer.transform([clean])
    pred = model.predict(vec)[0]
    proba = model.predict_proba(vec)[0]
    confidence = proba[pred] * 100
    label = int_to_label[pred]
    print(f"  '{sentence}' → {label} ({confidence:.1f}%)")
