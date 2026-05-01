import json
import re
import sys
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix, hstack
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score

urgent_terms = set("urgent immediately asap now today action required required verify suspended limited alert attention".split())
credential_terms = set("password login log in verify verification account confirm update authenticate security credential username sign in".split())
financial_terms = set("bank payment invoice billing card credit debit transfer wire transaction wallet".split())
threat_terms = set("suspend suspended locked disable disabled expire expired penalty cancel cancelled restricted".split())
link_terms = set("http https www click link url domain".split())
attachment_terms = set("attachment attached invoice pdf document file zip html htm".split())
numeric_names = ["text_length", "url_count", "email_count", "exclamation_count", "question_count", "upper_ratio", "digit_ratio", "urgent_term_count", "credential_term_count", "financial_term_count", "threat_term_count", "link_term_count", "attachment_term_count", "html_signal", "reply_to_signal"]

def handcrafted(text):
    value = text or ""
    low = value.lower()
    url_count = len(re.findall(r"https?://|www\.", low))
    email_count = len(re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", low))
    exclam = value.count("!")
    qmarks = value.count("?")
    uppercase = sum(1 for ch in value if ch.isupper())
    letters = sum(1 for ch in value if ch.isalpha())
    digits = sum(1 for ch in value if ch.isdigit())
    upper_ratio = uppercase / max(letters, 1)
    digit_ratio = digits / max(len(value), 1)
    tokens = re.findall(r"[a-z0-9']+", low)
    return [
        len(value),
        url_count,
        email_count,
        exclam,
        qmarks,
        upper_ratio,
        digit_ratio,
        sum(tok in urgent_terms for tok in tokens),
        sum(tok in credential_terms for tok in tokens),
        sum(tok in financial_terms for tok in tokens),
        sum(tok in threat_terms for tok in tokens),
        sum(tok in link_terms for tok in tokens),
        sum(tok in attachment_terms for tok in tokens),
        int(bool(re.search(r"html|href=|<a\b", low))),
        int("reply-to" in low)
    ]

def main():
    if len(sys.argv) < 3:
        raise SystemExit("Usage: python train_model.py <train_csv> <test_csv>")
    train_path = Path(sys.argv[1])
    test_path = Path(sys.argv[2])
    train_df = pd.read_csv(train_path, usecols=["tipo", "mensaje"]).dropna()
    test_df = pd.read_csv(test_path, usecols=["tipo", "mensaje"]).dropna()
    for frame in (train_df, test_df):
        frame["label"] = (frame["tipo"].str.lower() == "phishing").astype(int)
    Xh_train = np.array([handcrafted(text) for text in train_df["mensaje"].astype(str)], dtype=float)
    Xh_test = np.array([handcrafted(text) for text in test_df["mensaje"].astype(str)], dtype=float)
    y_train = train_df["label"].to_numpy()
    y_test = test_df["label"].to_numpy()
    vectorizer = CountVectorizer(lowercase=True, binary=True, max_features=250, ngram_range=(1, 2), token_pattern=r"(?u)\b[\w:/\.-]{2,}\b")
    Xtext_train = vectorizer.fit_transform(train_df["mensaje"].astype(str))
    Xtext_test = vectorizer.transform(test_df["mensaje"].astype(str))
    means = Xh_train.mean(axis=0)
    stds = Xh_train.std(axis=0)
    stds = np.where(stds == 0, 1, stds)
    X_train = hstack([Xtext_train, csr_matrix((Xh_train - means) / stds)])
    X_test = hstack([Xtext_test, csr_matrix((Xh_test - means) / stds)])
    clf = LogisticRegression(max_iter=1000, class_weight="balanced")
    clf.fit(X_train, y_train)
    threshold = 0.55
    probabilities = clf.predict_proba(X_test)[:, 1]
    predictions = (probabilities >= threshold).astype(int)
    matrix = confusion_matrix(y_test, predictions)
    metrics = {
        "threshold": threshold,
        "accuracy": float(accuracy_score(y_test, predictions)),
        "precision": float(precision_score(y_test, predictions)),
        "recall": float(recall_score(y_test, predictions)),
        "f1": float(f1_score(y_test, predictions)),
        "true_negative": int(matrix[0, 0]),
        "false_positive": int(matrix[0, 1]),
        "false_negative": int(matrix[1, 0]),
        "true_positive": int(matrix[1, 1]),
        "train_size": int(len(train_df)),
        "test_size": int(len(test_df))
    }
    payload = {
        "intercept": float(clf.intercept_[0]),
        "threshold": threshold,
        "token_features": vectorizer.get_feature_names_out().tolist(),
        "token_weights": clf.coef_[0][:len(vectorizer.get_feature_names_out())].tolist(),
        "numeric_names": numeric_names,
        "numeric_weights": clf.coef_[0][len(vectorizer.get_feature_names_out()):].tolist(),
        "means": means.tolist(),
        "stds": stds.tolist(),
        "metrics": metrics
    }
    Path("model_metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    Path("model_export.json").write_text(json.dumps(payload), encoding="utf-8")
    print(json.dumps(metrics, indent=2))

if __name__ == "__main__":
    main()
