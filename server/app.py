#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Users, Favorite, Resources, Mentorships
from werkzeug.exceptions import NotFound

# Views go here!

@app.route('/')
def index():
    return '<h1>Welcome to ConnectingBuddy</h1>'

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
        return make_response({}, 204)
    
    def patch(self, id):
        user = Users.query.filter_by(id=id).first()
        if not user:
            return make_response(jsonify({'error': "User not found"}), 404)
        data = request.get_json()
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


class CreateNewResource(Resource):
    def post(self):
        try: 
            #get json from request
            data = request.get_json()
            #create a new resource instance
            new_resource = Resources(**data)
            db.session.add(new_resource)
            db.session.commit()
        except:
            return make_response({'message': 'creating the new resource went wrong'}, 422)
        return make_response(new_resource.to_dict(), 201)
    
api.add_resource(CreateNewResource, '/resources')

class Signup(Resource):
    def post(self):
        data = request.get_json()
        #fix this 
        new_user = Users(bio=data.get('bio'), image_url=data.get('image_url'), 
        #password_hash=data.get('password') will execute @password_hash.setter therefore running the encryption that we wrote in models.py
        username=data.get('username') )
        new_user.password_hash=data.get('password')
        try:
            db.session.add(new_user)
            db.session.commit()
            #set session to user_id 
            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 201)
        except Exception as e:
            return make_response({'message': str(e)}, 422)
api.add_resource(Signup, '/signup')

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return make_response(jsonify({'error': 'Email and password required'}), 400)
        
        username = Users.query.filter_by(email=email).first()
        #the authenticae is coming from models
        if username and username.authenticate(data.get('password')):
            session['username_id'] = username.id 
            return make_response(username.to_dict(), 200)
        else:
            return make_response({'message': 'Wrong email or password'}, 401)
api.add_resource(UserLogin, '/login')

class CheckSession(Resource):
    def get(self):
        user_id = session['user_id']
        if user_id:
            cur_user = Users.query.filter_by(id=user_id).first()
            return make_response(cur_user.to_dict(), 200)
        return make_response({'message': 'no one is logged in'}, 200)
api.add_resource(CheckSession, '/check_session')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message': 'user logged out'}, 200)
api.add_resource(Logout, '/logout')


class AllFavorites(Resource):
    def get(self):
       # Get the logged-in user's ID from session
        user_id = session.get('user_id')  # Corrected from 'users_id'
        if not user_id:
            return make_response({'message': 'Unauthorized'}, 401)

        favorites = Favorite.query.filter_by(user_id=user_id).all()
        if not favorites:
            return make_response({"message": "No favorites found for this user"}, 404)
        
        favorite_list = [favorite.to_dict() for favorite in favorites]
        return make_response(favorite_list, 200)

    def post(self):
        # Get the logged-in user's ID from session
        user_id = session.get('user_id') 
        if not user_id:
            return make_response({'message': 'Unauthorized'}, 401)

        try:
            data = request.get_json()
            new_favorite = Favorite(
                resource_id=data['resource_id'],
                user_id=user_id,
                personal_comment=data.get('personal_comment')
            )
            db.session.add(new_favorite)
            db.session.commit()
        except Exception as e:
            return make_response({'message': f'Creating the favorite went wrong: {str(e)}'}, 422)
        
        return make_response(new_favorite.to_dict(), 201)
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

