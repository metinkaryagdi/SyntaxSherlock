import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report, 
    roc_auc_score, 
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_curve,
    precision_recall_curve,
    auc
)
import warnings
import os

warnings.filterwarnings('ignore')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 12

DATASET_PATH = os.path.join(SCRIPT_DIR, "dataset_thinking.csv")
MODEL_PATH = os.path.join(SCRIPT_DIR, "syntax_sherlock_model.pkl")
RESULTS_DIR = os.path.join(SCRIPT_DIR, "model_results")

if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)


df = pd.read_csv(DATASET_PATH)

print("=" * 60)
print("📊 SYNTAX SHERLOCK - RANDOM FOREST MODEL EĞİTİMİ")
print("=" * 60)
print(f"\n📁 Veri seti boyutu: {df.shape[0]} satır, {df.shape[1]} sütun")

FEATURES = [
    "is_division",
    "is_index",
    "inside_loop",
    "inside_function",
    "try_guard",
    "divisor_is_const_zero",
    "divisor_is_const_nonzero",
    "divisor_is_name",
    "divisor_is_param",
    "divisor_is_loop_var",
    "divisor_guarded",
    "index_is_const",
    "index_is_name",
    "index_is_loop_var",
    "index_is_param",
    "container_is_literal",
    "idx_oob_literal",
    "index_guarded",
    "index_strong_guard"
]

TARGET = "runtime_error"

X = df[FEATURES]
y = df[TARGET]

print(f"📌 Özellik sayısı: {len(FEATURES)}")
print(f"📌 Hedef değişken dağılımı:")
print(y.value_counts())
print(f"📌 Pozitif sınıf oranı: {y.mean():.2%}")


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"\n📊 Eğitim seti: {len(X_train)} örnek")
print(f"📊 Test seti: {len(X_test)} örnek")


print("\n" + "=" * 60)
print("🚀 RANDOM FOREST EĞİTİMİ BAŞLIYOR...")
print("=" * 60)

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=10,
    min_samples_leaf=10,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

# Metrikler
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_proba)
cm = confusion_matrix(y_test, y_pred)

cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='f1')

print(f"\n📊 RANDOM FOREST - SONUÇLAR:")
print(f"   ✅ Accuracy:  {accuracy:.4f}")
print(f"   ✅ Precision: {precision:.4f}")
print(f"   ✅ Recall:    {recall:.4f}")
print(f"   ✅ F1-Score:  {f1:.4f}")
print(f"   ✅ ROC-AUC:   {roc_auc:.4f}")
print(f"   ✅ CV F1 (5-fold): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

print(f"\n📋 Classification Report:")
print(classification_report(y_test, y_pred))

print(f"📊 Confusion Matrix:")
print(cm)
print(f"   TN: {cm[0,0]}, FP: {cm[0,1]}")
print(f"   FN: {cm[1,0]}, TP: {cm[1,1]}")

print("\n" + "=" * 60)
print("📈 GRAFİKLER OLUŞTURULUYOR...")
print("=" * 60)

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Tahmin: 0', 'Tahmin: 1'],
            yticklabels=['Gerçek: 0', 'Gerçek: 1'])
plt.title(f'Random Forest - Confusion Matrix\nAccuracy: {accuracy:.3f}', fontsize=14, fontweight='bold')
plt.xlabel('Tahmin Edilen')
plt.ylabel('Gerçek Değer')
plt.tight_layout()
plt.savefig(f'{RESULTS_DIR}/confusion_matrix.png', dpi=300, bbox_inches='tight')
plt.close()
print("✅ Confusion Matrix kaydedildi: confusion_matrix.png")

plt.figure(figsize=(10, 8))
fpr, tpr, _ = roc_curve(y_test, y_proba)
plt.plot(fpr, tpr, color='#2E86AB', lw=2, label=f'Random Forest (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', lw=1, label='Random Classifier')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate (FPR)', fontsize=12)
plt.ylabel('True Positive Rate (TPR)', fontsize=12)
plt.title('Random Forest - ROC Curve', fontsize=14, fontweight='bold')
plt.legend(loc='lower right', fontsize=10)
plt.grid(True, alpha=0.3)
plt.savefig(f'{RESULTS_DIR}/roc_curve.png', dpi=300, bbox_inches='tight')
plt.close()
print("✅ ROC Curve kaydedildi: roc_curve.png")

