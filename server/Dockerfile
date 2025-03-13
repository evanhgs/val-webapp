
FROM python:3.9-slim

ENV SECRET_KEY_APP='!CHANGEME!'
ENV SECRET_KEY_JWT='!CHANGEME!'
ENV DB_URI='sqlite:///valenstagram.db'

WORKDIR /server

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

RUN flask db upgrade 

EXPOSE 5000

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]

