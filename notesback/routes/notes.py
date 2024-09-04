from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import Note, Tag
from app import db
from datetime import datetime

notes_bp = Blueprint('notes', __name__)

@notes_bp.route('/api/tags', methods=['OPTIONS', 'GET'])
@cross_origin(supports_credentials=True)
def handle_tags():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
        return response
    elif request.method == 'GET':
        try:
            user_id = get_jwt_identity()
            tags = Tag.query.join(Note.tags).filter(Note.user_id == user_id).distinct().all()
            return jsonify([tag.name for tag in tags])
        except RuntimeError:
            # If there's no valid JWT, return an empty list or an appropriate response
            return jsonify([])

@notes_bp.route('/api/notes', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def handle_notes():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response
    
    # For all other methods, require JWT
    @jwt_required()
    def protected_notes():
        user_id = get_jwt_identity()
        
        if request.method == 'GET':
            tag_filter = request.args.get('tag')
            if tag_filter:
                notes = Note.query.filter(Note.user_id == user_id, Note.tags.any(name=tag_filter), Note.is_deleted == False).all()
            else:
                notes = Note.query.filter_by(user_id=user_id, is_deleted=False).all()
            return jsonify([note.to_dict() for note in notes])
        
        elif request.method == 'POST':
            # Your existing POST logic here
            pass
        
        elif request.method == 'PUT':
            # Your existing PUT logic here
            pass
        
        elif request.method == 'DELETE':
            # Your existing DELETE logic here
            pass

    return protected_notes()

@notes_bp.route('/api/notes/<int:note_id>', methods=['GET'])
@jwt_required()
def get_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id, is_deleted=False).first_or_404()
    return jsonify(note.to_dict())

@notes_bp.route('/api/notes/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    user_id = get_jwt_identity()
    print(f"Attempting to update note {note_id} for user {user_id}")
    note = Note.query.filter_by(id=note_id, user_id=user_id, is_deleted=False).first()
    if note is None:
        print(f"Note {note_id} not found for user {user_id}")
        return jsonify({"error": "Note not found"}), 404
    
    data = request.get_json()
    print(f"Received data for update: {data}")
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    note.title = data.get('title', note.title)
    note.content = data.get('content', note.content)
    note.updated_at = db.func.now()
    
    # Update tags
    if 'tags' in data:
        new_tags = []
        print(f"Received tags for update: {data['tags']}")  # Debugging line
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            new_tags.append(tag)
        note.tags = new_tags
        print(f"Tags to be saved: {[tag.name for tag in note.tags]}")  # Debugging line
    
    db.session.commit()
    return jsonify(note.to_dict())

@notes_bp.route('/api/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    user_id = get_jwt_identity()
    print(f"Attempting to delete note {note_id} for user {user_id}")
    
    note = Note.query.filter_by(id=note_id, user_id=user_id, is_deleted=False).first()
    
    if note is None:
        print(f"Note {note_id} not found for user {user_id}")
        return jsonify({"error": "Note not found"}), 404
    
    try:
        note.is_deleted = True
        db.session.commit()
        print(f"Note {note_id} successfully marked as deleted")
        return '', 204
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting note {note_id}: {str(e)}")
        return jsonify({"error": "Failed to delete note"}), 500

@notes_bp.route('/api/search', methods=['GET'])
@jwt_required()
def search_notes():
    query = request.args.get('q', '')
    user_id = get_jwt_identity()
    
    notes = Note.query.filter(
        Note.user_id == user_id,
        Note.is_deleted == False,
        (Note.title.ilike(f'%{query}%') | Note.content.ilike(f'%{query}%'))
    ).all()
    
    return jsonify([note.to_dict() for note in notes])