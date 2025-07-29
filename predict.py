import joblib
import pandas as pd
import sys

# Load the model
with open("poultry_model.pkl", "rb") as file:
    model = joblib.load(file)

# Check if all 4 inputs are provided
if len(sys.argv) != 5:
    print("Usage: python predict.py <temperature> <humidity> <water_level> <feed_level>")
    print("Example: python predict.py 36.5 70 80 90")
    sys.exit(1)

# Convert command line inputs to floats
temperature = float(sys.argv[1])
humidity = float(sys.argv[2])
water_level = float(sys.argv[3])
feed_level = float(sys.argv[4])

# Create input DataFrame
input_data = pd.DataFrame([{
    "temperature": temperature,
    "humidity": humidity,
    "water_Level": water_level,
    "feed_Level": feed_level
}])

# Predict and display result
prediction = model.predict(input_data)[0]
print(f"Prediction: {prediction}")
