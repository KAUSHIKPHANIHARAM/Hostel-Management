import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

// Helper function to make HTTP requests
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(`${BASE_URL}${path}`);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, headers: res.headers, body: parsed });
                } catch {
                    resolve({ status: res.statusCode, headers: res.headers, body: data });
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✓ ${message}`);
        passed++;
    } else {
        console.error(`  ✗ FAIL: ${message}`);
        failed++;
    }
}

async function runTests() {
    console.log('=============================================');
    console.log('STARTING DORMQUEST BACKEND API TESTS');
    console.log('=============================================\n');

    const testTimestamp = Date.now();
    const testUsername = `testuser_${testTimestamp}`;
    const testEmail = `test_${testTimestamp}@example.com`;
    const testPassword = 'Password@123';
    let testToken = null;
    let testUserId = null;
    let testBookingId = null;

    try {
        // Test 1: Health Check
        console.log('1. Testing Health Check API...');
        const healthRes = await request('GET', '/health');
        assert(healthRes.status === 200, 'Health check returns 200 OK');
        assert(healthRes.body.status === 'ok', 'Health status is ok');

        // Test 2: User Registration
        console.log('\n2. Testing User Registration...');
        const regRes = await request('POST', '/auth/register', {
            username: testUsername,
            email: testEmail,
            password: testPassword,
            name: 'API Test User',
            phone: '9998887776'
        });
        assert(regRes.status === 201, 'Registration returns 201 Created');
        assert(regRes.body.token !== undefined, 'Registration returns JWT token');
        assert(regRes.body.user && regRes.body.user.username === testUsername, 'User object returned without password');
        testToken = regRes.body.token;
        testUserId = regRes.body.user.id || regRes.body.user._id;

        // Test 3: Duplicate Registration prevention
        console.log('\n3. Testing Duplicate Registration Prevention...');
        const dupRes = await request('POST', '/auth/register', {
            username: testUsername,
            email: testEmail,
            password: testPassword
        });
        assert(dupRes.status === 400, 'Duplicate registration returns 400 Bad Request');

        // Test 4: User Login
        console.log('\n4. Testing User Login...');
        const loginRes = await request('POST', '/auth/login', {
            username: testUsername,
            password: testPassword
        });
        assert(loginRes.status === 200, 'Login returns 200 OK');
        assert(loginRes.body.token !== undefined, 'Login returns valid token');
        testToken = loginRes.body.token;

        // Test 5: Invalid Login
        console.log('\n5. Testing Invalid Login...');
        const invalidLoginRes = await request('POST', '/auth/login', {
            username: testUsername,
            password: 'wrongpassword'
        });
        assert(invalidLoginRes.status === 401, 'Invalid password returns 401 Unauthorized');

        // Test 6: Protected /auth/me with JWT
        console.log('\n6. Testing Protected /auth/me endpoint...');
        const meRes = await request('GET', '/auth/me', null, testToken);
        assert(meRes.status === 200, 'Get /auth/me with JWT returns 200 OK');
        assert(meRes.body.email === testEmail, 'Current user email matches');

        // Test 7: Protected /auth/me without JWT
        console.log('\n7. Testing Protected /auth/me without token...');
        const unauthRes = await request('GET', '/auth/me');
        assert(unauthRes.status === 401, 'Missing token returns 401 Unauthorized');

        // Test 8: Get All Hostels
        console.log('\n8. Testing Get All Hostels...');
        const hostelsRes = await request('GET', '/hostels');
        assert(hostelsRes.status === 200, 'Get hostels returns 200 OK');
        assert(Array.isArray(hostelsRes.body) && hostelsRes.body.length > 0, 'Returns list of hostels');

        // Test 9: Get Single Hostel by numeric ID
        console.log('\n9. Testing Get Single Hostel by ID...');
        const singleHostelRes = await request('GET', '/hostels/1');
        assert(singleHostelRes.status === 200, 'Get hostel /hostels/1 returns 200 OK');
        assert(singleHostelRes.body.location && singleHostelRes.body.location.latitude !== undefined, 'Hostel has location coordinates');

        // Test 10: Hostel Filtering
        console.log('\n10. Testing Hostel Query Filters...');
        const filteredRes = await request('GET', '/hostels?minRating=4');
        assert(filteredRes.status === 200, 'Filter query returns 200 OK');
        assert(Array.isArray(filteredRes.body), 'Filtered hostels returned');

        // Test 11: Create Booking
        console.log('\n11. Testing Booking Creation...');
        const bookingRes = await request('POST', '/bookings', {
            name: 'API Test User',
            email: testEmail,
            roomType: 'Single',
            guests: 1,
            arrivalDate: '2026-09-01',
            departureDate: '2026-09-05',
            specialRequests: 'Near window',
            hostelId: '1',
            hostelName: 'Miyapur Hostels',
            nights: 4,
            totalPrice: 2000
        }, testToken);
        assert(bookingRes.status === 201, 'Create booking returns 201 Created');
        assert(bookingRes.body.roomType === 'Single', 'Booking details match');
        testBookingId = bookingRes.body.id || bookingRes.body._id;

        // Test 12: Get User Bookings
        console.log('\n12. Testing Get Bookings for User...');
        const userBookingsRes = await request('GET', '/bookings', null, testToken);
        assert(userBookingsRes.status === 200, 'Get bookings returns 200 OK');
        assert(Array.isArray(userBookingsRes.body) && userBookingsRes.body.length > 0, 'User bookings retrieved');

        // Test 13: Update User Profile
        console.log('\n13. Testing Profile Update (PATCH /users/:id)...');
        const updateRes = await request('PATCH', `/users/${testUserId}`, {
            bio: 'Updated bio from automated test suite',
            address: '123 Test Avenue, Tech City'
        }, testToken);
        assert(updateRes.status === 200, 'Profile update returns 200 OK');
        assert(updateRes.body.bio === 'Updated bio from automated test suite', 'Updated field is persisted');

        // Test 14: Delete User Account
        console.log('\n14. Testing Account Deletion (DELETE /users/:id)...');
        const deleteRes = await request('DELETE', `/users/${testUserId}`, null, testToken);
        assert(deleteRes.status === 200, 'Delete user returns 200 OK');

        console.log('\n=============================================');
        console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
        console.log('=============================================');

        if (failed > 0) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    } catch (error) {
        console.error('\nTest Execution Error:', error.message);
        console.error('Is the backend server running on http://localhost:5000?');
        process.exit(1);
    }
}

runTests();
