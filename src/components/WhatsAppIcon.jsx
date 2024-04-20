import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function WhatsAppIcon() {
  return (
    <div className="whatsapp-icon" style={{ backgroundColor: 'white', padding: '10px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70px', height: '70px', boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <a href="https://Wa.me/966537334999" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faWhatsapp} size="3x" style={{ color: 'green' }} />
      </a>
    </div>
  );
}

export default WhatsAppIcon;
