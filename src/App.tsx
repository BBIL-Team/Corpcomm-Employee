import React, { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

function App() {
    const { signOut } = useAuthenticator();
const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://siehe3sl94.execute-api.ap-south-1.amazonaws.com/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <h1>BBIL Production Department - Data Upload Interface</h1>
        <button style={{ marginLeft: 'auto' }} onClick={signOut}>Sign out</button>
      <form onSubmit={handleSubmit}>
        <label><strong>Select a CSV file to upload:</strong></label>
        <br /><br />
        <input 
          type="file" 
          name="file" 
          accept=".csv" 
          onChange={handleFileChange} 
        />
        <br /><br />
        <button 
          type="submit" 
          style={{ backgroundColor: "black", color: "white", width: "150px", height: "40px" }}
        >
          Upload CSV File
        </button>
      </form>
    </div>
  );
};

export default App;
