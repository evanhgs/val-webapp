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

`http://127.0.0.1:5000/auth/register`

```bash
{
    "username" : "test",
    "email" : "test@gmail.com",
    "password" : "password"
}
```

It returns code **201** :

```bash
{
    "message": "account created successfully."
}
```

### Login

`http://127.0.0.1:5000/auth/login`

```bash
{
    "username" : "test",
    "password" : "password"
}
```

It returns code **200** :

```bash
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRkYzcwNDEzLTEwOTQtNGY4Zi04Y2ZhLTg3YzhlYzkzMDNlYSIsImV4cCI6MTc0MDE2NjA4OX0.zc2DpJ8J07vy6WPZNeOkmc26dnLfZQQwSbuodxwss5s"
}
```

## User API

### Profile

`http://127.0.0.1:5000/user/profile`

In header, you need to add `Authorization` with the token you get from login.`

It returns code **200** :

```bash
{
    "bio": null,
    "created_at": "Fri, 21 Feb 2025 18:16:21 GMT",
    "email": "test@gmail.com",
    "profile_picture": "default.jpg",
    "username": "test"
}
```

### Update Profile

`http://127.0.0.1:5000/user/edit-profile`

### Upload Profile Picture

`http://127.0.0.1:5000/user/upload-profile-picture`
