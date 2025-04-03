from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["notesapp"]
users_collection = db["users"]
notes_collection = db["notes"]
