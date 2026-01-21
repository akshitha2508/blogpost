"""
Database migration script to add new fields to existing tables
Run this script to update your existing database with new features
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
import os

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

def migrate_database():
    """Add new columns to existing tables"""
    with app.app_context():
        try:
            # Add new columns to Post table
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE post ADD COLUMN category VARCHAR(50) DEFAULT 'General';
                """))
                conn.commit()
            print("✓ Added category column to post table")
            
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE post ADD COLUMN tags VARCHAR(200) DEFAULT '';
                """))
                conn.commit()
            print("✓ Added tags column to post table")
            
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE post ADD COLUMN status VARCHAR(20) DEFAULT 'published';
                """))
                conn.commit()
            print("✓ Added status column to post table")
            
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE post ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
                """))
                conn.commit()
            print("✓ Added updated_at column to post table")
            
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE post ADD COLUMN views INTEGER DEFAULT 0;
                """))
                conn.commit()
            print("✓ Added views column to post table")
            
            # Add new columns to User table
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE user ADD COLUMN email VARCHAR(120);
                """))
                conn.commit()
            print("✓ Added email column to user table")
            
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE user ADD COLUMN bio TEXT;
                """))
                conn.commit()
            print("✓ Added bio column to user table")
            
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE user ADD COLUMN avatar_url VARCHAR(255);
                """))
                conn.commit()
            print("✓ Added avatar_url column to user table")
            
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE user ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
                """))
                conn.commit()
            print("✓ Added created_at column to user table")
            
            # Create Comment table if it doesn't exist
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    CREATE TABLE IF NOT EXISTS comment (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        content TEXT NOT NULL,
                        user_id INTEGER NOT NULL,
                        post_id INTEGER NOT NULL,
                        parent_id INTEGER,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES user (id),
                        FOREIGN KEY (post_id) REFERENCES post (id),
                        FOREIGN KEY (parent_id) REFERENCES comment (id)
                    );
                """))
                conn.commit()
            print("✓ Created comment table")
            
            print("\n🎉 Database migration completed successfully!")
            print("Your database now supports:")
            print("  - Post categories and tags")
            print("  - Draft/published status")
            print("  - View counts")
            print("  - User profiles with bio and avatar")
            print("  - Nested comments system")
            
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            print("This might be because the columns already exist or there's a database issue.")
            print("The app will still work, but some new features may not be available.")

if __name__ == '__main__':
    migrate_database()