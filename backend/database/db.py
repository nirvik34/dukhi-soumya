import os
import json
import numpy as np
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "neurolearn"
LOCAL_DATA_FILE = "data.json"

def _json_default(obj):
    """Handle numpy types for JSON serialization."""
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

db = None
use_local = False

def init_db():
    global db, use_local
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        db = client[DB_NAME]
        print("Connected to MongoDB")
    except ConnectionFailure:
        print("Failed to connect to MongoDB. Falling back to local data.json")
        use_local = True
        if not os.path.exists(LOCAL_DATA_FILE):
            with open(LOCAL_DATA_FILE, 'w') as f:
                json.dump({"moods": [], "activities": []}, f)

def get_db():
    return db

def save_record(collection_name, data):
    if use_local:
        try:
            with open(LOCAL_DATA_FILE, 'r') as f:
                local_data = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            local_data = {"moods": [], "activities": []}

        if collection_name not in local_data:
            local_data[collection_name] = []
        local_data[collection_name].append(data)

        with open(LOCAL_DATA_FILE, 'w') as f:
            json.dump(local_data, f, default=_json_default)
    else:
        # Convert _id to string to ensure json serialization later if needed, but for mongo just insert
        db[collection_name].insert_one(data)
        # remove _id from data so it doesn't break jsonification later since we modified it in place
        data.pop('_id', None)

def get_records(collection_name):
    if use_local:
        with open(LOCAL_DATA_FILE, 'r') as f:
            local_data = json.load(f)
            return local_data.get(collection_name, [])
    else:
        return list(db[collection_name].find({}, {'_id': False}))
