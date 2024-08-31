from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import User
from app import db

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def login():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"message": "Missing username or password"}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid username or password"}), 401

@bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def register():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    data = request.get_json()
    current_app.logger.info(f"Registration attempt for username: {data.get('username')}, email: {data.get('email')}")

    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        current_app.logger.warning("Missing username, email, or password in registration request")
        return jsonify({"message": "Missing username, email, or password"}), 400

    if User.query.filter_by(username=data['username']).first():
        current_app.logger.warning(f"Username already exists: {data['username']}")
        return jsonify({"message": "Username already exists"}), 400

    if User.query.filter_by(email=data['email']).first():
        current_app.logger.warning(f"Email already exists: {data['email']}")
        return jsonify({"message": "Email already exists"}), 400

    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    
    try:
        db.session.commit()
        current_app.logger.info(f"User registered successfully: {data['username']}")
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error registering user: {str(e)}")
        return jsonify({"message": "An error occurred while registering the user"}), 500

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a real-world scenario, you might want to blacklist the token here
    return jsonify({"msg": "Successfully logged out"}), 200

@bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "username": user.username, "email": user.email} for user in users]), 200