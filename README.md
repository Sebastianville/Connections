### Phase 5 Full-Stack Application Capstone Project

## ConnectingBuddy

## Description 
"ConnectingBuddy" is an app that aims to help college students discover and pinpoint opportunities while building a strong network. The goal is for mentors to share opportunities, such as internships and scholarships, that they completed during their undergrad and allow themselves to be contacted by future mentees. 

## Wire Frame:





![image](https://github.com/user-attachments/assets/1abe6239-7d66-4597-9835-5a9b9f1df886)



## Models: 



![image](https://github.com/user-attachments/assets/80826b12-18b4-4c33-829c-d5e5e1a45968)




## React Tree Diagram: 


![image](https://github.com/user-attachments/assets/218804f7-7dbf-4152-9ee2-a6b49bfa1881)




## Getting Started
To set up a local instance, follow these steps:

Front-end Installation
Clone the repository:

git clone git@github.com:Sebastianville/Connections.git

Change to the root directory:

cd projectify

Install npm packages:

npm install

Move to the front-end directory:

cd client

Install npm packages in the front-end directory:

npm install

Back-end Installation
Make sure you are in the root directory of the project.

Install pipenv and the necessary dependencies:

pipenv install

Activate the virtual environment:

pipenv shell

Databbase Setup
you can create a migration environment by navigating to cd server and following these prompts to create two new directories-- instance and migrations, where app.db will be added to the instance directory.    
    flask db init

    flask db migrate -m "Initial migration."

    flask db upgrade

    python seed.py


## API Routes 

# User Routes
    POST - /users
    GET-/users
    PATCH-/users/:id
    DELETE- /users/:id

# Mentorships Routes
    GET-/mentorships
    POST-/Mentorships

# Resources Routes
    POST- /resources

# Favorites Routes 
    POST(Login-Required)- /favorites
    DELETE(Login-Required)- /favorites/:id

# Login Route
    POST- /login  => curr_user instance (with relationships)

# Check Session Route
    GET- /check_session

# Logout Route
    DELETE(Login_required)-/logout


## Validations and Constraints 
# User
    Required email, username, bio, whether you are a mentor or not, password and password confirmation 
    Password must be at least 6 charachters and it is hash 
    Password and pasword confirmation must match 
    Must be at least 18 years or older 
    Optional- phone number to recieve text message through InfoBip

# Resource
    Required title, link, description, resource type
    Resource type was either a scholarship or inernship 




## Stretch Goals 
Add a linkedin account to the resources
Forgot password login 
Add multiple mentors in one resource 
Send text messages to people who favorite a resource and send reminders of a deadline 




