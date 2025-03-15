# This file is designed for developer to test the API

## Define Major Route Categories

The routes are divided into logical modules for better organization:

- **Authentication (auth)**: login, registration, logout, token management.
- **Users (users)**: profile, information modification, follow/unfollow.
- **Posts (posts)**: create, edit, delete posts, retrieve posts.
- **Comments (comments)**: add, delete comments on a post.
- **Likes (likes)**: manage likes (add, remove).
- **Messages (messages)**: send, receive private messages.
- **Notifications (notifications)**: manage alerts for likes, comments, messages, etc.

## Auth API

### Register

`POST : http://127.0.0.1:5000/auth/register`

```json
{
    "username" : "test",
    "email" : "test@gmail.com",
    "password" : "password"
}
```

It returns code **201** :

```json
{
    "message": "account created successfully."
}
```

### Login

`POST : http://127.0.0.1:5000/auth/login`

```json
{
    "username" : "test",
    "password" : "password"
}
```

It returns code **200** :

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRkYzcwNDEzLTEwOTQtNGY4Zi04Y2ZhLTg3YzhlYzkzMDNlYSIsImV4cCI6MTc0MDE2NjA4OX0.zc2DpJ8J07vy6WPZNeOkmc26dnLfZQQwSbuodxwss5s"
}
```

## User API

### Profile

`POST : http://127.0.0.1:5000/user/profile`

In header, you need to add `Authorization` (OAuth 2.0) with the HS256 algo get from login.`

It returns code **200** :

```json
{
    "bio": null,
    "created_at": "Fri, 21 Feb 2025 18:16:21 GMT",
    "email": "test@gmail.com",
    "profile_picture": "default.jpg",
    "username": "test",
    "website": null,
    "gender": null
}
```

### Update Profile

`POST : http://127.0.0.1:5000/user/edit-profile`

```json
{
    "username" : "test2"
    "bio" : "I am a developer"
}
```

It returns code **200** :

```json
{
    "message": "Profile updated successfully",
    "user": {
        "bio": "I am a developer",
        "email": "test@gmail.com",
        "id": "28ff42af-b87c-4e4c-8051-3365547674d2",
        "username": "test2",
        "website": null,
        "gender": null
    }
}
```

### Upload Profile Picture

`POST : http://127.0.0.1:5000/user/upload-profile-picture`

With `Content-Type` as `multipart/form-data`
And `Authorization` (OAuth 2.0) with the HS256 algo get from login.

```json
const formData = new FormData(); 
formData.append("file", file);
{ }
```

It returns code **200** :

```json
{
    "file_url": "/user/profile-picture/amazing_picture.jpg",
    "message": "File uploaded successfully"
}
```

### Get profile picture from path

`GET http://127.0.0.1:5000/user/profile-picture/<filename>`

`<filename>` is the name of the picture you want to get.

It returns code **200** and the media of the filename.:

![example picture](/server/public/uploads/default.jpg)

*Example of a picture when you search /default.jpg*

### Follow a user

`GET / POST :  http://127.0.0.1:5000/user/follow`

In header, you need to add `Authorization` (OAuth 2.0) with the HS256 algo get from login.

```json
{
   "username_other" : "test2"
}
```

It returns code **200** :

```json
{
    "follow": {
        "created_at": "Sun, 09 Mar 2025 01:17:17 GMT",
        "follow_id": "28ff42af-b87c-4e4c-8051-3365547674d2",
        "followed_id": "5c46a94e-c991-46ab-b14b-3f98fb220879",
        "id": "136f869b-344c-4c11-a1b1-149b15dae898"
    },
    "message": "Followed successfully"
}
```

### Unfollow a user

`GET / POST :  http://127.0.0.1:5000/user/unfollow`

In header, you need to add `Authorization` (OAuth 2.0) with the HS256 algo get from login.

```json
{
   "username_other" : "test2"
}
```

It returns code **200** :

```json
{
    "message": "Unfollow successfully",
    "users": {
        "ex-followed-id": "5c46a94e-c991-46ab-b14b-3f98fb220879",
        "ex-follower-id": "28ff42af-b87c-4e4c-8051-3365547674d2"
    }
}
```

### Delete a follower

`GET / POST : http://127.0.0.1:5000/user/remove-follower/`

In header, you need to add `Authorization` (OAuth 2.0) with the HS256 algo get from login.

```json
{
   "username_other" : "test"
}
```

It returns code **200** :

```json
{
    "message": "Delete follow relation successfully",
    "users": {
        "ex-followed-id": "5c46a94e-c991-46ab-b14b-3f98fb220879",
        "ex-follower-id": "28ff42af-b87c-4e4c-8051-3365547674d2"
    }
}
```

### Get followers of an user

`GET / POST : http://127.0.0.1:5000/user/get-follow/<username>`

Switch `<username>` with the id of the user you want to get the followers.

It returns code **200** :

```json
{
    "count": 1,
    "followers": [
        {
            "followed_at": "2025-03-12T22:04:20.106989",
            "id": "28ff42af-b87c-4e4c-8051-3365547674d2",
            "profile_picture": "cesar-couto-VlThqxlFaE0-unsplash.jpg",
            "username": "test"
        }
    ]
}
```

### Get followed of an user

`GET / POST : http://127.0.0.1:5000/user/get-followed/<username>`

Switch `<username>` with the id of the user you want to get the followers.

It returns code **200** :

```json
{
    "count": 1,
    "followed": [
        {
            "followed_at": "2025-03-12T22:04:20.106989",
            "id": "5c46a94e-c991-46ab-b14b-3f98fb220879",
            "profile_picture": "colin-watts-4mdlRYKQiDc-unsplash.jpg",
            "username": "test2"
        }
    ]
}
```
