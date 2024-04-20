// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, remove, get, orderByChild, equalTo } from "firebase/database";
import { getStorage,  uploadBytes, getDownloadURL,  } from 'firebase/storage';
import {  ref as storageRef,  deleteObject } from "firebase/storage";
import { ref as databaseRef } from "firebase/database";

 // Import getDatabase function



// Your web app's Firebase configuration
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

// Create database reference
const database = getDatabase(app);
const storage = getStorage();

export { storage };

// Create reference to 'departments' and 'appointments'
export const departmentsRef = ref(database, 'departments');
export const bookingsRef = ref(database, 'bookings');

// Export Firebase database functions
export {
  get,
  orderByChild,
  equalTo,
};

// Function to add a new department
export const addDepartment = async (departmentName) => {
  try {
    const newDepartmentRef = push(departmentsRef);
    await set(newDepartmentRef, { name: departmentName, doctors: [] });
  } catch (error) {
    console.error("Error adding department:", error);
  }
};

// Function to add a new doctor to a department
// Function to add a new doctor to a department with working hours
export const addDoctorToDepartment = async (departmentId, doctorName, workingHours) => {
  try {
    const doctorsRef = ref(database, `departments/${departmentId}/doctors`);
    const newDoctorRef = push(doctorsRef);
    await set(newDoctorRef, { name: doctorName, workingHours: workingHours || [] }); // Ensure workingHours is initialized as an array
  } catch (error) {
    console.error("Error adding doctor:", error);
  }
};


// Function to remove a department
export const removeDepartment = async (departmentId) => {
  try {
    await remove(ref(database, `departments/${departmentId}`));
    console.log('Department removed successfully');
  } catch (error) {
    console.error('Error removing department:', error);
  }
};

// Function to remove a doctor from a department
export const removeDoctorFromDepartment = async (departmentId, doctorId) => {
  try {
    await remove(ref(database, `departments/${departmentId}/doctors/${doctorId}`));
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

// Function to update working hours for a doctor
// Function to upload a photo to Firebase Storage and save its download URL to the database
export const uploadPhoto = async (file) => {
  try {
    // Check if the file object is defined
    if (!file || !file.name) {
      throw new Error('Invalid file object: File name is missing');
    }

    // Get a reference to the storage service
    const storage = getStorage();

    // Create a storage reference from our storage service
    const photoStorageRef = storageRef(storage, `photos/${file.name}`);

    // Upload file to Firebase Storage
    await uploadBytes(photoStorageRef, file);

    // Get download URL of the uploaded file
    const downloadURL = await getDownloadURL(photoStorageRef);

    // Now let's save the download URL to the database
    const photosDatabaseRef = databaseRef(database, 'photos');
    const newPhotoRef = push(photosDatabaseRef);
    await set(newPhotoRef, { url: downloadURL });

    return downloadURL; // Return the download URL
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};



export const deletePhoto = async (photoName) => {
  try {
    const storage = getStorage();
    const photoRef = ref(storage, `photos/${photoName}`);
    
    // Delete the photo
    await deleteObject(photoRef);
    
    console.log('Photo deleted successfully:', photoName);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

export default database;