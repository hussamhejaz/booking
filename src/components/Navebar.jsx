import React from 'react'
import Container from 'react-bootstrap/Container';
import { FaHeadset} from 'react-icons/fa';


import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.svg'


function Navebar() {
  const iconColor = '#4DC5D0';
  const textColor = "#012047"

  return (
    <>
     <Navbar bg="light" expand="xxl" variant="light" dir="rtl">
      <Container>
        {/* Place the Navbar.Brand on the right */}
        <Navbar.Brand className="ms-auto" href="#">
          <img
            src={logo}
            width="150px"
            height="100"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        {/* Place the icon for the call center on the left */}
        < FaHeadset size={24} style={{ marginLeft: '10px', color: iconColor }} />
        {/* Add the text next to the phone icon */}
        <span> <a href="tel:" style={{color:textColor , textDecoration:'none'}}>  0114111353 </a></span>
      </Container>
    </Navbar>
    </>
  )
}

export default Navebar