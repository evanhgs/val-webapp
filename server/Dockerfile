FROM python:3.11-slim
WORKDIR /server
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY .env.test .env
EXPOSE 5000
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
