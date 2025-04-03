from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import notes_collection
from models.notes_model import create_note
from datetime import datetime

notes_bp = Blueprint("notes", __name__)

@notes_bp.route("/notes", methods=["POST"])
# @jwt_required()
def add_note():
    data = request.get_json()
    note_title = data.get("note_title")
    note_content = data.get("note_content")

    new_note = create_note(note_title, note_content)
    notes_collection.insert_one(new_note)

    return jsonify({"message": "Note created successfully"}), 201

@notes_bp.route("/notes", methods=["GET"])
# @jwt_required()
def get_notes():
    notes = list(notes_collection.find({}, {"_id": 0}))
    return jsonify(notes), 200

@notes_bp.route("/notes/<note_id>", methods=["PUT"])
# @jwt_required()
def update_note(note_id):
    data = request.get_json()
    notes_collection.update_one(
        {"note_id": note_id},
        {"$set": {"note_title": data["note_title"], "note_content": data["note_content"], "last_update": datetime.utcnow()}}
    )
    return jsonify({"message": "Note updated successfully"}), 200

@notes_bp.route("/notes/<note_id>", methods=["DELETE"])
# @jwt_required()
def delete_note(note_id):
    notes_collection.delete_one({"note_id": note_id})
    return jsonify({"message": "Note deleted successfully"}), 200
