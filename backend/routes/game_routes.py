from flask import Blueprint, request, jsonify
from database.db import save_record, get_records
from datetime import datetime

game_bp = Blueprint('game', __name__)

@game_bp.route('/save-score', methods=['POST'])
def save_score():
    data = request.json
    if not data or 'game' not in data or 'score' not in data:
        return jsonify({"status": "error", "message": "game and score are required"}), 400
    
    record = {
        "game": data['game'],
        "score": data['score'],
        "username": data.get('username', 'anonymous'),
        "duration": data.get('duration', 0),
        "details": data.get('details', {}),
        "timestamp": datetime.now().isoformat()
    }
    save_record('game_scores', record)
    return jsonify({"status": "success", "message": "Score saved!", "record": record}), 201

@game_bp.route('/scores', methods=['GET'])
def get_scores():
    game_filter = request.args.get('game')
    username = request.args.get('username')
    records = get_records('game_scores')
    
    if game_filter:
        records = [r for r in records if r.get('game') == game_filter]
    if username:
        records = [r for r in records if r.get('username') == username]
    
    return jsonify({"status": "success", "scores": records})

@game_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    game_filter = request.args.get('game')
    records = get_records('game_scores')
    
    if game_filter:
        records = [r for r in records if r.get('game') == game_filter]
    
    # Sort by score descending, take top 10
    records.sort(key=lambda x: x.get('score', 0), reverse=True)
    top_scores = records[:10]
    
    return jsonify({"status": "success", "leaderboard": top_scores})
