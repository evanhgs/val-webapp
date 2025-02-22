# Valenstagram

This app can only deserve an login/register and home page with backend server in Flask with multiple routes like JWT auth, profile informations, login, register and image uploader.
- This project is under heavy development, it's normal if you experiment bugs and issues (i hope the less as possible).

## Start in Local

(Without docker)

### Client 
```bash
cd client 
npm install
npx vite --host
```

### Server 
```bash
cd server 
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run
```

## In app

### Create an user 

In register page you can create an user.
- `http://localhost:5173/register`

### Login 
With same credentials you can log with this user.
- `http://localhost:5173/login` 

### Logout 
Only on client side you can simply click on `LOGOUT` button.

### Routes

Actually working on...

# Start with docker

## Information about frontend & backend

Normally there are two images, the first one is the backend and the second one is the frontend.
NP that the frontend depends about the backend howewer the backend handle a database where stock in the root of the /server. The db is Sqlite3.

## Docker commands

To compile : 
- `docker compose -f 'docker-compose.yaml' up -d --build`

To run the images : 
- `docker start valentanstagram-server`
- `docker start valentanstagram-front`

To stop them : 
- `docker stop valentanstagram-server`
- `docker stop valentanstagram-front`

Check if they are running correctly : 
- `docker ps`

Else you can debug : 

- `docker logs (docker_name)`