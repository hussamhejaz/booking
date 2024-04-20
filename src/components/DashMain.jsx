import React, { useState, useEffect } from 'react';
import { bookingsRef, departmentsRef, get } from '../firebase';

function DashMain() {
  const [bookingsCount, setBookingsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [departmentsCount, setDepartmentsCount] = useState(0);
  const [currentDayAppointmentsCount, setCurrentDayAppointmentsCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch appointments count
        const bookingsSnapshot = await get(bookingsRef);
        if (bookingsSnapshot.exists()) {
          setBookingsCount(Object.keys(bookingsSnapshot.val()).length);
        }

        // Fetch departments count
        const departmentsSnapshot = await get(departmentsRef);
        if (departmentsSnapshot.exists()) {
          setDepartmentsCount(Object.keys(departmentsSnapshot.val()).length);
        }

        // Fetch doctors count
        let doctorsTotal = 0;
        departmentsSnapshot.forEach((departmentSnapshot) => {
          doctorsTotal += Object.keys(departmentSnapshot.child('doctors').val() || {}).length;
        });
        setDoctorsCount(doctorsTotal);

        // Fetch current day appointments count
        const today = new Date();
        const todayString = today.toDateString();
        const currentDayAppointmentsSnapshot = await get(bookingsRef);
        if (currentDayAppointmentsSnapshot.exists()) {
          let count = 0;
          currentDayAppointmentsSnapshot.forEach((appointmentSnapshot) => {
            const appointmentDate = appointmentSnapshot.child('date').val();
            const formattedAppointmentDate = new Date(appointmentDate).toDateString(); // Format appointmentDate
            if (formattedAppointmentDate === todayString) {
              count++;
            }
          });
          setCurrentDayAppointmentsCount(count);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="container" dir='rtl'>
      <div className="row">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h3 className="card-title" style={{color:'#15B4C2', textAlign:'center'}}>مجموع الحجوزات</h3>
              <p className="card-text" style={{color:'#15B4C2', padding:'20px', textAlign:'center', fontSize:'40px'}}>{bookingsCount}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h3 className="card-title"style={{color:'#15B4C2', textAlign:'center'}}>عدد الأطباء</h3>
              <p className="card-text"style={{color:'#15B4C2', padding:'20px', textAlign:'center', fontSize:'40px'}}>{doctorsCount}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h3 className="card-title"style={{color:'#15B4C2', textAlign:'center'}}>عدد الاقسام</h3>
              <p className="card-text"style={{color:'#15B4C2', padding:'20px', textAlign:'center', fontSize:'40px'}}>{departmentsCount}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h3 className="card-title"style={{color:'#15B4C2', textAlign:'center'}}>مجموع الحجوزات لليوم</h3>
              <p className="card-text"style={{color:'#15B4C2', padding:'20px', textAlign:'center', fontSize:'40px'}}>{currentDayAppointmentsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashMain;
