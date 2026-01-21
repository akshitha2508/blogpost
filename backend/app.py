from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes import api
from waitress import serve
import os

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS to allow frontend requests
CORS(app, origins=[
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://localhost:5174', 
    'http://127.0.0.1:5174'
], supports_credentials=True)
JWTManager(app)
db.init_app(app)

app.register_blueprint(api, url_prefix='/api')

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    print("Starting production server with Waitress on http://0.0.0.0:5000")
    serve(app, host='0.0.0.0', port=5000)

