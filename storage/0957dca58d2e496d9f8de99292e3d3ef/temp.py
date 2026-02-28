import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.model_selection import train_test_split, cross_val_score, KFold, GridSearchCV
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

veriler = pd.read_csv('maaslar_yeni.csv')

simple_impt = SimpleImputer(strategy='mean')
knn_impt = KNNImputer(n_neighbors=2)

veriler.iloc[:, 2:5] = simple_impt.fit_transform(veriler.iloc[:, 2:5])
veriler.iloc[:, 2:5] = knn_impt.fit_transform(veriler.iloc[:, 2:5])

encoder = OneHotEncoder()
unvan_encoder = encoder.fit_transform(veriler[['unvan']]).toarray()
unvan_df = pd.DataFrame(unvan_encoder, columns=encoder.get_feature_names_out(['unvan']))

X = pd.concat([unvan_df, veriler[['UnvanSeviyesi', 'Kidem', 'Puan']]], axis=1)
y = veriler[['maas']]
scaler = StandardScaler()
X_sclaled = scaler.fit_transform(X)
y_sclaled = scaler.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X_sclaled, y_sclaled, test_size=0.2, random_state=42)

lin_reg = LinearRegression()
lin_reg.fit(X_train, y_train)
y_pred_lin = lin_reg.predict(X_test)

poly = PolynomialFeatures(degree=3)
X_poly = poly.fit_transform(X_train)
X_poly_test = poly.transform(X_test)
lin_reg_poly = LinearRegression()
lin_reg_poly.fit(X_poly, y_train)
y_pred_poly = lin_reg_poly.predict(X_poly_test)

svr = SVR(kernel='rbf')
svr.fit(X_train, y_train)
y_pred_svr = svr.predict(X_test)

tree_reg = DecisionTreeRegressor(max_depth=3, random_state=0)
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(tree_reg, X, y, scoring='r2', cv=kf)
print("Her katın R2 skorları ", scores)
print("Ortalama R2 skorları: ", scores.mean())

param_grid = {'max_depth': [2, 3, 4, 5, 6]}
grid = GridSearchCV(tree_reg, param_grid, cv=4, scoring='r2')
grid.fit(X, y)

print("En iyi derinlik: ", grid.best_params_)
print("En iyi ortalama R2: ", grid.best_score_)

rf_reg = RandomForestRegressor(n_estimators=100, max_depth=4, random_state=0)
rf_reg.fit(X_train, y_train.ravel())
y_pred = rf_reg.predict(X_test)

param_grid= [{'n_estimators': [50, 100, 200], #Ağaç Sayısı
               'max_depth': [5, 10, 20],    #Maximum Derinlik
               'min_samples_split': [2, 5, 10]}]  #Dallanma için minimum örnek sayısı
               
cv = KFold(n_splits=5, shuffle=True, random_state=42)

Grid_search = GridSearchCV(estimator=rf_reg,
                           param_grid=param_grid,
                           cv=cv,
                           scoring='neg_mean_squared_error',
                           n_jobs=-1,
                           verbose=1)

Grid_search.fit(X, y)

best_model = Grid_search.best_estimator_

y_test_real = scaler.inverse_transform(y_test)
y_pred_lin_real = scaler.inverse_transform(y_pred_lin)
y_pred_poly_real = scaler.inverse_transform(y_pred_poly)
y_pred_svr_real = scaler.inverse_transform(y_pred_svr.reshape(-1, 1))

print("Linear R2: ", r2_score(y_test_real, y_pred_lin_real))
print("Linear MSE: ", mean_squared_error(y_test_real, y_pred_lin_real))

print("Polinom R2: ", r2_score(y_test_real, y_pred_poly_real))
print("Polinom MSE: ", mean_squared_error(y_test_real, y_pred_poly_real))

print("SVR R2: ", r2_score(y_test_real, y_pred_svr_real))
print("SVR MSE: ", mean_squared_error(y_test_real, y_pred_svr_real))