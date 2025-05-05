# backend/app.py
from flask import Flask
from flask_cors import CORS
from database import db, init_db
from routes import init_routes
from models import Message
from datetime import datetime

app = Flask(__name__)
CORS(app)

init_db(app)
init_routes(app)

def init_predefined_messages():
    if not Message.query.filter_by(is_predefined=True).first():
        predefined = [
            {'text': 'No estoy', 'color': 'red', 'effect': 'scroll', 'speed': 5, 'is_predefined': True},
            {'text': 'Vuelvo mañana', 'color': 'green', 'effect': 'blink', 'speed': 5, 'is_predefined': True},
            {'text': 'En clases', 'color': 'blue', 'effect': 'static', 'speed': 5, 'is_predefined': True},
        ]
        for msg in predefined:
            db.session.add(Message(**msg))
        db.session.commit()
        print("Mensajes predefinidos inicializados.")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        init_predefined_messages()
    app.run(debug=True, host='0.0.0.0', port=5000)