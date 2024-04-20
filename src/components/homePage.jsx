import React from 'react'
import Navebar from './Navebar';
import BookingPage from './booking.jsx'
import '../style/Style.css'
import { useState } from 'react';
import departments from '../data/departments.jsx';
import Body from './body';
import PhotoSlider from './PhotoSlider.jsx';
import WhatsAppIcon from './WhatsAppIcon';



function HomePage() {

  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDepartmentChange = (eventKey) => {
    const department = departments.find(dep => dep.id === eventKey);
    setSelectedDepartment(department);
    setSelectedDoctor(null); // Reset selected doctor
  };

  const handleDoctorChange = (eventKey) => {
    const doctor = selectedDepartment.doctors.find(doc => doc.id === eventKey);
    setSelectedDoctor(doctor);
  };




  return (
    <div>
        <Navebar/>
        <Body  handleButtonClick={handleButtonClick}/>
        <BookingPage 
       showModal={showModal}
       handleCloseModal={handleCloseModal}
       handleDepartmentChange={handleDepartmentChange}
       handleDoctorChange={handleDoctorChange}
       selectedDepartment={selectedDepartment}
       selectedDoctor={selectedDoctor}
       departments={departments} //ass doctors object
      />
      <PhotoSlider/>
      <WhatsAppIcon />
     
    </div>
  )
}

export default HomePage;