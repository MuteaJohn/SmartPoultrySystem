import pandas as pd
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")  
db = client["small_poultry_backend"]
sensor_collection = db["sensor"]  

data = list(sensor_collection.find())

df = pd.DataFrame(data)

df.drop(columns=["_id"], inplace=True)

def label_row(row):
    if row['temperature'] > 40 or row['temperature'] < 15:
        return 'abnormal'
    if row['humidity'] > 90 or row['humidity'] < 30:
        return 'abnormal'
    if row['water_level'] < 20 or row['feed_level'] < 20:
        return 'abnormal'
    return 'normal'

df['label'] = df.apply(label_row, axis=1)

df.to_csv('labeled_sensor_data.csv', index=False)

print("✅ Sensor data exported and labeled as 'labeled_sensor_data.csv'")
