import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const PhotoSlider = () => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const storage = getStorage();
        const storageRef = ref(storage, 'photos'); // Assuming 'photos' is your storage reference

        const fetchPhotos = async () => {
            try {
                const res = await listAll(storageRef);
                const urlsPromises = res.items.map(async (item) => {
                    return await getDownloadURL(item);
                });
                const urls = await Promise.all(urlsPromises);
                setPhotos(urls);
            } catch (error) {
                console.error('Error fetching photos from storage:', error);
            }
        };

        fetchPhotos();
    }, []); // Fetch photos only once when component mounts

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            {photos.length > 1 ? (
                <Slider {...settings}>
                    {photos.map((photoUrl, index) => (
                        <div key={index}>
                            <img src={photoUrl} alt="" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                        </div>
                    ))}
                </Slider>
            ) : photos.length === 1 ? (
                <img src={photos[0]} alt="" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            ) : (
                <p>No photos available.</p> // Optional: Handle case when there are no photos
            )}
        </div>
    );
};

export default PhotoSlider;
