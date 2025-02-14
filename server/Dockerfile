
FROM python:3.9-slim

WORKDIR /server

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

RUN cp .env.test .env || true

RUN flask db upgrade || true 

EXPOSE 5000

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]

