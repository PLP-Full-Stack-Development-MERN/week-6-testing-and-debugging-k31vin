        const request = require('supertest');
        const mongoose = require('mongoose');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const app = require('../../server');
        const Bug = require('../../models/bugModel');
        const User = require('../../models/userModel');

        let mongoServer;

        beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        });

        afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        app.close();
        });

        describe('Bug API Routes', () => {
        let token;
        let testUser;
        
        beforeEach(async () => {
            // Clear database collections
            await User.deleteMany({});
            await Bug.deleteMany({});
            
            // Create test user
            testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
            });
            
            // Login to get token
            const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
            
            token = res.body.token;
        });
        
        test('should create a new bug', async () => {
            const bugData = {
            title: 'Test Bug',
            description: 'This is a test bug',
            severity: 'high'
            };
            
            const res = await request(app)
            .post('/api/bugs')
            .set('Authorization', `Bearer ${token}`)
            .send(bugData);
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.title).toBe(bugData.title);
            expect(res.body.reporter).toBe(testUser._id.toString());
        });
        
        test('should get all bugs', async () => {
            // Create test bugs
            await Bug.create({
            title: 'Bug 1',
            description: 'Description 1',
            severity: 'low',
            reporter: testUser._id
            });
            
            await Bug.create({
            title: 'Bug 2',
            description: 'Description 2',
            severity: 'high',
            reporter: testUser._id
            });
            
            const res = await request(app)
            .get('/api/bugs')
            .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
        
        test('should update a bug', async () => {
            // Create test bug
            const bug = await Bug.create({
            title: 'Original Bug',
            description: 'Original description',
            severity: 'medium',
            reporter: testUser._id
            });
            
            const updatedData = {
            title: 'Updated Bug',
            status: 'in-progress'
            };
            
            const res = await request(app)
            .put(`/api/bugs/${bug._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe(updatedData.title);
            expect(res.body.status).toBe(updatedData.status);
            expect(res.body.description).toBe(bug.description);
        });
        
        test('should delete a bug', async () => {
            // Create test bug
            const bug = await Bug.create({
            title: 'Bug to delete',
            description: 'This will be deleted',
            severity: 'low',
            reporter: testUser._id
            });
            
            const res = await request(app)
            .delete(`/api/bugs/${bug._id}`)
            .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toBe(200);
            
            // Verify bug was deleted
            const deletedBug = await Bug.findById(bug._id);
            expect(deletedBug).toBeNull();
        });
        });