import React, { useState } from 'react';
import { uploadPhoto } from '../firebase'; // Ensure correct import path
import PhotoGallery from './PhotoGallery';

function Advertisement() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    try {
      const downloadURL = await uploadPhoto(file);
      console.log('Photo uploaded, URL:', downloadURL);
      // You can use the download URL as needed, such as displaying it on the UI
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Upload Photo</h2>
      <div className="row">
        <div className="col-md-6">
          <input type="file" className="form-control" onChange={handleFileChange} />
        </div>
        <div className="col-md-6">
          <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
        </div>
      </div>
      <hr />
      <PhotoGallery />
    </div>
  );
}

export default Advertisement;
