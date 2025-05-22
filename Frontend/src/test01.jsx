import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: auto;
`;

const DropArea = styled.div`
  border: 2px dashed #ccc;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  background: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  display: inline-block;
`;

const Message = styled.p`
  margin-top: 1rem;
  color: ${props => (props.success ? 'green' : 'red')};
`;

function Test01() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".md")) {
      setSuccess(false);
      setMessage("Only .md files are supported.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
        setMessage("Upload successful!");
      } else {
        setSuccess(false);
        setMessage(result.message || "Upload failed.");
      }
    } catch (err) {
      setSuccess(false);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <Container>
      <h1>Chunk Mate Upload</h1>
      <DropArea>
        <UploadButton htmlFor="fileUpload">Choose Markdown File</UploadButton>
        <FileInput
          id="fileUpload"
          type="file"
          accept=".md"
          onChange={handleFileChange}
        />
        <p>Drag and drop coming soon...</p>
      </DropArea>
      {message && <Message success={success}>{message}</Message>}
    </Container>
  );
}

export default Test01;
