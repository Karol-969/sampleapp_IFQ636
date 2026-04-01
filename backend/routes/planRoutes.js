const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createNewPlan,
    getAllPlans,
    fetchPlanById,
    modifyPlan,
    removePlan,
    addMealToPlan,
    deleteMealFromPlan,
} = require('../controllers/planController');

// all routes are protected - user must be logged in
router.route('/')
    .get(protect, getAllPlans)
    .post(protect, createNewPlan);

router.route('/:id')
    .get(protect, fetchPlanById)
    .put(protect, modifyPlan)
    .delete(protect, removePlan);

// meal sub-routes
router.post('/:id/meals', protect, addMealToPlan);
router.delete('/:id/meals/:mealId', protect, deleteMealFromPlan);

module.exports = router;
