from datetime import datetime
import uuid

def create_user(user_name, user_email, password_hash):
    return {
        "user_id": str(uuid.uuid4()),
        "user_name": user_name,
        "user_email": user_email,
        "password": password_hash,
        "last_update": datetime.utcnow(),
        "created_on": datetime.utcnow(),
    }
