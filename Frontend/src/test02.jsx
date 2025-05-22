import { useState } from "react";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #f4f4f4;
  padding: 1rem;
  overflow-y: auto;
`;

const Main = styled.div`
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const DocumentItem = styled.div`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: ${props => (props.selected ? "#ddd" : "#fff")};
  border: 1px solid #ccc;
  cursor: pointer;
`;

const UploadButton = styled.label`
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  display: inline-block;
  margin-top: 1rem;
`;

const FileInput = styled.input`
  display: none;
`;

const Chunk = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  background: ${props => (props.selected ? "#e0ffe0" : "#fff")};
`;

function Test02() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [selectedChunkIndex, setSelectedChunkIndex] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".md")) return alert("Only .md files are supported.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        const newDoc = {
          name: file.name,
          chunks: result.chunks,
        };
        setDocuments([...documents, newDoc]);
        alert("Upload successful!");
        setSelectedDocIndex(documents.length);
        setChunks(result.chunks);
        setSelectedChunkIndex(null);
      } else {
        alert(result.message || "Upload failed.");
      }
    } catch {
      alert("Server error. Please try again later.");
    }
  };

  const handleSelectDocument = (index) => {
    setSelectedDocIndex(index);
    setChunks(documents[index].chunks);
    setSelectedChunkIndex(null);
  };

  return (
    <Layout>
      <Sidebar>
        <h2>Documents</h2>
        {documents.map((doc, index) => (
          <DocumentItem
            key={index}
            onClick={() => handleSelectDocument(index)}
            selected={index === selectedDocIndex}
          >
            {doc.name}
          </DocumentItem>
        ))}
        <UploadButton htmlFor="fileUpload">Upload</UploadButton>
        <FileInput
          id="fileUpload"
          type="file"
          accept=".md"
          onChange={handleFileChange}
        />
      </Sidebar>

      <Main>
        <h1>Chunks</h1>
        {chunks.map((chunk, index) => (
          <Chunk
            key={index}
            onClick={() => setSelectedChunkIndex(index)}
            selected={index === selectedChunkIndex}
          >
            <strong>Chunk {index + 1}</strong>
            <pre>{chunk}</pre>
          </Chunk>
        ))}
      </Main>
    </Layout>
  );
}

export default Test02;