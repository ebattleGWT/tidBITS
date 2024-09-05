from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import User
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"message": "Missing username or password"}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid username or password"}), 401

@auth_bp.route('/api/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing username, email, or password"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400

    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    
    try:
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while registering the user"}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a real-world scenario, you might want to blacklist the token here
    return jsonify({"msg": "Successfully logged out"}), 200

@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "username": user.username, "email": user.email} for user in users]), 200