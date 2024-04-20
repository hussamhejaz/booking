import React, { useState, useEffect } from 'react';
import { addDepartment, addDoctorToDepartment, removeDepartment, removeDoctorFromDepartment } from '../firebase';
import { Button, Card, ListGroup } from 'react-bootstrap';

const AddDoctorsDepartments = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [fetchError, setFetchError] = useState(null); // State to track fetch error
  const [workingHours, setWorkingHours] = useState(['']); // State to track working hours input

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('https://booking-5210c-default-rtdb.firebaseio.com/departments.json');
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        const fetchedDepartments = [];
        for (const key in data) {
          const departmentData = data[key];
          const doctors = departmentData.doctors || {};
          const formattedDoctors = Object.entries(doctors).map(([doctorId, doctor]) => ({
            id: doctorId,
            name: doctor.name,
            workingHours: Array.isArray(doctor.workingHours) ? doctor.workingHours : [], // Ensure workingHours is initialized as an array
          }));
          fetchedDepartments.push({ id: key, name: departmentData.name, doctors: formattedDoctors });
        }
        setDepartments(fetchedDepartments);
        setFetchError(null); // Clear fetch error if successful
      } catch (error) {
        console.error('Error fetching departments:', error);
        setFetchError(error.message); // Set fetch error message
      }
    };

    fetchDepartments();
  }, []);

  // Add a new department
  const handleAddDepartment = () => {
    if (departmentName) {
      addDepartment(departmentName);
      setDepartmentName('');
    }
  };

  // Add a new doctor to the selected department
  const handleAddDoctor = () => {
    if (doctorName && selectedDepartment) {
      addDoctorToDepartment(selectedDepartment, doctorName, workingHours);
      setDoctorName('');
      setWorkingHours(['']); // Clear working hours after adding the doctor
    }
  };

  // Remove the selected department
  const handleRemoveDepartment = (departmentId) => {
    removeDepartment(departmentId);
    // You might want to update the UI after removing the department
  };

  // Remove a doctor from the selected department
  const handleRemoveDoctor = (departmentId, doctorId) => {
    removeDoctorFromDepartment(departmentId, doctorId);
    // You might want to update the UI after removing the doctor
  };

  // Update working hours for a doctor
  const handleWorkingHoursChange = (e, index) => {
    const hours = [...workingHours];
    hours[index] = e.target.value;
    setWorkingHours(hours);
  };

  // Add new slot for working hours
  const addWorkingHoursSlot = () => {
    setWorkingHours([...workingHours, '']);
  };

  // Remove working hours slot
  const removeWorkingHoursSlot = (index) => {
    const hours = [...workingHours];
    hours.splice(index, 1);
    setWorkingHours(hours);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Department Form */}
        <div className="col-md-6">
          <h2>Add Department</h2>
          {/* Department input */}
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Department Name" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
            <button className="btn btn-primary" type="button" onClick={handleAddDepartment} style={{backgroundColor:'#15B4C2'}}>Add</button>
          </div>
        </div>
        {/* Doctor Form */}
        <div className="col-md-6">
          <h2>Add Doctor</h2>
          {/* Doctor input and select department */}
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Doctor Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
            <select className="form-select" onChange={(e) => setSelectedDepartment(e.target.value)} value={selectedDepartment}>
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>{department.name}</option>
              ))}
            </select>
            <button className="btn btn-primary" type="button" onClick={handleAddDoctor} style={{backgroundColor:'#15B4C2'}}>Add</button>
          </div>
          {/* Working hours input */}
          <div>
            {workingHours.map((hour, index) => (
              <div key={index} className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Working Hour" value={hour} onChange={(e) => handleWorkingHoursChange(e, index)} />
                <button className="btn btn-danger" type="button" onClick={() => removeWorkingHoursSlot(index)}>Remove</button>
              </div>
            ))}
            <button className="btn btn-success" type="button" onClick={addWorkingHoursSlot}>Add Working Hour</button>
          </div>
        </div>
      </div>
      {/* Display fetch error message if any */}
      {fetchError && <div className="alert alert-danger">{fetchError}</div>}

      {/* Display list of departments with doctors and remove buttons */}
      <div className="mt-5">
        <h2>Departments</h2>
        {departments.map(department => (
          <Card key={department.id} className="mb-3" dir='rtl'>
            <Card.Header><h1>{department.name}</h1></Card.Header>
            <ListGroup variant="flush">
              {department.doctors.map(doctor => (
                <ListGroup.Item key={doctor.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <div>{doctor.name}</div>
                    {doctor.workingHours.map((hour, index) => (
                      <div key={index}>{hour}</div>
                    ))}
                  </div>
                  <Button variant="danger" onClick={() => handleRemoveDoctor(department.id, doctor.id)}>Remove Doctor</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Footer>
              <Button variant="danger" onClick={() => handleRemoveDepartment(department.id)}>Remove Department</Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddDoctorsDepartments;
