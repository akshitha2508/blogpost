from app import app
from models import db, User, Post
from werkzeug.security import generate_password_hash

def seed():
    with app.app_context():
        db.create_all()
        # Check if user exists, if not create one
        user = User.query.filter_by(username='StoryTeller').first()
        if not user:
            # Create a specific user for this story
            hashed_pw = generate_password_hash('password')
            user = User(username='StoryTeller', password=hashed_pw, is_admin=True)
            db.session.add(user)
            db.session.commit()
            print("Created user 'StoryTeller'")

        title = "The Lost Key of Aethelgard"
        content = """In the village of Aethelgard, there was a legend about a key that could open any door—not just physical ones, but doors to opportunities, to the past, and even to one's own heart. Elara, a young librarian, found an old, rusted iron key tucked inside a hollowed-out book titled 'Whispers of the Ancients'.

It didn't look like much. No jewels, no gold filigree. Just cold, heavy iron. She carried it in her pocket for days, feeling its weight against her thigh. One rainy Tuesday, she stood before the door of the old clock tower, a place that had been sealed for fifty years since the Great Storm. On a whim, she slid the rusted key into the pristine, polished lock. It shouldn't have fit.

But it did. With a satisfying click, the mechanism turned.

Inside, the air was still and smelled of ozone. The giant gears were frozen in time. As Elara stepped in, the gears groaned and began to turn, not forward, but backward. She watched in awe as the dust rose and reassembled into papers, the broken windows mended themselves, and the sunlight shifted from the grey of rain to the golden hue of a summer afternoon from decades ago.

She had found the key, but she realized too late that some doors are locked for a reason. The clock wasn't just measuring time; it was holding it back."""

        post = Post(title=title, content=content, user_id=user.id)
        db.session.add(post)
        db.session.commit()
        print("Story added successfully!")

if __name__ == '__main__':
    seed()
