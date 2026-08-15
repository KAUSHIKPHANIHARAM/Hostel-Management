import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        hostelId: {
            type: String,
            required: false
        },
        hostelName: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            required: [true, 'Guest name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Guest email is required'],
            trim: true
        },
        roomType: {
            type: String,
            required: [true, 'Room type is required'],
            enum: ['Single', 'Double', 'Triple', 'Quad']
        },
        guests: {
            type: Number,
            required: [true, 'Number of guests is required'],
            min: [1, 'Minimum 1 guest']
        },
        arrivalDate: {
            type: String,
            required: [true, 'Arrival date is required']
        },
        departureDate: {
            type: String,
            required: [true, 'Departure date is required']
        },
        specialRequests: {
            type: String,
            default: 'no'
        },
        nights: {
            type: Number,
            default: 1
        },
        totalPrice: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['confirmed', 'pending', 'cancelled'],
            default: 'confirmed'
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id ? ret._id.toString() : ret.id;
                delete ret.__v;
                return ret;
            }
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id ? ret._id.toString() : ret.id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