plt.figure(figsize=(10, 8))
precision_vals, recall_vals, _ = precision_recall_curve(y_test, y_proba)
pr_auc = auc(recall_vals, precision_vals)
plt.plot(recall_vals, precision_vals, color='#2E86AB', lw=2, label=f'Random Forest (PR-AUC = {pr_auc:.3f})')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('Recall', fontsize=12)
plt.ylabel('Precision', fontsize=12)
plt.title('Random Forest - Precision-Recall Curve', fontsize=14, fontweight='bold')
plt.legend(loc='lower left', fontsize=10)
plt.grid(True, alpha=0.3)
plt.savefig(f'{RESULTS_DIR}/precision_recall_curve.png', dpi=300, bbox_inches='tight')
plt.close()
print("✅ Precision-Recall Curve kaydedildi: precision_recall_curve.png")

plt.figure(figsize=(10, 6))
metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC']
values = [accuracy, precision, recall, f1, roc_auc]
colors = ['#2E86AB', '#A23B72', '#F18F01', '#5D9B9B', '#8B5CF6']

bars = plt.bar(metrics, values, color=colors)
for bar, val in zip(bars, values):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01, 
             f'{val:.3f}', ha='center', va='bottom', fontsize=11, fontweight='bold')

plt.ylabel('Skor', fontsize=12)
plt.title('Random Forest - Performans Metrikleri', fontsize=14, fontweight='bold')
plt.ylim([0, 1.15])
plt.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
plt.savefig(f'{RESULTS_DIR}/metrics.png', dpi=300, bbox_inches='tight')
plt.close()
print("✅ Metrik grafiği kaydedildi: metrics.png")

feature_importance = pd.DataFrame({
    'feature': FEATURES,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=True)

plt.figure(figsize=(10, 8))
bars = plt.barh(feature_importance['feature'], feature_importance['importance'], color='#2E86AB')
plt.xlabel('Önem Derecesi', fontsize=12)
plt.ylabel('Özellik', fontsize=12)
plt.title('Random Forest - Feature Importance', fontsize=14, fontweight='bold')
plt.grid(True, alpha=0.3, axis='x')

for bar, val in zip(bars, feature_importance['importance']):
    plt.text(val + 0.005, bar.get_y() + bar.get_height()/2, 
             f'{val:.3f}', va='center', fontsize=9)

plt.tight_layout()
plt.savefig(f'{RESULTS_DIR}/feature_importance.png', dpi=300, bbox_inches='tight')
plt.close()
print("✅ Feature Importance kaydedildi: feature_importance.png")

plt.figure(figsize=(16, 14))
correlation_matrix = X.corr()

# Isı haritası oluştur
mask = np.zeros_like(correlation_matrix)
mask[np.triu_indices_from(mask, k=1)] = True 
sns.heatmap(
    correlation_matrix,
    annot=True,
    fmt='.2f',
    cmap='RdBu_r',
    center=0,
    square=True,
    linewidths=0.5,
    cbar_kws={'shrink': 0.8, 'label': 'Korelasyon Katsayısı'},
    annot_kws={'size': 8},
    vmin=-1,
    vmax=1
)

plt.title('Özellikler Arası Korelasyon Matrisi', fontsize=16, fontweight='bold', pad=20)
plt.xticks(rotation=45, ha='right', fontsize=9)
plt.yticks(rotation=0, fontsize=9)
plt.tight_layout()
plt.savefig(f'{RESULTS_DIR}/correlation_matrix.png', dpi=300, bbox_inches='tight')
plt.close()
print("✅ Correlation Matrix kaydedildi: correlation_matrix.png")


print("\n📌 Model feature listesi:")
print(list(model.feature_names_in_))

joblib.dump(model, MODEL_PATH)
print(f"\n✅ Model kaydedildi: {MODEL_PATH}")

print("\n" + "=" * 60)
print("✅ EĞİTİM TAMAMLANDI!")
print("=" * 60)
print(f"\n📁 Tüm sonuçlar '{RESULTS_DIR}' klasöründe kaydedildi:")
print("   • confusion_matrix.png")
print("   • roc_curve.png")
print("   • precision_recall_curve.png")
print("   • metrics.png")
print("   • feature_importance.png")
print("   • correlation_matrix.png")
