import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  // Fetch the list of uploaded files
  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/files");
      setUploadedFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("File uploaded successfully!");
      setSelectedFile(null);
      fetchFiles(); // Refresh file list
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Handle file download
  const handleDownload = (fileName) => {
    const fileUrl = `http://localhost:5000/download/${fileName}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h2>File Upload System</h2>

      <div className="dropzone">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <h3>Uploaded Files</h3>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            {file} <button onClick={() => handleDownload(file)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
