from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests  


# Cargar variables de entorno desde el archivo .env
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(env_path)

# Inicializar Firebase con la clave privada
cred = credentials.Certificate("serviceAccountKey2.json")  
firebase_admin.initialize_app(cred)

# Obtener instancia de Firestore
db = firestore.client()


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

@app.route('/')
def index():
    return 'API para Tablero LED'


# Crear un nuevo usuario en Firebase Authentication
@app.route('/register', methods=['POST'])
def signup():
    try:
        # Asegurar que el contenido es JSON
        if not request.is_json:
            return jsonify({"error": "Content-Type debe ser application/json"}), 415

        data = request.get_json()
        print(f"Datos recibidos en /signup: {data}")  # Imprime los datos recibidos
        
        try:
            email = data['email']
        except KeyError:
            return jsonify({"error": "Falta el campo: email"}), 400
            
        try:
            password = data['password']
        except KeyError:
            return jsonify({"error": "Falta el campo: password"}), 400
            
        nombre = data.get('nombre', '')  # Usa 'nombre' como en tu JSON

        try:
          
            user = auth.create_user(
                email=email,
                password=password,
                display_name=nombre  # Esto guarda el nombre en Auth, no en Firestore
            )
            
            print(f"Usuario creado en Firebase Auth con UID: {user.uid}")

            db.collection('users').document(user.uid).set({
                'email': email,
                'nombre': nombre,
                'created_at': firestore.SERVER_TIMESTAMP
            })
            
            print(f"Usuario guardado en Firestore")

            return jsonify({
                "message": "Usuario registrado exitosamente",
                "uid": user.uid
            }), 201
            
        except auth.EmailAlreadyExistsError:
            return jsonify({"error": "El correo ya está registrado"}), 409
        except auth.InvalidPasswordError:
            return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400
        except auth.InvalidEmailError:
            return jsonify({"error": "El formato de correo electrónico es inválido"}), 400
        except Exception as auth_error:
            print(f"Error al crear usuario en Firebase: {str(auth_error)}")
            return jsonify({"error": f"Error de Firebase: {str(auth_error)}"}), 500

    except Exception as e:
        print(f"Error general en /signup: {str(e)}")
        return jsonify({"error": f"Error interno: {str(e)}"}), 500
    

# Iniciar sesión con Firebase Authentication    
@app.route('/login', methods=['POST'])
def login():
    try:
        # Verificar que el contenido es JSON
        if not request.is_json:
            return jsonify({"error": "Content-Type debe ser application/json"}), 415

        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Validar campos requeridos
        if not email:
            return jsonify({"error": "Falta el campo: email"}), 400
        if not password:
            return jsonify({"error": "Falta el campo: password"}), 400

        # Autenticar con Firebase REST API
        FIREBASE_API_KEY = os.environ.get('API_KEY')
        url = f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}'
        print("API KEY USADA:", os.environ.get('FIREBASE_API_KEY'))
        response = requests.post(url, json={
            'email': email,
            'password': password,
            'returnSecureToken': True
        })

        response_data = response.json()

        # Manejar errores de Firebase
        if response.status_code != 200:
            error_msg = response_data.get('error', {}).get('message', 'Error desconocido')
            
            if error_msg == 'INVALID_LOGIN_CREDENTIALS':
                return jsonify({"error": "Credenciales inválidas"}), 401
            elif error_msg == 'USER_DISABLED':
                return jsonify({"error": "Usuario deshabilitado"}), 403
            else:
                return jsonify({"error": error_msg}), response.status_code

        # Obtener datos adicionales de Firestore
        user_id = response_data['localId']
        user_doc = db.collection('users').document(user_id).get()
        
        return jsonify({
            "message": "Login exitoso",
            "user_id": user_id,
            "email": email,
            "nombre": user_doc.to_dict().get('nombre', '') if user_doc.exists else '',
            "id_token": response_data['idToken']
        }), 200

    except Exception as e:
        print(f"Error en login: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500
    
# autentificación de usuario
def auth_required(f):
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer ' not in auth_header:
            return jsonify({'error': 'Authorization header missing or invalid'}), 401
            
        id_token = auth_header.split('Bearer ')[1]
        
        try:
            decoded_token = auth.verify_id_token(id_token)
            request.uid = decoded_token['uid']
        except:
            return jsonify({'error': 'Invalid or expired token'}), 401
            
        return f(*args, **kwargs)
        
    wrapper.__name__ = f.__name__
    return wrapper



if __name__ == '__main__':
    app.run(debug=True)