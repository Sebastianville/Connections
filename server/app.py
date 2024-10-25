
#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify, session
from flask_restful import Resource
from flask_bcrypt import Bcrypt


import datetime 
import requests


# Local imports
from config import app, db, api

# Add your model imports
from models import Users, Favorite, Resources, Mentorships
from werkzeug.exceptions import NotFound
import http.client
import json
import os
from dotenv import load_dotenv
import http.client
import json

load_dotenv()

BASE_URL = os.getenv('BASE_URL')
INFOBIP_SENDER_NUMBER = os.getenv('INFOBIP_SENDER_NUMBER')
INFOBIP_AUTH_TOKEN = os.getenv('INFOBIP_AUTH_TOKEN')
print(os.getenv('BASE_URL'))
print(os.getenv('INFOBIP_SENDER_NUMBER'))
print(os.getenv('INFOBIP_AUTH_TOKEN'))


@app.route('/')
def welcome():
    return jsonify(message="Welcome to ConnectingBuddy")

def send_welcome_message(phone_number, message_text):
    # Establish HTTPS connection to Infobip
    conn = http.client.HTTPSConnection(BASE_URL)

    # Prepare the SMS payload
    payload = json.dumps({
        "messages": [
            {
                "destinations": [{"to": phone_number}],
                "from": INFOBIP_SENDER_NUMBER, 
                "text": message_text
            }
        ]
    })

    headers = {
        'Authorization':f"App {INFOBIP_AUTH_TOKEN}",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

     # Send the request
    try:
        conn.request("POST", "/sms/2/text/advanced", payload, headers)
        res = conn.getresponse()
        data = res.read()
        response_data = data.decode("utf-8")


        if res.status != 200:
            
            return {'error': response_data}
        
        return response_data

    except Exception as e:
        return {'error': str(e)}


class Signup(Resource):
    def post(self):
        data = request.get_json()
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')

        if password != password_confirmation:
            print("Passwords do not match")
            return make_response({'message': 'Passwords do not match'}, 400)
        
        # Check if the email already exists
        existing_user = Users.query.filter_by(email=data.get('email')).first()
        if existing_user:
            return make_response({'message': 'Email already taken'}, 422)
        
        
        format = '%Y-%m-%d'
        new_user = Users(
            username=data.get('username'),
            email=data.get('email'),
            birthdate= datetime.datetime.strptime(data.get('birthdate'), format),
            bio=data.get('bio'),
            is_mentor=bool(data.get('is_mentor')),
            cover_photo=data.get('cover_photo'),
            phone_number=data.get('phone_number'),
            receive_sms_notifications= data.get('receive_sms_notifications'),
            password = data.get('password')
        )
        

        try:
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            print(f"User {new_user.id} signed up successfully")
            
            if new_user.phone_number and new_user.receive_sms_notifications:
                welcome_message = f"Hello {new_user.username}, welcome to ConnectingBuddy platform!"
                sms_response = send_welcome_message(new_user.phone_number, welcome_message)
                print(sms_response)

            return make_response(new_user.to_dict(), 201)

        except Exception as e:
            print(f"Error during signup: {e}")
            return make_response({'message': str(e)}, 422)
api.add_resource(Signup, '/signup')




class AllUsers(Resource):
    def get(self):
        users = Users.query.all()
        if not users: 
            return make_response({"message": "user not found"}, 404)
        user_list = [user.to_dict() for user in users]
        return make_response(user_list, 200)
    
    def post(self):
        try: 
            #get json from request
            data = request.get_json()
            print(f"Received data for new user: {data}")
            #create a new user instance
            new_user = Users(**data)
            new_user.password_hash = data['password']
            db.session.add(new_user)
            db.session.commit()
        except:
            return make_response({'message': 'creating the user went wrong'}, 422)
        return make_response(jsonify(new_user()), 201)
    
api.add_resource(AllUsers, '/users')



class OneUser(Resource):
    def get(self, id):
        print(f"Fetching user with id: {id}")
        user = Users.query.filter_by(id=id).first()
        if not user: 
            return make_response({"error": "user not found"}, 404)
        return make_response(user.to_dict(), 200)
    
    def delete(self, id):
        user = Users.query.filter_by(id=id).first()
        if(not user): 
            return make_response({"error": "user not found"}, 404)
        db.session.delete(user)
        db.session.commit()
        print(f"User with id {id} deleted successfully")
        return make_response({}, 204)
    
    def patch(self, id):
        user = Users.query.filter_by(id=id).first()
        if not user:
            return make_response(jsonify({'error': "User not found"}), 404)
        data = request.get_json()
        print(f"Received update data for user {id}: {data}")

        if 'password' in data:
            user.password_hash = data['password']
            data.pop('password')  

        for key, value in data.items():
            setattr(user, key, value)
        
        try: 
            db.session.commit()
            return make_response(jsonify(user.to_dict()), 200)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': str(e)}), 400)

api.add_resource(OneUser, '/users/<int:id>')

class AllMentorships(Resource):
    def get(self):
        mentorships = Mentorships.query.join(Users).all()
        mentorship_list = [mentorship.to_dict() for mentorship in mentorships]
        return make_response(mentorship_list, 200)
    
    def post(self):
        try:
            data = request.get_json()
            mentor_email = data.get('mentor_email')
            mentor = Users.query.filter_by(email=mentor_email, is_mentor=True).first()
            if not mentor:
                return make_response({'message': 'Mentor not found or not valid'}, 404)

            format = '%Y-%m-%d'
            new_mentorship = Mentorships(
                resource_id=data['resource_id'],  # Resource ID passed from front-end
                user_id=mentor.id,  
                summary=data.get('summary', "Pending summary"),
                completed_the_event=datetime.datetime.strptime(data['completed_the_event'], format),
                alternate_email=mentor.email
            )
            db.session.add(new_mentorship)
            db.session.commit()

            return make_response({'mentorship': new_mentorship.to_dict()}, 201)
        except Exception as e:
            print(f"Error creating mentorship: {e}")
            return make_response({'message': 'creating the mentorship went wrong'}, 422)

api.add_resource(AllMentorships, '/mentorships')

class AllResources(Resource):
    def get(self):
        resources = Resources.query.all()
        if(not resources): 
            return make_response({"error": "resource not found"}, 404)
        resources_list = [que.to_dict() for que in resources]
        return make_response(resources_list, 200)
    

    def post(self):
        try:
            data = request.get_json()
            print(f"Received data for new resource: {data}")

            new_resource = Resources(**data)
            db.session.add(new_resource)
            db.session.commit()

            return make_response({'resource': new_resource.to_dict()}, 201)
        except Exception as e:
            print(f"Error creating resource: {e}")
            return make_response({'message': 'creating the new resource went wrong'}, 422)
api.add_resource(AllResources, '/resources')


class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return make_response(jsonify({'error': 'Email and password required'}), 400)
        
        user = Users.query.filter_by(email=email).first()
        #the authenticae is coming from models
        if user and user.authenticate(password):
            session['user_id'] = user.id
            # session['username_id'] = user.id 
            return make_response(user.to_dict(), 200)
        else:
            print("Invalid email or password")
            return make_response({'message': 'Wrong user or password'}, 401)
api.add_resource(UserLogin, '/login')

class CheckSession(Resource):
    def get(self):
        print("Checking session for logged-in user")
        user_id = session.get('user_id')  
        if user_id:
            print(f"User ID found in session: {user_id}")
            cur_user = Users.query.filter_by(id=user_id).first()
            if cur_user:
                return make_response(cur_user.to_dict(), 200)
            return make_response({'message': 'User not found'}, 404)
        print("No user logged in")
        return make_response({'message': 'No one is logged in'}, 401)

api.add_resource(CheckSession, '/check_session')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message': 'user logged out'}, 200)
api.add_resource(Logout, '/logout')


class AllFavorites(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            print("Unauthorized: no user in session")
            return make_response({'message': 'Unauthorized'}, 401)

        try:
            data = request.get_json()
            print(f"Received data for new favorite: {data}")

            user = Users.query.get(user_id)
            print(user.to_dict())
            resource_id = data.get('resource_id')
            if not resource_id:
                return make_response({'message': 'resource_id is required'}, 400)
            
            existing_favorite = Favorite.query.filter_by(user_id=user_id, resource_id=resource_id).first()
            if existing_favorite:
                return make_response({'message': 'Resource already favorited'}, 400)

            # Create a new Favorite entry
            new_favorite = Favorite(
                resource_id=resource_id,
                user_id=user_id,  
                personal_comment=data.get('personal_comment')
            )
            db.session.add(new_favorite)
            db.session.commit()

            return make_response(new_favorite.to_dict(), 201)
        
        except Exception as e:
            db.session.rollback()
            return make_response({'message': f'Error creating favorite: {str(e)}'}, 500)
        
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'User not authenticated'}), 401

        favorites = Favorite.query.filter_by(user_id=user_id).join(Resources).join(Mentorships).all()
        favorites_with_mentorships = [{'favorite': favorite.to_dict(),'mentorships': [mentorship.to_dict() for mentorship in favorite.resource.mentorships]} for favorite in favorites]
        return jsonify(favorites_with_mentorships), 200
        
api.add_resource(AllFavorites, '/favorites')

class FavoriteDelete(Resource):
    def delete(self, id):
        # Again, get the logged-in user's ID from session
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'message': 'Unauthorized'}, 401)

        favorite = Favorite.query.get(id)
        if favorite and favorite.user_id == user_id:
            db.session.delete(favorite)
            db.session.commit()
            return make_response({'message': 'Favorite deleted'}, 204)
        return make_response({'message': 'Favorite not found or unauthorized'}, 404)
api.add_resource(FavoriteDelete, '/favorites/<int:id>')


@app.errorhandler(NotFound)
def handle_not_found(e):
    response = make_response("Not Found: Sorry the resource you are looking for does not exist", 404)
    return response


if __name__ == '__main__':
    app.run(port=5555, debug=True)

