import React, { useState } from 'react';
import { uploadPhoto } from '../firebase'; // Ensure the correct import path
import PhotoGallery from './PhotoGallery';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function Advertisement() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected'); // Show error toast if no file is selected
      console.error('No file selected');
      return;
    }

    try {
      const downloadURL = await uploadPhoto(file);
      console.log('Photo uploaded, URL:', downloadURL);
      toast.success('Photo uploaded successfully!'); // Show success toast
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error uploading photo.'); // Show error toast
    }
  };

  return (
    <div className="container">
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
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
