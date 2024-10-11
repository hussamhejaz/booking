import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch photos from Firebase Storage
    const fetchPhotos = async () => {
      try {
        const storage = getStorage();
        const photoRefs = await listAll(ref(storage, 'photos/')); // Reference to the 'photos/' folder
        const photoUrls = await Promise.all(photoRefs.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        }));
        setPhotos(photoUrls);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError('Error fetching photos.');
      }
    };

    fetchPhotos();
  }, []);

  const handleRemovePhoto = async (photoName) => {
    try {
      const storage = getStorage();
      const photoRef = ref(storage, `photos/${photoName}`);
      await deleteObject(photoRef);

      // Update the photos state after successful deletion
      setPhotos(photos.filter(photo => photo.name !== photoName));
      toast.success('Photo deleted successfully!'); // Show success toast
      console.log('Photo deleted successfully:', photoName);
    } catch (err) {
      console.error('Error removing photo:', err);
      setError('Error removing photo.');
      toast.error('Failed to remove photo.'); // Show error toast
    }
  };

  return (
    <div className="container">
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <h2 className="mt-4 mb-3">Photo Gallery</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {photos.map((photo, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <img src={photo.url} className="card-img-top" alt="" style={{ objectFit: 'cover', height: '200px' }} />
              <div className="card-body">
                <button className="btn btn-danger" onClick={() => handleRemovePhoto(photo.name)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
