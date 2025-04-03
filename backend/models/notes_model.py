from datetime import datetime
import uuid

def create_note(note_title, note_content):
    return {
        "note_id": str(uuid.uuid4()),
        "note_title": note_title,
        "note_content": note_content,
        "last_update": datetime.utcnow(),
        "created_on": datetime.utcnow(),
    }
