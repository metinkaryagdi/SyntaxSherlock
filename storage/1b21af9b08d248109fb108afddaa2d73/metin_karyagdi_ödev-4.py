import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, KFold, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ============================
# VERİ YÜKLEME VE BİRLEŞTİRME
# ============================
print("Veriler yükleniyor...")
red = pd.read_csv("winequality-red.csv", sep=';')
white = pd.read_csv("winequality-white.csv", sep=';')

red["red_white"] = 0   # kırmızı
white["red_white"] = 1 # beyaz

wine = pd.concat([red, white], ignore_index=True)

# 'red_white' sütununu 'quality'den hemen önce taşı
cols = [c for c in wine.columns if c not in ['red_white', 'quality']] + ['red_white', 'quality']
wine = wine[cols]

print(f"Toplam kayıt: {len(wine)}")
print(wine.head())

# ============================
# EKSİK DEĞER YÖNETİMİ
# ============================
print("\n--- Eksik Değer Analizi (ÖNCE) ---")
missing_before = wine.isna().sum()
if missing_before.sum() > 0:
    print(missing_before[missing_before > 0])
else:
    print("Eksik değer yok.")

# Quality'de eksik varsa at
if wine["quality"].isna().any():
    wine = wine.dropna(subset=["quality"]).copy()

# Sayısal sütunlarda grup bazlı medyan ile doldur
numeric_cols = wine.select_dtypes(include=[np.number]).columns.tolist()
feature_cols = [c for c in numeric_cols if c not in ["quality", "red_white"]]

if wine[feature_cols].isna().any().any():
    medians = wine.groupby("red_white")[feature_cols].transform("median")
    wine[feature_cols] = wine[feature_cols].fillna(medians)

print("\n--- Eksik Değer Analizi (SONRA) ---")
missing_after = wine.isna().sum()
if missing_after.sum() > 0:
    print(missing_after[missing_after > 0])
else:
    print("Tüm eksik değerler giderildi.")

# ============================
# TRAIN-TEST SPLIT
# ============================
X = wine.drop(columns=["quality"])
y = wine["quality"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\nTrain: {len(X_train)}, Test: {len(X_test)}")

# ============================
# ÖLÇEKLENDİRME (SADECE BİR KEZ)
# ============================
scale_cols = [c for c in feature_cols if c in X_train.columns]

scaler = StandardScaler()
X_train_scaled = X_train.copy()
X_test_scaled = X_test.copy()

X_train_scaled[scale_cols] = scaler.fit_transform(X_train[scale_cols])
X_test_scaled[scale_cols] = scaler.transform(X_test[scale_cols])

print("Ölçekleme tamamlandı.")

# ============================
# MODEL SONUÇLARINI SAKLA
# ============================
results = []

# ============================
# 1. LINEAR REGRESSION
# ============================
print("\n" + "="*50)
print("LINEAR REGRESSION")
print("="*50)

linreg = LinearRegression()
linreg.fit(X_train_scaled, y_train)
y_pred = linreg.predict(X_test_scaled)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"Test RMSE: {rmse:.4f}")
print(f"Test R²  : {r2:.4f}")

results.append({"Model": "LinearRegression", "Detail": "-", "RMSE": rmse, "R²": r2})

# ============================
# 2. POLYNOMIAL REGRESSION
# ============================
print("\n" + "="*50)
print("POLYNOMIAL REGRESSION (CV)")
print("="*50)

degrees = [2, 3, 4, 5]
cv = KFold(n_splits=5, shuffle=True, random_state=42)

best_poly = {"degree": None, "cv_rmse": np.inf, "model": None}

for d in degrees:
    try:
        pipe = Pipeline([
            ("poly", PolynomialFeatures(degree=d, include_bias=False)),
            ("lin", LinearRegression())
        ])
        
        scores = cross_val_score(
            pipe, X_train_scaled, y_train,
            cv=cv, scoring="neg_mean_squared_error", n_jobs=-1
        )
        rmse_cv = np.sqrt(-scores.mean())
        
        print(f"Degree {d}: CV RMSE = {rmse_cv:.4f}")
        
        if rmse_cv < best_poly["cv_rmse"]:
            best_poly.update({"degree": d, "cv_rmse": rmse_cv, "model": pipe})
            
    except Exception as e:
        print(f"Degree {d} hata: {e}")

# En iyi modeli test et
if best_poly["model"] is not None:
    best_poly["model"].fit(X_train_scaled, y_train)
    y_pred = best_poly["model"].predict(X_test_scaled)
    
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print(f"\nEn iyi derece: {best_poly['degree']}")
    print(f"Test RMSE: {rmse:.4f}")
    print(f"Test R²  : {r2:.4f}")
    
    results.append({
        "Model": "Polynomial", 
        "Detail": f"deg={best_poly['degree']}", 
        "RMSE": rmse, 
        "R²": r2
    })

