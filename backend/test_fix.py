import urllib.request
import urllib.error
import json
from flask import Flask
from flask_jwt_extended import create_access_token, JWTManager

# Create a minimal Flask app to generate tokens
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'dev-secret-key'  # Must match backend config
jwt = JWTManager(app)

def make_request(token, title):
    url = 'http://localhost:5000/api/posts'
    data = json.dumps({'title': title, 'content': 'Test Content'}).encode('utf-8')
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    
    try:
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.getcode()}")
            print(f"Response: {response.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

def test_fix():
    # 1. Generate an "old style" token with dict identity
    with app.app_context():
        old_identity = {'id': 2, 'username': 'testuser', 'is_admin': True}
        old_token = create_access_token(identity=old_identity)
        
        # 2. Generate a "new style" token with string identity
        new_identity = '2'
        new_token = create_access_token(identity=new_identity)

    print("\n--- Testing with OLD token (dict identity) ---")
    make_request(old_token, "Post from Old Token")

    print("\n--- Testing with NEW token (string identity) ---")
    make_request(new_token, "Post from New Token")

if __name__ == '__main__':
    test_fix()
