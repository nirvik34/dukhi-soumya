from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from database.db import init_db
from routes.mood_routes import mood_bp
from routes.activity_routes import activity_bp
from routes.auth_routes import auth_bp
from routes.game_routes import game_bp

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB for base64 images
    # Enable CORS for the React frontend
    CORS(app)

    # Initialize Database
    init_db()

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(mood_bp, url_prefix='/api/mood')
    app.register_blueprint(activity_bp, url_prefix='/api/activity')
    app.register_blueprint(game_bp, url_prefix='/api/game')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "NeuroLearn API is running!"})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
