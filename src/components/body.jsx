import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaSnapchat } from 'react-icons/fa'; // Import Font Awesome icons
import booking from '../images/booking.png';

function Body({ handleButtonClick }) {
  // Add a style tag to apply the background color to the body element
  React.useEffect(() => {
    document.body.style.backgroundColor = '#2A3039'; // Set the desired background color
    return () => {
      document.body.style.backgroundColor = ''; // Reset the background color when the component unmounts
    };
  }, []);

  return (
    <Container className="mobile-padding">
      <Row>
        {/* Left Column */}
        <Col md={6} className="d-flex align-items-center">
          <div className="" style={{ color: 'white' }}>
            {/* <h2>اهلاً وسهلاً بكم في منصة حجز الموعيد</h2> */}
            <p>
              دانه التجميل الطبي
              نهتم بصحتك وجمالك
              نخبة من الكوادر المميزة
              احجز الان
            </p>
            <div className="d-flex flex-wrap align-items-center">
              <Button className="mr-2 mb-2" style={{ fontSize: '1.5rem', width: '150px', borderRadius: '10px', backgroundColor: '#14B4C2' }} onClick={handleButtonClick}>احجز الان</Button>
              {/* Social Media Icons */}
              <div className="d-flex">
                {/* Facebook Icon */}
                <a href="https://www.facebook.com/danaclinic999">
                  <FaFacebook style={{ color: '#3b5998', fontSize: '2rem', margin: '0 5px' }} />
                </a>
                {/* Instagram Icon */}
                <a href="https://www.instagram.com/danaclinic999/?igshid=OGQ5ZDc2ODk2ZA%3D%3D">
                  <FaInstagram style={{ color: '#e4405f', fontSize: '2rem', margin: '0 5px' }} />
                </a>
                {/* Snapchat Icon */}
                <a href="https://www.snapchat.com/add/danaclinic999?invite_id=HF0VaZ66&share_id=duVhER3mTIe0vniRjqMlnA&sid=16ecd9aafac445b4a113548dfa68aa8d">
                  <FaSnapchat style={{ color: '#fffc00', fontSize: '2rem', margin: '0 5px' }} />
                </a>
              </div>
            </div>
          </div>
        </Col>

        {/* Right Column */}
        <Col md={6}>
          <div className="d-flex justify-content-center">
            <div style={{ paddingTop: '30px'}}>
              <img
                src={booking}
                alt="placeholder"
                className="img-fluid"
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Body;
