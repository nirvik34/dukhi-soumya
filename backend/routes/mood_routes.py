from flask import Blueprint, request, jsonify
from models.mood_model import analyze_image
from database.db import save_record, get_records
from datetime import datetime

mood_bp = Blueprint('mood', __name__)

@mood_bp.route('/upload', methods=['POST'])
def upload_image():
    data = request.json
    base64_image = data.get('image') if data else None
    if not base64_image:
        return jsonify({"status": "error", "message": "No image provided"}), 400

    try:
        result = analyze_image(base64_image)
        record = {
            "emotion": result['primary_emotion'],
            "confidences": result['confidences'],
            "timestamp": datetime.now().isoformat()
        }
        save_record('moods', record)
        return jsonify({"status": "success", "results": result})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@mood_bp.route('/history', methods=['GET'])
def get_history():
    records = get_records('moods')
    return jsonify({"status": "success", "history": records})
