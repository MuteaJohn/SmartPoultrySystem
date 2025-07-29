import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score
from joblib import dump

df = pd.read_csv("labeled_sensor_data.csv")

X = df[["temperature", "humidity", "water_level", "feed_level"]]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

dump(model, "poultry_model.pkl")
print("✅ Model saved as 'poultry_model.pkl'")
