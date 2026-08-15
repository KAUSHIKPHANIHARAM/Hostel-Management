import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Hostel from './models/Hostel.js';
import Booking from './models/Booking.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const seedInitialData = async () => {
    try {
        // 1. Clear existing data
        console.log('Clearing existing collections...');
        await User.deleteMany({});
        await Hostel.deleteMany({});
        await Booking.deleteMany({});

        // 2. Read JSON files
        const rootDir = path.resolve(__dirname, '..');
        const dbJsonPath = path.join(rootDir, 'db.json');
        const dbUserPath = path.join(rootDir, 'dbUser.json');
        const dbBookingPath = path.join(rootDir, 'dbBooking.json');

        const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));
        const userData = JSON.parse(fs.readFileSync(dbUserPath, 'utf-8'));
        const bookingData = JSON.parse(fs.readFileSync(dbBookingPath, 'utf-8'));

        // 3. Seed Hostels
        console.log(`Seeding ${dbData.hostels.length} hostels...`);
        const createdHostels = await Hostel.insertMany(dbData.hostels);
        console.log(`✓ ${createdHostels.length} Hostels seeded successfully.`);

        // 4. Seed Users
        console.log('Processing users from dbUser.json...');
        const uniqueUsersMap = new Map();

        // Ensure key users with complete data take precedence
        for (const u of userData.users) {
            const username = u.username?.trim();
            let email = u.email ? u.email.trim().toLowerCase() : `${username.toLowerCase()}@example.com`;
            if (!email.includes('@')) {
                email = `${email}@example.com`;
            }

            const cleanUser = {
                username: username || `user_${u.id}`,
                email: email,
                password: u.password || 'password123',
                name: u.name || username || 'User',
                phone: u.phone || '',
                address: u.address || '',
                bio: u.bio || '',
                dob: u.dob || '',
                gender: u.gender || ''
            };

            if (!uniqueUsersMap.has(cleanUser.username) && !Array.from(uniqueUsersMap.values()).some(item => item.email === cleanUser.email)) {
                uniqueUsersMap.set(cleanUser.username, cleanUser);
            }
        }

        const usersToInsert = Array.from(uniqueUsersMap.values());
        console.log(`Seeding ${usersToInsert.length} unique users with hashed passwords...`);
        
        const createdUsers = [];
        for (const u of usersToInsert) {
            const created = await User.create(u);
            createdUsers.push(created);
        }
        console.log(`✓ ${createdUsers.length} Users seeded successfully.`);

        // 5. Seed Bookings
        console.log(`Processing ${bookingData.bookings.length} bookings from dbBooking.json...`);
        const userEmailToIdMap = new Map();
        createdUsers.forEach(u => {
            userEmailToIdMap.set(u.email.toLowerCase(), u._id);
            userEmailToIdMap.set(u.username.toLowerCase(), u._id);
        });

        const bookingsToInsert = bookingData.bookings.map(b => {
            const emailKey = b.email ? b.email.trim().toLowerCase() : '';
            const nameKey = b.name ? b.name.trim().toLowerCase() : '';
            const matchedUserId = userEmailToIdMap.get(emailKey) || userEmailToIdMap.get(nameKey) || null;

            return {
                userId: matchedUserId,
                hostelId: b.hostelId ? b.hostelId.toString() : '',
                hostelName: b.hostelName || 'DormQuest Hostel',
                name: b.name || 'Guest User',
                email: b.email || 'guest@example.com',
                roomType: ['Single', 'Double', 'Triple', 'Quad'].includes(b.roomType) ? b.roomType : 'Single',
                guests: Number(b.guests) || 1,
                arrivalDate: b.arrivalDate || '2025-01-01',
                departureDate: b.departureDate || '2025-01-02',
                specialRequests: b.specialRequests || 'no',
                nights: Number(b.nights) || 1,
                totalPrice: Number(b.totalPrice) || 500,
                status: 'confirmed'
            };
        });

        const createdBookings = await Booking.insertMany(bookingsToInsert);
        console.log(`✓ ${createdBookings.length} bookings seeded successfully.`);
        return { createdHostels, createdUsers, createdBookings };
    } catch (error) {
        console.error('Error during data seed:', error);
        throw error;
    }
};

const runCLI = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dormquest');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedInitialData();
        console.log('\n=============================================');
        console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('=============================================');
        process.exit(0);
    } catch (error) {
        console.error('Seed execution failed:', error.message);
        process.exit(1);
    }
};

if (process.argv[1] && process.argv[1].includes('seed.js')) {
    runCLI();
}
