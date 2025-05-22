from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import markdown
import mysql.connector

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# MySQL connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Kannanvishal2782",
    database="chunkmate",
    autocommit=True
)

# Create tables if not exist
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )
""")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS chunks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        document_id INT,
        content TEXT,
        FOREIGN KEY (document_id) REFERENCES documents(id)
    )
""")
cursor.close()


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"message": "No file part"}), 400

        file = request.files['file']
        if not file.filename.endswith('.md'):
            return jsonify({"message": "Only .md files are supported"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        cursor = conn.cursor()
        cursor.execute("INSERT INTO documents (name) VALUES (%s)", (file.filename,))
        doc_id = cursor.lastrowid

        # Split paragraphs by double newline to get chunks
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
        chunks = []

        for p in paragraphs:
            cursor.execute(
                "INSERT INTO chunks (document_id, content) VALUES (%s, %s)",
                (doc_id, p)
            )
            chunks.append(p)

        cursor.close()

        return jsonify({"chunks": chunks})

    except Exception as e:
        print(f"Error during upload: {e}")
        return jsonify({"message": f"Server error: {str(e)}"}), 500


@app.route('/documents', methods=['GET'])
def get_documents():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM documents")
        documents = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]
        cursor.close()
        return jsonify(documents)
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return jsonify({"message": "Server error"}), 500


@app.route('/chunks/<int:doc_id>', methods=['GET'])
def get_chunks(doc_id):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT content FROM chunks WHERE document_id = %s", (doc_id,))
        chunks = [row[0] for row in cursor.fetchall()]
        cursor.close()
        return jsonify(chunks)
    except Exception as e:
        print(f"Error fetching chunks: {e}")
        return jsonify({"message": "Server error"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
