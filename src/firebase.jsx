// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref as databaseRef, push, set, remove, get, orderByChild, equalTo } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, listAll, deleteObject, ref } from 'firebase/storage';  // Correctly imported 'ref' as 'storageRef' for Storage

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create database and storage references
const database = getDatabase(app);
const storage = getStorage(app);

export { storage };

// Create reference to 'departments' and 'bookings' in the Realtime Database
export const departmentsRef = databaseRef(database, 'departments');
export const bookingsRef = databaseRef(database, 'bookings');

// Export Firebase database functions
export {
  get,
  orderByChild,
  equalTo,
};

// Function to add a new department and return the key
export const addDepartment = async (departmentName) => {
  try {
    const newDepartmentRef = push(departmentsRef); // Create a new department reference
    await set(newDepartmentRef, { name: departmentName, doctors: [] });
    
    return newDepartmentRef.key; // Return the key of the new department
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Propagate error if needed
  }
};

// Function to add a new doctor to a department with working hours
export const addDoctorToDepartment = async (departmentId, doctorName, workingHours) => {
  try {
    const doctorsRef = databaseRef(database, `departments/${departmentId}/doctors`);
    const newDoctorRef = push(doctorsRef);
    await set(newDoctorRef, { name: doctorName, workingHours: workingHours || [] }); // Ensure workingHours is initialized as an array
  } catch (error) {
    console.error("Error adding doctor:", error);
  }
};

// Function to remove a department
export const removeDepartment = async (departmentId) => {
  try {
    await remove(databaseRef(database, `departments/${departmentId}`));
    console.log('Department removed successfully');
  } catch (error) {
    console.error('Error removing department:', error);
  }
};

// Function to remove a doctor from a department
export const removeDoctorFromDepartment = async (departmentId, doctorId) => {
  try {
    await remove(databaseRef(database, `departments/${departmentId}/doctors/${doctorId}`));
    console.log('Doctor removed successfully');
  } catch (error) {
    console.error('Error removing doctor:', error);
  }
};

// Function to add a new appointment
export const addAppointment = async (appointmentData) => {
  try {
    const newAppointmentRef = push(bookingsRef);
    await set(newAppointmentRef, appointmentData);
    console.log('Appointment added successfully');
  } catch (error) {
    console.error('Error adding appointment:', error);
    throw error;
  }
};



export const fetchPhotos = async () => {
  try {
    const storage = getStorage();
    const photosFolderRef = ref(storage, 'photos/'); // Reference to the 'photos' folder

    // List all items (files) in the 'photos/' directory
    const result = await listAll(photosFolderRef);

    // Fetch download URLs for all items
    const photoUrls = await Promise.all(result.items.map(item => getDownloadURL(item)));

    return photoUrls;  // Return the array of URLs
  } catch (error) {
    console.error('Error fetching photos:', error); // Log the error
    throw new Error(`Failed to fetch photos: ${error.code} - ${error.message}`);
  }
};




// Function to upload a photo to Firebase Storage and save its download URL to the database
export const uploadPhoto = async (file) => {
  try {
    if (!file || !file.name) {
      throw new Error('Invalid file object: File name is missing');
    }

    // Create a storage reference using the bucket's path `photos/` directory
    const photoStorageRef = storageRef(storage, `photos/${file.name}`);

    // Upload the file
    await uploadBytes(photoStorageRef, file);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(photoStorageRef);

    // Save the download URL to the Realtime Database
    const photosDatabaseRef = databaseRef(database, 'photos');
    const newPhotoRef = push(photosDatabaseRef);
    await set(newPhotoRef, { url: downloadURL });

    return downloadURL; // Return the download URL
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

// Function to delete a photo from Firebase Storage
export const deletePhoto = async (photoName) => {
  try {
    const photoRef = storageRef(storage, `photos/${photoName}`);
    
    // Delete the photo
    await deleteObject(photoRef);
    
    console.log('Photo deleted successfully:', photoName);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

export default database;
