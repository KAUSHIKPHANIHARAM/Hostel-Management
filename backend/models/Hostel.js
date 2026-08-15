import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: false,
            index: true
        },
        name: {
            type: String,
            required: [true, 'Hostel name is required'],
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        location: {
            latitude: {
                type: Number,
                required: [true, 'Latitude is required']
            },
            longitude: {
                type: Number,
                required: [true, 'Longitude is required']
            }
        },
        roomTypes: {
            type: [String],
            default: ['Single', 'Double', 'Triple']
        },
        roomPrices: {
            Single: { type: Number, default: 500 },
            Double: { type: Number, default: 800 },
            Triple: { type: Number, default: 1000 }
        },
        amenities: {
            type: [String],
            default: []
        },
        address: {
            type: String,
            default: ''
        },
        pricePerNight: {
            type: Number,
            default: 50
        },
        rating: {
            type: Number,
            default: 4.0
        },
        reviews: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                // Ensure id field is accessible as both number and string
                if (ret.id === undefined || ret.id === null) {
                    ret.id = ret._id ? ret._id.toString() : ret.id;
                }
                delete ret.__v;
                return ret;
            }
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                if (ret.id === undefined || ret.id === null) {
                    ret.id = ret._id ? ret._id.toString() : ret.id;
                }
                delete ret.__v;
                return ret;
            }
        }
    }
);

const Hostel = mongoose.model('Hostel', hostelSchema);

export default Hostel;