# ============================
# 3. SVR (GridSearchCV)
# ============================
print("\n" + "="*50)
print("SVR (GridSearchCV)")
print("="*50)

# Pipeline oluştur
preprocess = ColumnTransformer(
    transformers=[
        ("scale", StandardScaler(), scale_cols),
        ("pass", "passthrough", ["red_white"]),
    ],
    remainder="drop",
)

pipe = Pipeline([
    ("prep", preprocess),
    ("svr", SVR())
])

param_grid = {
    "svr__kernel": ["rbf", "linear"],
    "svr__C": [0.1, 1, 10, 100],
    "svr__epsilon": [0.05, 0.1, 0.2],
    "svr__gamma": ["scale", "auto"]
}

cv = KFold(n_splits=5, shuffle=True, random_state=42)

grid = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring="neg_mean_squared_error",
    cv=cv,
    n_jobs=-1,
    verbose=0
)

grid.fit(X_train, y_train)

best_rmse_cv = np.sqrt(-grid.best_score_)
print(f"En iyi CV RMSE: {best_rmse_cv:.4f}")
print(f"En iyi parametreler: {grid.best_params_}")

y_pred = grid.best_estimator_.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"Test RMSE: {rmse:.4f}")
print(f"Test R²  : {r2:.4f}")

results.append({"Model": "SVR", "Detail": "GridSearch", "RMSE": rmse, "R²": r2})

# ============================
# 4. DECISION TREE
# ============================
print("\n" + "="*50)
print("DECISION TREE (GridSearchCV)")
print("="*50)

num_cols = X_train.select_dtypes(include=[np.number]).columns.tolist()
preprocess = ColumnTransformer(
    transformers=[("pass", "passthrough", num_cols)],
    remainder="drop"
)

pipe = Pipeline([
    ("prep", preprocess),
    ("dt", DecisionTreeRegressor(random_state=42))
])

param_grid = {
    "dt__max_depth": [None, 5, 10, 15],
    "dt__min_samples_split": [2, 5, 10],
    "dt__min_samples_leaf": [1, 2, 5],
}

grid = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring="neg_mean_squared_error",
    cv=cv,
    n_jobs=-1,
    verbose=0
)

grid.fit(X_train, y_train)

print(f"En iyi parametreler: {grid.best_params_}")

y_pred = grid.best_estimator_.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"Test RMSE: {rmse:.4f}")
print(f"Test R²  : {r2:.4f}")

results.append({"Model": "DecisionTree", "Detail": "GridSearch", "RMSE": rmse, "R²": r2})

# ============================
# 5. RANDOM FOREST
# ============================
print("\n" + "="*50)
print("RANDOM FOREST (GridSearchCV)")
print("="*50)

pipe = Pipeline([
    ("prep", preprocess),
    ("rf", RandomForestRegressor(random_state=42, n_jobs=-1))
])

param_grid = {
    "rf__n_estimators": [100, 200, 400],
    "rf__max_depth": [None, 10, 20],
    "rf__min_samples_split": [2, 5],
    "rf__min_samples_leaf": [1, 2],
    "rf__max_features": ["sqrt", 0.8],
}

grid = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring="neg_mean_squared_error",
    cv=cv,
    n_jobs=-1,
    verbose=0
)

grid.fit(X_train, y_train)

print(f"En iyi parametreler: {grid.best_params_}")

y_pred = grid.best_estimator_.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"Test RMSE: {rmse:.4f}")
print(f"Test R²  : {r2:.4f}")

results.append({"Model": "RandomForest", "Detail": "GridSearch", "RMSE": rmse, "R²": r2})

# Özellik önemleri
rf_model = grid.best_estimator_.named_steps["rf"]
feat_imp = pd.DataFrame({
    "Feature": num_cols,
    "Importance": rf_model.feature_importances_
}).sort_values("Importance", ascending=False)

print("\nEn önemli 10 özellik:")
print(feat_imp.head(10).to_string(index=False))

# ============================
# SONUÇ KARŞILAŞTIRMASI
# ============================
print("\n" + "="*60)
print("MODEL KARŞILAŞTIRMA SONUÇLARI")
print("="*60)

results_df = pd.DataFrame(results)
results_df = results_df.sort_values("R²", ascending=False)

print("\n" + results_df.to_string(index=False))

best_model = results_df.iloc[0]
print(f"\n🏆 EN İYİ MODEL: {best_model['Model']} ({best_model['Detail']})")
print(f"   RMSE: {best_model['RMSE']:.4f}")
print(f"   R²  : {best_model['R²']:.4f}")