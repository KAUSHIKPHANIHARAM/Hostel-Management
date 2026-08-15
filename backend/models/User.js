import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        name: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: ''
        },
        dob: {
            type: String,
            default: ''
        },
        gender: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id ? ret._id.toString() : ret.id;
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id ? ret._id.toString() : ret.id;
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Pre-save middleware to hash password if modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Instance method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
