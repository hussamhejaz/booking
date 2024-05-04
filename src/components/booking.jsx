import React, { useState, useEffect } from 'react';
import { Button, Modal, Dropdown, Row, Col, Form, Alert } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ref, onValue, push, set } from "firebase/database";
import database from '../firebase';
import Calendar from './calandar'; // Adjust the path based on the actual location of your Calendar component

function BookingPage({ showModal, handleCloseModal }) {
    const [selectedTime, setSelectedTime] = useState(null);
    const [modalStep, setModalStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [bookedTimesForDate, setBookedTimesForDate] = useState([]);

    useEffect(() => {
        const departmentsRef = ref(database, 'departments');
        onValue(departmentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const departmentsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setDepartments(departmentsList);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            const doctorsRef = ref(database, `departments/${selectedDepartment.id}/doctors`);
            onValue(doctorsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const doctorsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    setDoctors(doctorsList);
                }
            });
        }
    }, [selectedDepartment]);

    useEffect(() => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.toLocaleDateString('en-US');

        const bookedTimesRef = ref(database, `bookings`);
        onValue(bookedTimesRef, (snapshot) => {
            const bookings = snapshot.val();
            if (bookings) {
                const bookedTimesList = Object.values(bookings)
                    .filter(booking => booking.date === formattedDate)
                    .map(booking => booking.time);
                setBookedTimesForDate(bookedTimesList);
            }
        });
    }, [selectedDate]);

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
    };

    const renderTimeOptions = () => {
        if (!selectedDoctor || !selectedDoctor.workingHours) {
            return null;
        }

        const { workingHours } = selectedDoctor;

        return workingHours.map((time, index) => {
            const isBooked = bookedTimesForDate.includes(time);
            const isSelected = time === selectedTime;

            return (
                <Button 
                    key={index} 
                    variant={isSelected ? 'secondary' : (isBooked ? 'danger' : 'primary')} 
                    onClick={() => handleTimeSelection(time)} 
                    style={{ margin: '10px' }}
                    disabled={isBooked || isSelected}
                >
                    {time} {isBooked && "(محجوز)"}
                </Button>
            );
        });
    };

    const handleNextStep = () => {
        if (modalStep === 1) {
            if (!selectedDepartment || !selectedDoctor) {
                setShowAlert(true);
                return;
            }
        } else if (modalStep === 2) {
            if (!selectedDate || !selectedTime) {
                setShowAlert(true);
                return;
            }
        }

        setModalStep(modalStep + 1);
        setShowAlert(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const bookingsRef = ref(database, 'bookings');
            const newBookingRef = push(bookingsRef);
            const formattedDate = selectedDate.toLocaleDateString('en-US');
            set(newBookingRef, {
                name: userInfo.name,
                email: userInfo.email,
                phone: userInfo.phone,
                department: selectedDepartment.name,
                doctor: selectedDoctor.name,
                date: formattedDate,
                time: selectedTime
            });

            setSelectedTime(null);
            setSelectedDate(null);
            setUserInfo({ name: '', email: '', phone: '' });
            setSuccessMessage('تم حجز الموعد');
            setModalStep(1);
            setShowAlert(false);
            window.location.reload();
        } catch (error) {
            console.error("Error submitting booking:", error);
            setShowAlert(true);
        }
    };
    
    const handleBackStep = () => {
        setModalStep(modalStep - 1);
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg" >
            <Modal.Header >
                <Modal.Title style={{ color: '#15B4C2' }}>Book Now</Modal.Title>
                <button onClick={handleCloseModal} type="button" className="btn-close custom-close-button" aria-label="Close" style={{ backgroundColor: '#14B4C2' }}></button>
            </Modal.Header>
            <Modal.Body dir="rtl" style={{ minHeight: '70vh' }}>
                {showAlert && (
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                        {modalStep === 1 ? "الرجاء اختيار التخصص والطبيب" : "الرجاء اختيار التاريخ والوقت"}
                    </Alert>
                )}
                {successMessage && (
                    <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                        {successMessage}
                    </Alert>
                )}

                {modalStep === 1 && (
                    <Row>
                    <Col>
                        <Dropdown onSelect={(eventKey) => setSelectedDepartment(departments.find(dep => dep.id === eventKey))}>
                            <Dropdown.Toggle variant="success" id="dropdown-department" style={{ backgroundColor: '#15B4C2', width: '100%' }}>
                                {selectedDepartment ? selectedDepartment.name : 'اختر التخصص'}
                            </Dropdown.Toggle>
                
                            <Dropdown.Menu style={{ width: '100%' }}>
                                {departments.map((department) => (
                                    <Dropdown.Item eventKey={department.id} key={department.id}>{department.name} </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        {selectedDepartment && (
                            <Dropdown onSelect={(eventKey) => setSelectedDoctor(doctors.find(doc => doc.id === eventKey))} style={{ marginLeft: '5%' }}>
                                <Dropdown.Toggle variant="success" id="dropdown-doctor" style={{ backgroundColor: '#15B4C2', width: '100%' }}>
                                    {selectedDoctor ? selectedDoctor.name : 'اختر الطبيب'}
                                </Dropdown.Toggle>
                
                                <Dropdown.Menu style={{ width: '100%' }}>
                                    {doctors.map((doctor) => (
                                        <Dropdown.Item eventKey={doctor.id} key={doctor.id}>{doctor.name}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </Col>
                </Row>
                
                )}

                {modalStep === 2 && (
                    <Row>
                        <Calendar onDateSelect={(date) => setSelectedDate(date)} />
                        <div className='button-container' style={{ marginTop: '30px', paddingRight: '50px' }}>
                            {renderTimeOptions()}
                        </div>
                    </Row>
                )}

                {modalStep === 3 && (
                    <div className="bookInfo" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                        <div style={{ border: '2px solid #15B4C2', padding: '20px', borderRadius: '5px', width: '500px', height: '400px' }}>
                            <h6 style={{ backgroundColor: '#15B4C2', height: '50px', color: 'white', padding: '5px', display: 'flex' }}>أكد الحجز في يوم {selectedDate?.toLocaleDateString()}  في تمام الساعة {selectedTime}</h6>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formName" style={{ marginBottom: '15px' }}>
                                    <Form.Label style={{ color: '#15B4C2' }}>الاسم بالكامل</Form.Label>
                                    <Form.Control type="text" name="name" value={userInfo.name} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group controlId="formEmail" style={{ marginBottom: '15px' }}>
                                    <Form.Label style={{ color: '#15B4C2' }}>البريد الإلكتروني</Form.Label>
                                    <Form.Control type="email" name="email" value={userInfo.email} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group controlId="formPhone" style={{ marginBottom: '15px' }}>
                                    <Form.Label style={{ color: '#15B4C2' }}>رقم الجوال</Form.Label>
                                    <Form.Control type="tel" name="phone" value={userInfo.phone} onChange={handleInputChange} required />
                                </Form.Group>
                                <Button variant="primary" type="submit" style={{ backgroundColor: '#15B4C2', width: '200px', margin: '0px' }}>تأكيد الحجز</Button>
                            </Form>
                        </div>
                    </div>
                )}

            </Modal.Body>

            <Modal.Footer>
                {modalStep !== 1 && (
                    <Button variant="primary" onClick={handleBackStep} style={{ marginRight: 'auto', marginLeft: '15px', backgroundColor: '#15B4C2' }}>
                        {/* <FontAwesomeIcon icon={faArrowLeft} /> */}
                        رجوع
                    </Button>
                )}

                {modalStep !== 3 && (
                    <Button variant="primary" onClick={handleNextStep} style={{ backgroundColor: '#15B4C2' }} >
                        {/* <FontAwesomeIcon icon={faArrowRight} /> */}
                        التالي
                    </Button>
                )}

                {modalStep === 3 && (
                    <Button variant="secondary" onClick={handleCloseModal}>
                       اغلاق
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default BookingPage;
