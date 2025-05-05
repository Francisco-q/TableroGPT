from flask import Blueprint, request, jsonify
from database import db
from models import Message
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Bienvenido a la API del Tablero LED',
        'endpoints': {
            'messages': '/api/messages',
            'predefined_messages': '/api/predefined-messages',
            'resend_message': '/api/messages/<id>'
        }
    })

@api.route('/messages', methods=['GET'])
def get_messages():
    messages = Message.query.order_by(Message.timestamp.desc()).all()
    return jsonify([{
        'id': msg.id,
        'text': msg.text,
        'color': msg.color,
        'effect': msg.effect,
        'speed': msg.speed,
        'timestamp': msg.timestamp.isoformat(),
        'status': msg.status,
        'is_predefined': msg.is_predefined
    } for msg in messages])

@api.route('/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    new_message = Message(
        text=data['message'],
        color=data['color'],
        effect=data['effect'],
        speed=data.get('speed', 5),
        is_predefined=data.get('is_predefined', False)
    )
    db.session.add(new_message)
    db.session.commit()
    
    # Enviar al ESP32 (puedes usar WebSocket o HTTP aquí)
    # Por ejemplo, reenviar el mensaje al WebSocket del ESP32
    # send_to_esp32(data)  # Implementar según tu lógica
    
    return jsonify({'message': 'Mensaje guardado y enviado'}), 201

@api.route('/predefined-messages', methods=['GET'])
def get_predefined_messages():
    messages = Message.query.filter_by(is_predefined=True).all()
    return jsonify([{
        'id': msg.id,
        'text': msg.text,
        'color': msg.color,
        'effect': msg.effect,
        'speed': msg.speed,
        'timestamp': msg.timestamp.isoformat(),
        'status': msg.status
    } for msg in messages])

@api.route('/messages/<int:id>', methods=['POST'])
def resend_message(id):
    message = Message.query.get_or_404(id)
    # Reenviar al ESP32
    # send_to_esp32({
    #     'message': message.text,
    #     'color': message.color,
    #     'effect': message.effect,
    #     'speed': message.speed
    # })
    return jsonify({'message': 'Mensaje reenviado'})

def init_routes(app):
    app.register_blueprint(api, url_prefix='/api')