import React, { useState, useEffect } from 'react';
import { addDepartment, addDoctorToDepartment, removeDepartment, removeDoctorFromDepartment } from '../firebase';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const AddDoctorsDepartments = () => {
    const [departmentName, setDepartmentName] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [departments, setDepartments] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [workingHours, setWorkingHours] = useState(['']);

    // Fetch departments on component load
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch('https://booking-app-a07f8-default-rtdb.firebaseio.com/departments.json');
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
                        workingHours: Array.isArray(doctor.workingHours) ? doctor.workingHours : [],
                    }));
                    fetchedDepartments.push({ id: key, name: departmentData.name, doctors: formattedDoctors });
                }
                setDepartments(fetchedDepartments);
                setFetchError(null);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setFetchError(error.message);
            }
        };

        fetchDepartments();
    }, []);

    // Add a new department
    const handleAddDepartment = async () => {
        if (departmentName) {
            try {
                const newDepartmentId = await addDepartment(departmentName);
                if (newDepartmentId) {
                    setDepartments((prevDepartments) => [
                        ...prevDepartments,
                        { id: newDepartmentId, name: departmentName, doctors: [] }
                    ]);
                    setDepartmentName('');
                    toast.success('Department added successfully!'); // Show success toast
                }
            } catch (error) {
                console.error('Error adding department:', error);
                toast.error('Failed to add department.'); // Show error toast
            }
        }
    };

    // Add a new doctor to the selected department
    const handleAddDoctor = async () => {
        if (doctorName && selectedDepartment) {
            try {
                await addDoctorToDepartment(selectedDepartment, doctorName, workingHours);
                setDepartments((prevDepartments) =>
                    prevDepartments.map((department) => {
                        if (department.id === selectedDepartment) {
                            return {
                                ...department,
                                doctors: [...department.doctors, { id: Date.now(), name: doctorName, workingHours }],
                            };
                        }
                        return department;
                    })
                );
                setDoctorName('');
                setWorkingHours(['']);
                toast.success('Doctor added successfully!'); // Show success toast
            } catch (error) {
                console.error('Error adding doctor:', error);
                toast.error('Failed to add doctor.'); // Show error toast
            }
        }
    };

    // Remove the selected department
    const handleRemoveDepartment = async (departmentId) => {
        try {
            await removeDepartment(departmentId);
            setDepartments(departments.filter(department => department.id !== departmentId));
            toast.success('Department removed successfully!'); // Show success toast
        } catch (error) {
            console.error('Error removing department:', error);
            toast.error('Failed to remove department.'); // Show error toast
        }
    };

    // Remove a doctor from the selected department
    const handleRemoveDoctor = async (departmentId, doctorId) => {
        try {
            await removeDoctorFromDepartment(departmentId, doctorId);
            setDepartments(departments.map(department => {
                if (department.id === departmentId) {
                    return {
                        ...department,
                        doctors: department.doctors.filter(doctor => doctor.id !== doctorId)
                    };
                }
                return department;
            }));
            toast.success('Doctor removed successfully!'); // Show success toast
        } catch (error) {
            console.error('Error removing doctor:', error);
            toast.error('Failed to remove doctor.'); // Show error toast
        }
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
            <ToastContainer /> {/* Add ToastContainer to render toasts */}
            <div className="row">
                {/* Department Form */}
                <div className="col-md-6">
                    <h2>Add Department</h2>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Department Name" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
                        <button className="btn btn-primary" type="button" onClick={handleAddDepartment} style={{ backgroundColor: '#15B4C2' }}>Add</button>
                    </div>
                </div>
                {/* Doctor Form */}
                <div className="col-md-6">
                    <h2>Add Doctor</h2>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Doctor Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                        <select className="form-select" onChange={(e) => setSelectedDepartment(e.target.value)} value={selectedDepartment}>
                            <option value="">Select Department</option>
                            {departments.map(department => (
                                <option key={department.id} value={department.id}>{department.name}</option>
                            ))}
                        </select>
                        <button className="btn btn-primary" type="button" onClick={handleAddDoctor} style={{ backgroundColor: '#15B4C2' }}>Add</button>
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
