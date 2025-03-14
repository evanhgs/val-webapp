
FROM python:3.9-slim

ENV FLASK_ENV=production
ENV SECRET_KEY_APP='your_production_secret_key'
ENV SECRET_KEY_JWT='your_production_jwt_key'
ENV DB_URI_PROD='sqlite:///instance/valenstagram.db'

WORKDIR /server

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p instance

EXPOSE 5000

COPY entrypoint.sh . 
RUN chmod +x entrypoint.sh 


CMD ["./entrypoint.sh"]

