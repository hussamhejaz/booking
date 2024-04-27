import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Fetch photos from Firebase Storage
    const fetchPhotos = async () => {
      try {
        const storage = getStorage();
        const photoRefs = await listAll(ref(storage, 'photos'));
        const photoUrls = await Promise.all(photoRefs.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        }));
        setPhotos(photoUrls);
      } catch (error) {
        console.error('Error fetching photos:', error);
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
      // console.log('Photo deleted successfully:', photoName);
    } catch (error) {
      console.error('Error removing photo:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-3">Photo Gallery</h2>
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
