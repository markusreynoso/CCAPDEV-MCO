
# CCAPDEV-MCO
The website is intuitive since it uses a similar layout to Reddit and Facebook, and the features are standard. But in any case, this is the flow of how the website goes and how each html file is used:

Two starting options:
## First option
### 1. Deploy the server
- Open render.io using Luis's account, then click Ask-Away, then manual deploy.

### 1.1. Open Atlas to check the database (optional)

## Second option
### 1. Local access
- After downloading the zipped file, simply open the project
- Use these install commands
Install Command:
npm init -y
npm i express express-handlebars body-parser mongoose mongodb bcrypt
- type "node app.js"

### Navigating in the web application

### 1. You will start by the unlogged home page

- The user can view posts.
- They can also view its comments by clicking on the post title.
- Searching the content of a post is also accessible by the search bar.

### 2. Login or Register

#### 2a. Login
- The user can login to any of the following usernames:
- ['LuisDaBeast','chinitaLover3000','manaloto','Thomas_morato','garybee69','cardi_dalisay','wowtik','zacktambucho','binilanggo','doracktheexplorer']
- All accounts have the same password: Password1!asd

#### 2b. Register
- The user should create a new username and password with the following requirements
	- Username: 5-20 characters, unique
	- Password: 10-20 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol
- It will also give the user the option to redirect into the login page if their account already exists 
- After typing the confirmed password and clicking the "Register" button, it will automatically log into the newly created account

### 3. Home Page
- The user now has full access to all features
- They may now post, upvote, downvote, comment, and reply
- Clicking on the profile picture will direct to your account's posts and comments
	- They may also edit account features such as their username, password, profile picture, and bio
	- The "Logout" button may also be found here
- Clicking on the website's logo will direct the user to the home page 

  
```
