from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_bp
from routes.notes_routes import notes_bp
from config import JWT_SECRET

app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:3000"],
    methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True,
)

app.config["JWT_SECRET_KEY"] = JWT_SECRET
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(notes_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
