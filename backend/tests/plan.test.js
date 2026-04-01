const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

// test variables
let authToken = '';
let testPlanId = '';
let testMealId = '';

describe('Nutrition Plan API Tests', () => {

    // register and login first to get token
    before(async () => {
        // register a test user
        const uniqueEmail = `testuser_${Date.now()}@test.com`;
        await chai.request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: uniqueEmail,
                password: 'password123'
            });

        // login to get token
        const loginRes = await chai.request(app)
            .post('/api/auth/login')
            .send({
                email: uniqueEmail,
                password: 'password123'
            });

        authToken = loginRes.body.token;
    });

    describe('POST /api/plans', () => {
        it('should create a new nutrition plan', async () => {
            const res = await chai.request(app)
                .post('/api/plans')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    planName: 'My Weight Loss Plan',
                    description: 'Testing plan creation',
                    goal: 'weight_loss',
                    targetCalories: 1800,
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('planName', 'My Weight Loss Plan');
            expect(res.body).to.have.property('goal', 'weight_loss');
            testPlanId = res.body._id;
        });

        it('should fail without plan name', async () => {
            const res = await chai.request(app)
                .post('/api/plans')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    description: 'no name plan',
                });

            expect(res).to.have.status(400);
        });
    });

    describe('GET /api/plans', () => {
        it('should get all user plans', async () => {
            const res = await chai.request(app)
                .get('/api/plans')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.greaterThan(0);
        });
    });

    describe('GET /api/plans/:id', () => {
        it('should get a single plan', async () => {
            const res = await chai.request(app)
                .get(`/api/plans/${testPlanId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('planName');
        });

        it('should return 404 for non existant plan', async () => {
            const res = await chai.request(app)
                .get('/api/plans/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(404);
        });
    });

    describe('PUT /api/plans/:id', () => {
        it('should update a plan', async () => {
            const res = await chai.request(app)
                .put(`/api/plans/${testPlanId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    planName: 'Updated Plan Name',
                    targetCalories: 2200,
                    status: 'active'
                });

            expect(res).to.have.status(200);
            expect(res.body.planName).to.equal('Updated Plan Name');
        });
    });

    describe('POST /api/plans/:id/meals', () => {
        it('should add a meal to the plan', async () => {
            const res = await chai.request(app)
                .post(`/api/plans/${testPlanId}/meals`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    mealName: 'Grilled Chicken Salad',
                    mealType: 'lunch',
                    calories: 450,
                    protien: 35,
                    carbs: 20,
                    fats: 15,
                });

            expect(res).to.have.status(201);
            expect(res.body.meals).to.be.an('array');
            expect(res.body.meals.length).to.equal(1);
            testMealId = res.body.meals[0]._id;
        });

        it('should fail without required meal fields', async () => {
            const res = await chai.request(app)
                .post(`/api/plans/${testPlanId}/meals`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    mealName: 'Incomplete Meal'
                    // missing mealType and calories
                });

            expect(res).to.have.status(400);
        });
    });

    describe('DELETE /api/plans/:id/meals/:mealId', () => {
        it('should remove a meal from plan', async () => {
            const res = await chai.request(app)
                .delete(`/api/plans/${testPlanId}/meals/${testMealId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body.meals.length).to.equal(0);
        });
    });

    describe('DELETE /api/plans/:id', () => {
        it('should delete the plan', async () => {
            const res = await chai.request(app)
                .delete(`/api/plans/${testPlanId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
        });
    });
});
