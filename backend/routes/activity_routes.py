from flask import Blueprint, request, jsonify
from database.db import save_record, get_records
from datetime import datetime

activity_bp = Blueprint('activity', __name__)

@activity_bp.route('/activities', methods=['GET'])
def get_activities():
    # Return placeholder activities or combine with DB records
    activities = [
        {"id": 1, "title": "Mood Check", "description": "Tell us how you're feeling to get customized activity picks.", "category": "mood"},
        {"id": 2, "title": "Dashboard", "description": "Track your stars, levels, and upcoming activities all in one place.", "category": "dashboard"}
    ]
    db_activities = get_records('activities')
    return jsonify({"activities": activities, "saved_results": db_activities})

@activity_bp.route('/save', methods=['POST'])
def save_activity():
    data = request.json
    if not data:
         return jsonify({"status": "error", "message": "No data provided"}), 400
    
    data['timestamp'] = datetime.now().isoformat()
    save_record('activities', data)
    return jsonify({"status": "success"})
