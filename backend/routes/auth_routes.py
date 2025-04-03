from flask import Blueprint, request, jsonify
from db import users_collection
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from utils.auth_utils import validate_email
import datetime
import uuid

bcrypt = Bcrypt()
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user_name = data.get("user_name")
    user_email = data.get("user_email")
    password = data.get("password")

    if not validate_email(user_email):
        return jsonify({"error": "Invalid email format"}), 400

    if users_collection.find_one({"user_email": user_email}):
        return jsonify({"error": "Email already exists"}), 409

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    user = {
        "user_id": str(uuid.uuid4()),
        "user_name": user_name,
        "user_email": user_email,
        "password": password_hash,
        "last_update": datetime.datetime.utcnow(),
        "created_on": datetime.datetime.utcnow(),
    }

    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully", "success": True}), 200

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user_email = data.get("user_email")
    password = data.get("password")

    user = users_collection.find_one({"user_email": user_email})
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=user_email, expires_delta=datetime.timedelta(days=1))
    return jsonify({"token": token, "user_id": user["user_id"], "success": True}), 200
