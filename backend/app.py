from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from database.db import init_db
from routes.mood_routes import mood_bp
from routes.activity_routes import activity_bp
from routes.auth_routes import auth_bp

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    # Enable CORS for the React frontend
    CORS(app)

    # Initialize Database
    init_db()

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(mood_bp, url_prefix='/api/mood')
    app.register_blueprint(activity_bp, url_prefix='/api/activity')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "NeuroLearn API is running!"})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
