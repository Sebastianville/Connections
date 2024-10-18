
#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify, session
from flask_restful import Resource
from flask_bcrypt import Bcrypt

from twilio_helper import send_sms 
import datetime 

# Local imports
from config import app, db, api

# Add your model imports
from models import Users, Favorite, Resources, Mentorships
from werkzeug.exceptions import NotFound



@app.route('/')
def welcome():
    return jsonify(message="Welcome to the ConnectingBuddy")





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
        mentorships = Mentorships.query.all()
        if(not mentorships): 
            return make_response({"error": "user not found"}, 404)
        mentorship_list = [mentorship.to_dict() for mentorship in mentorships]
        return make_response(mentorship_list, 200)

api.add_resource(AllMentorships, '/mentorships')

class AllResources(Resource):
    def get(self):
        resources = Resources.query.all()
        if(not resources): 
            return make_response({"error": "resource not found"}, 404)
        resources_list = [que.to_dict() for que in resources]
        return make_response(resources_list, 200)
api.add_resource(AllResources, '/resources')


class CreateNewResource(Resource):
    def post(self):
        try: 
            #get json from request
            data = request.get_json()
            print(f"Received data for new resource: {data}")
            #create a new resource instance
            new_resource = Resources(**data)
            db.session.add(new_resource)
            db.session.commit()
            print(f"Resource created successfully: {new_resource.to_dict()}")
        except Exception as e:
            print(f"Error creating resource: {e}")
            return make_response({'message': 'creating the new resource went wrong'}, 422)
        return make_response(new_resource.to_dict(), 201)
    
api.add_resource(CreateNewResource, '/resources')

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
            is_mentor=data.get('is_mentor') == 'true',
            cover_photo=data.get('cover_photo'),
            password = data.get('password')
        )
        

        try:
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            print(f"User {new_user.id} signed up successfully")
            return make_response(new_user.to_dict(), 201)
        except Exception as e:
            print(f"Error during signup: {e}")
            return make_response({'message': str(e)}, 422)
api.add_resource(Signup, '/signup')

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
        # print("POST /favorites route hit")
        # print(f"Session data: {session}")
        # print("Before checking for user in session")
        user_id = session.get('user_id')
        if not user_id:
            print("Unauthorized: no user in session")
            return make_response({'message': 'Unauthorized'}, 401)

        try:
            data = request.get_json()
            print(f"Received data for new favorite: {data}")

            user = Users.query.get(user_id)
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

            if user.phone_number and user.receive_sms_notifications:
                message_body = f"Hello {user.username}, you have favorited the resource: {resource.title}."
                print(f"Sending SMS to {user.phone_number}: {message_body}")
                send_sms(user.phone_number, message_body)

            return make_response(new_favorite.to_dict(), 201)
        
        except Exception as e:
            db.session.rollback()
            return make_response({'message': f'Error creating favorite: {str(e)}'}, 500)
        
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'User not authenticated'}), 401

        favorites = Favorite.query.filter_by(user_id=user_id).all()
        return jsonify([favorite.to_dict() for favorite in favorites]), 200
        
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

