import React, { forwardRef } from 'react';
import '../Style/TripleRoom.css';

const TripleRoom = forwardRef(({ roomDetails }, ref) => {
    return (
        <div className="room-container" ref={ref}>
            <h2>Triple Room</h2>
            <p>{roomDetails?.description || 'Details about the double room.'}</p>
            <p>Price per night: ₹{roomDetails?.price}</p>
        </div>
    );
});

export default TripleRoom;
