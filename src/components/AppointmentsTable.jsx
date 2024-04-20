import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ref, onValue, remove, update } from "firebase/database";
import database from '../firebase';

function AppointmentsTable() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const appointmentsRef = ref(database, 'bookings');
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const appointmentsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        const filteredAppointments = filterAppointments(appointmentsList, selectedDate);
        setAppointments(filteredAppointments);
      }
    });
  }, [selectedDate]);

  const filterAppointments = (appointmentsList, selectedDate) => {
    if (selectedDate) {
      const selectedDateString = selectedDate.toLocaleDateString('en-US');
      return appointmentsList.filter(appointment => appointment.date === selectedDateString);
    } else {
      return appointmentsList; // Return all appointments if no date is selected
    }
  };

  const handleResetFilter = () => {
    setSelectedDate(null); // Reset the selected date to null to remove the filter
  };

  const handleRemoveAppointment = (id) => {
    remove(ref(database, `bookings/${id}`))
      .then(() => {
        console.log("Appointment removed successfully");
      })
      .catch((error) => {
        console.error("Error removing appointment: ", error);
      });
  };

  const handleStatusChange = (id, status) => {
    update(ref(database, `bookings/${id}`), { status })
      .then(() => {
        console.log("Status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating status: ", error);
      });
  };

  const handleNoteChange = (id, note) => {
    update(ref(database, `bookings/${id}`), { note })
      .then(() => {
        console.log("Note updated successfully");
      })
      .catch((error) => {
        console.error("Error updating note: ", error);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'notConfirmed':
        return 'orange';
      case 'canceled':
        return 'red';
      case 'attended':
        return 'blue';
      case 'notAttended':
        return 'gray';
      default:
        return 'black';
    }
  };

  return (
    <div className="appointments-container">
      <h2 className="appointments-heading">Appointments</h2>
      <div className="filter-container">
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="MM/dd/yyyy"
          className="date-picker"
        />
        <Button onClick={handleResetFilter} variant="secondary" style={{backgroundColor:'#15B4C2', marginLeft:'20px'}}>Show All</Button>
      </div>
      <Table striped bordered hover className="appointments-table" style={{marginTop:'20px'}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={appointment.id}>
              <td>{index + 1}</td>
              <td>{appointment.name}</td>
              <td>{appointment.email}</td>
              <td>{appointment.phone}</td>
              <td>{appointment.department}</td>
              <td>{appointment.doctor}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>
                <Form.Control
                  as="select"
                  value={appointment.status || ''} // Ensure value is controlled, handle undefined case
                  onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                  style={{ color: getStatusColor(appointment.status) }} // Apply color based on status
                >
                  <option value="">Select Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="notConfirmed">Not Confirmed</option>
                  <option value="canceled">Canceled</option>
                  <option value="attended">Attended</option>
                  <option value="notAttended">Not Attended</option>
                </Form.Control>
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={appointment.note || ''} // Ensure value is controlled, handle undefined case
                  onChange={(e) => handleNoteChange(appointment.id, e.target.value)}
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => handleRemoveAppointment(appointment.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AppointmentsTable;
