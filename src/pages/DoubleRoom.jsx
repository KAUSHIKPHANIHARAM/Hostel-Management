import React, { forwardRef } from 'react';
import '../Style/DoubleRoom.css';

const DoubleRoom = forwardRef(({ roomDetails }, ref) => {
    return (
        <div className="room-container" ref={ref}>
            <h2>Double Room</h2>
            <p>{roomDetails?.description || 'Details about the double room.'}</p>
            <p>Price per night: ₹{roomDetails?.price}</p>
        </div>
    );
});

export default DoubleRoom;
