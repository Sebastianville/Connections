from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property 

from config import db, bcrypt


class Users(db.Model, SerializerMixin):
    __tablename__ =  'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    cover_photo = db.Column(db.String)
    bio = db.Column(db.String)
    birthdate = db.Column(db.Date, nullable=False)
    is_mentor = db.Column(db.Boolean, default=False)

    favorites = db.relationship('Favorite', back_populates='user', cascade='all, delete-orphan')
    mentorships = db.relationship("Mentorships", back_populates='users')

    serialize_rules = ('-favorites.user', '-mentorships.users')
    serialize_only = ('id', 'username', 'email', 'bio', 'created_at', 'birthdate')  

    @validates("username")
    def validate_username(self, key, username):
        if not username:
            raise ValueError("username needs to be provided")
        return username
    
    @validates('birthdate')
    def validate_age(self, key, birthdate):
        today = datetime.today()
        #Calculating the year difference and whether the birthday has occured yet in the current year. The today.month and beyond will yield to either True(1) or False (0) depednet upon if today is before the perosn's birthday this year
        age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
        if age < 18:
            raise ValueError('User must be over 18 years old')
        return birthdate
    
    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError("Email is required")
        if '@' not in email:
            raise ValueError("Must provide a valid email address")
        return email
    
    #This will allow us to set password_hash directly inside the sqlite database. 
    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")
    
    @password_hash.setter 
    def password_hash(self,password):
        #generate_passwoord_hash is a boiler plate(a built in) method that is given to us by bycrpt that encrypts plaintext 
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        #the decode will make the password shorter in the database 
        # Hash the password and store it
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        #using a built in bcrypt method. This returns True or False
        # Check if the provided password matches the hashed password
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def __init__(self, username, email, password, birthdate, cover_photo=None, bio=None, is_mentor=False):
        self.username = username
        self.email = email
        self.password_hash = password  # Hash the password
        self.birthdate = birthdate
        self.cover_photo = cover_photo
        self.bio = bio
        self.is_mentor = is_mentor
    
    def __repr__(self):
        return f"<Users {self.id}, {self.username}, {self.birthdate}>"
    
class Favorite(db.Model, SerializerMixin):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    personal_comment = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('Users', back_populates='favorites')
    resources = db.relationship('Resources', back_populates='favorites')

    serialize_rules = ('-user.favorites', '-resources.favorites')
    serialize_only = ('id','resource_id', 'user_id', 'created_at', 'personal_comment')

    def __repr__(self):
        return f"<Favorite {self.id}, {self.personal_comment}, {self.user_id}>"


class Resources(db.Model, SerializerMixin):
    __tablename__ = "resources"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    title = db.Column(db.String, unique=True, nullable=False)
    link = db.Column(db.String, unique=True, nullable=False)
    resource_type = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    favorites = db.relationship('Favorite', back_populates='resources', cascade='all, delete-orphan')
    mentorships = db.relationship('Mentorships', back_populates='resources')

    serialize_rules = ('-favorites.resources', '-mentorships.resources')
    serialize_only = ('id', 'description', 'title', 'link', 'resource_type', 'created_at')  



    @validates('title')
    def validate_title(self, key, title):
        if not title: 
            raise ValueError("Title is required")
        if Resources.query.filter(Resources.title == title).first():
            raise AssertionError("Resoruce is already in use")
        return title 
    
    @validates('link')
    def validate_link(self, key, link):
        if not link: 
            raise ValueError("A link is required")
        return link
    
    @validates('description')
    def validate_description(self, key, description):
        if not description: 
            raise ValueError("A description is required")
        return description

    @validates('resource_type')
    def validate_resource_type(self, key, resource_type):
        if resource_type not in ['scholarship', 'internship']:  # Specify allowed values
            raise ValueError("resource_type must be 'scholarship' or 'internship'")
        return resource_type


    def __repr__(self):
        return f"<Resources {self.id}, {self.description}, {self.title}>"

class Mentorships(db.Model, SerializerMixin):
    __tablename__ = "mentorship"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)
    completed_the_event = db.Column(db.DateTime, nullable=False)
    summary = db.Column(db.String, nullable=False)
    alternate_email = db.Column(db.String)

    resources = db.relationship('Resources', back_populates='mentorships')
    users = db.relationship("Users", back_populates='mentorships')


    serialize_rules = ('-resources.mentorships', '-users.mentorships')
    serialize_only = ('id', 'user_id', 'resource_id', 'completed_the_event', 'summary', 'alternate_email')  
   
    @validates('user_id')
    def validate_user_id(self, key, user_id):
        user = Users.query.get(user_id)
        if user is None or not user.is_mentor:
            raise ValueError("The user must be a mentor.")
        return user_id
    
    def __repr__(self):
        return f"<Mentorships {self.id}, {self.summary}, {self.alternate_email}>"