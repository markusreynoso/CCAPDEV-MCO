# CCAPDEV-MCO

Flow of how the website goes and how each html file is used:

1. To start, load home-unlogged.html as starting point
    - home-unlogged.html is the interface for a "guest" or a user that has no account yet in the website.
    - The "guest" can view posts but cannot do any interactions with other users.
    - The "guest" may visit a post, and a profile of another user but no interaction is allowed.

2. The "guest" can either click login or sign up, then it will redirect to <placeholder ng html ni beast>

3. After finishing the login or sign up, it will redirect to "home-logged.html"

    - The user can now interact with other users through posts and comments. 
    - The user can also now create posts.
    
4. Either the user clicks on 
    4a. the icon on the top right to view profile
    4b. username of someone else that posted
    4c. the title of a post

4a. It will redirect to profile-posts.html

    - In this part, you are visiting your own account. 
    - This contains the bio of the user, as well as the posts of the user. 
    - By clicking "Comments", it will redirect to profile-comments.html.
        - It contains all the comments of the user. You may go back to profile-posts.html by clicking "Posts".
    - To go back to the homepage, simply click "AskAway" that acts as the home button in this website.

4b. It will redirect to that someone else's profile. It is structured the same way as 4a.

4c1. If you are the "guest" them you cannot post comments on someone else's account after visiting a post, so the designated html is <placeholder ng html ni remus>. 
4c2. As a user, the html is <placeholder ng html ni remus>.
    