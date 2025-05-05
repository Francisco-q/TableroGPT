from database import db
from datetime import datetime

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(20), nullable=False)
    effect = db.Column(db.String(20), nullable=False)
    speed = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='success')
    is_predefined = db.Column(db.Boolean, default=False)  # Para distinguir mensajes predefinidos