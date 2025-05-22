# Chunk Mate - Backend

This is the backend server for **Chunk Mate**, a document processing tool that allows users to upload Markdown files, which are then chunked into meaningful blocks such as paragraphs, table rows, and extracted links.

Built with **Python (Flask)** and **MySQL**.

---

## 📦 Features

- Upload and process `.md` files
- Chunk content by:
  - Paragraphs with repeated headings/subheadings (context preservation)
  - Table rows with headers
  - Extracted hyperlinks
- Store all data in MySQL
- API endpoints for:
  - Uploading documents
  - Viewing uploaded documents
  - Retrieving associated chunks

---

## 🛠️ Tech Stack

- **Flask** – Python web framework
- **MySQL** – Relational database
- **Flask-CORS** – Cross-Origin support for frontend requests

---

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/vishal-kannan/Chunk-Mate.git
cd Chunk-Mate/backend

## Install dependencies

pip install -r requirements.txt

## Configure MySQL Connection

conn = mysql.connector.connect(
    host="your-host-name",
    user="your-username",
    password="your-password",
    database="chunkmate"
)

## Run the Flask server

python app.py
The server will start on: http://localhost:5000

## API Endpoints

| Method | Endpoint                | Description                        |
| ------ | ----------------------- | ---------------------------------- |
| POST   | `/upload`               | Upload and chunk a Markdown file   |
| GET    | `/documents`            | List all uploaded documents        |
| GET    | `/chunks/<document_id>` | Get chunks for a given document ID |

## Folder Structure

backend/
├── uploads/           # Uploaded .md files stored here
├── app.py             # Main Flask application
├── requirements.txt   # Python dependencies
└── README.md
