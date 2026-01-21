"""
Recreate the database with the new enhanced schema
"""

from flask import Flask
from config import Config
from models import db, User, Post, Comment
import os

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

def recreate_database():
    """Drop and recreate all tables with the new schema"""
    with app.app_context():
        try:
            # Drop all tables
            print("Dropping existing tables...")
            db.drop_all()
            
            # Create all tables with new schema
            print("Creating new tables...")
            db.create_all()
            
            print("✅ Database recreated successfully!")
            print("New tables created:")
            print("  - user (with email, bio, avatar_url, created_at)")
            print("  - post (with category, tags, status, updated_at, views)")
            print("  - comment (new table for comments system)")
            
        except Exception as e:
            print(f"❌ Error recreating database: {e}")

if __name__ == '__main__':
    recreate_database()