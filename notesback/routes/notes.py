from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import Note, Tag
from app import db
from datetime import datetime

bp = Blueprint('notes', __name__)

@bp.route('/notes', methods=['GET', 'OPTIONS'])
@jwt_required()
@cross_origin(supports_credentials=True)
def get_notes():
    if request.method == 'OPTIONS':
        return '', 200
    user_id = get_jwt_identity()
    tag_filter = request.args.get('tag')
    if tag_filter:
        notes = Note.query.filter(Note.user_id == user_id, Note.tags.any(name=tag_filter), Note.is_deleted == False).all()
    else:
        notes = Note.query.filter_by(user_id=user_id, is_deleted=False).all()
    return jsonify([note.to_dict() for note in notes])

@bp.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({"error": "Missing title or content"}), 400
    
    new_note = Note(
        user_id=user_id,
        title=data['title'],
        content=data['content'],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    tag_names = data.get('tags', [])
    for tag_name in tag_names:
        tag = Tag.query.filter_by(name=tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.session.add(tag)
        new_note.tags.append(tag)
    
    db.session.add(new_note)
    db.session.commit()
    
    return jsonify(new_note.to_dict()), 201

@bp.route('/notes/<int:note_id>', methods=['GET'])
@jwt_required()
def get_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id, is_deleted=False).first_or_404()
    return jsonify(note.to_dict())

@bp.route('/notes/<int:note_id>', methods=['PUT'])
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
    
    try:
        db.session.commit()
        print(f"Note {note_id} updated successfully")
        return jsonify(note.to_dict())
    except Exception as e:
        db.session.rollback()
        print(f"Error updating note {note_id}: {str(e)}")
        return jsonify({"error": "Failed to update note"}), 500

@bp.route('/notes/<int:note_id>', methods=['DELETE'])
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