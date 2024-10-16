# Standard library imports
from random import randint, choice as rc
from datetime import datetime, timedelta

# Remote library imports
# from faker import Faker

# Local imports
from app import app
from config import bcrypt
from models import db, Users, Favorite, Mentorships, Resources


if __name__ == '__main__':
    with app.app_context():
        print("Creating instances...")

        # Clear existing data if needed
        db.drop_all()  # Be careful with this line in production!
        db.create_all()

        # Create Users
        users = [
            Users(username='Bryan', email='Bryan@example.com', password='password_for_bryan', bio='Bio for Bryan', birthdate=datetime(2000, 1, 1), is_mentor=True),
            Users(username='Joe', email='Joe@example.com', password='password_for_joe', bio='Bio for Joe', birthdate=datetime(1995, 2, 2), is_mentor=False),
            Users(username='Billy', email='Billy@example.com', password='password_for_billy', bio='Bio for Billy', birthdate=datetime(1990, 3, 3), is_mentor=False),
            Users(username='Ricky', email='Ricky@example.com', password='password_for_ricky', bio='Bio for Ricky', birthdate=datetime(1985, 4, 4), is_mentor=True),
            Users(username='Gabriel', email='Gabriel@example.com', password='password_for_gabriel', bio='Bio for Gabriel', birthdate=datetime(1980, 5, 5), is_mentor=True),
            Users(username='example', email='example@example.com', password='securepassword', bio='Bio for Example', birthdate=datetime(2001, 1, 1), cover_photo='path/to/photo.jpg', is_mentor=True)
        ]

        db.session.bulk_save_objects(users)
        db.session.commit()

        # Create Resources
        resources = [
            Resources(title='The Door', link='http://resource1.com', description='Description for The Door', resource_type='scholarship'),
            Resources(title='Gates Millenium', link='http://resource2.com', description='Description for Gates Millenium', resource_type='internship'),
            Resources(title='The Posse Foundation', link='http://resource3.com', description='Description for The Posse Foundation', resource_type='scholarship'),
            Resources(title='The New York Times Scholarship', link='http://resource4.com', description='Description for The New York Times Scholarship', resource_type='internship'),
            Resources(title='An Awesome internship', link='http://resource5.com', description='Description for An Awesome internship', resource_type='internship'),
        ]

        db.session.bulk_save_objects(resources)
        db.session.commit()

        # Create Favorites
        favorites = [
            Favorite(resource_id=1, user_id=2, personal_comment='Loved this resource!'),
            Favorite(resource_id=2, user_id=2, personal_comment='Very useful!'),
            Favorite(resource_id=3, user_id=3, personal_comment='Highly recommend this!'),
            Favorite(resource_id=4, user_id=3, personal_comment='Great for learning!'),
            Favorite(resource_id=5, user_id=2, personal_comment='Helped me a lot!'),
        ]

        db.session.bulk_save_objects(favorites)
        db.session.commit()

        # Create Mentorships
        mentorships = [
            Mentorships(user_id=1, resource_id=1, completed_the_event=datetime.now(), summary='Great event!', alternate_email='mentor1@example.com'),
            Mentorships(user_id=4, resource_id=2, completed_the_event=datetime.now() + timedelta(days=1), summary='Very insightful.', alternate_email='mentor2@example.com'),
            Mentorships(user_id=5, resource_id=3, completed_the_event=datetime.now() + timedelta(days=2), summary='Learned a lot!', alternate_email='mentor3@example.com'),
            Mentorships(user_id=6, resource_id=4, completed_the_event=datetime.now() + timedelta(days=3), summary='Valuable experience.', alternate_email='mentor4@example.com'),
            Mentorships(user_id=1, resource_id=5, completed_the_event=datetime.now() + timedelta(days=4), summary='Incredible insights.', alternate_email='mentor5@example.com'),
        ]

        db.session.bulk_save_objects(mentorships)
        db.session.commit()

        print("Created users, resources, favorites, and mentorships successfully.")

