# api.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js

with open("poultry_model.pkl", "rb") as file:
    model = joblib.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    temperature = data.get('temperature')
    humidity = data.get('humidity')
    water_level = data.get('water_level')
    feed_level = data.get('feed_level')

    if None in [temperature, humidity, water_level, feed_level]:
        return jsonify({"error": "Missing input data"}), 400

    input_df = pd.DataFrame([{
        "temperature": temperature,
        "humidity": humidity,
        "water_level": water_level,
        "feed_level": feed_level
    }])

    prediction = model.predict(input_df)[0]
    return jsonify({"prediction": prediction})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
