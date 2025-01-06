const bcrypt = require('bcrypt');
const { User } = require('../models');

async function createTestUser() {
    try {
        const hashedPassword = await bcrypt.hash('test123', 10);
        const testUser = await User.create({
            name: 'Test User',
            email: 'test@test.com',
            password: hashedPassword,
            type: 'user',
            balance: 10000,
            equity: 10000
        });
        console.log('Test user created successfully:', testUser.email);
    } catch (error) {
        console.error('Error creating test user:', error);
    }
}

createTestUser();
