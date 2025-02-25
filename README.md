
# CCAPDEV-MCO
The website is intuitive since it uses a similar layout to Reddit and Facebook, and the features are standard. But in any case, this is the flow of how the website goes and how each html file is used:

  
## 1. Start with load home-unlogged.html as starting point

- home-unlogged.html is the interface for a "guest" or a user that has no account yet in the website.

- The "guest" can view posts but cannot do any interactions with other users.

- The "guest" may visit a post, and a profile of another user but no interaction is allowed.

  

## 2. The "guest" can either click login or sign up, then it will redirect to verify-login.html pr verify-register.html

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