
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

### 2. Download the jsons under "jsons" folder and import in local MongoDb app.

### Navigating in the web application
### Start here Luis
## 3. After finishing the login or sign up, it will redirect to "home-logged.html"

- The user can now interact with other users through posts and comments.
- The user can also now create posts.

## 4. Either the user clicks on

### 4a. the icon on the top right to view profile
- It will redirect to profile-posts.html, and you are visiting your own account.
- This contains your bio as well as your posts.

### 4b. username of someone else that posted
- It will redirect to profile-posts.html, and we note that we only have one user at this stage. But in the future, the directory should be the profile of whoever posted under that username.
- It consists of the bio of the user, as well as the posts. By clicking "Comments", it will redirect to profile-comments.html.
	- It contains all the comments of the user. You may go back to profile-posts.html by clicking "Posts".
- To go back to the homepage, simply click "AskAway" that acts as the home button in this website.
### 4c. the title of a post
- If you are the "guest" them you cannot post comments on someone else's account after visiting a post, so the designated html is post-unlogged.html.

- As a user, the html is post-logged.html.

  
```
