const NutritionPlan = require('../models/NutritionPlan');

// @desc    create new nutrition plan
// @route   POST /api/plans
const createNewPlan = async (req, res) => {
    try {
        const { planName, description, goal, targetCalories, startDate, endDate } = req.body;

        if (!planName) {
            return res.status(400).json({ message: 'Plan name is requried' });
        }

        const plan = await NutritionPlan.create({
            user: req.user._id,
            planName,
            description: description || '',
            goal: goal || 'maintenance',
            targetCalories: targetCalories || 2000,
            startDate: startDate || Date.now(),
            endDate: endDate || null,
        });

        res.status(201).json(plan);
    } catch (err) {
        console.log('Error creating plan:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// @desc    get all plans for logged in user
// @route   GET /api/plans
const getAllPlans = async (req, res) => {
    try {
        const plans = await NutritionPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    get single plan by id
// @route   GET /api/plans/:id
const fetchPlanById = async (req, res) => {
    try {
        const plan = await NutritionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // check if user owns this plan
        if (plan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this plan' });
        }

        res.json(plan);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    update a plan
// @route   PUT /api/plans/:id
const modifyPlan = async (req, res) => {
    try {
        const plan = await NutritionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authrized' });
        }

        // update fields
        const { planName, description, goal, targetCalories, startDate, endDate, status } = req.body;

        plan.planName = planName || plan.planName;
        plan.description = description !== undefined ? description : plan.description;
        plan.goal = goal || plan.goal;
        plan.targetCalories = targetCalories || plan.targetCalories;
        plan.startDate = startDate || plan.startDate;
        plan.endDate = endDate || plan.endDate;
        plan.status = status || plan.status;

        const updatedPlan = await plan.save();
        res.json(updatedPlan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc   delete a plan
// @route  DELETE /api/plans/:id
const removePlan = async (req, res) => {
    try {
        const plan = await NutritionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // verify ownership
        if (plan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete' });
        }

        await NutritionPlan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Plan removed successfully' });
    } catch (err) {
        console.log('delete error:', err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    add a meal to plan
// @route   POST /api/plans/:id/meals
const addMealToPlan = async (req, res) => {
    try {
        const plan = await NutritionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { mealName, mealType, calories, protien, carbs, fats, notes } = req.body;

        if (!mealName || !mealType || calories === undefined) {
            return res.status(400).json({ message: 'Meal name, type and calories are required' });
        }

        const newMeal = {
            mealName,
            mealType,
            calories,
            protien: protien || 0,
            carbs: carbs || 0,
            fats: fats || 0,
            notes: notes || ''
        };

        plan.meals.push(newMeal);
        const savedPlan = await plan.save();

        res.status(201).json(savedPlan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    remove meal from a plan
// @route   DELETE /api/plans/:id/meals/:mealId
const deleteMealFromPlan = async (req, res) => {
    try {
        const plan = await NutritionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // find the meal index
        const mealIdx = plan.meals.findIndex(
            m => m._id.toString() === req.params.mealId
        );

        if (mealIdx === -1) {
            return res.status(404).json({ message: 'Meal not found in this plan' });
        }

        plan.meals.splice(mealIdx, 1);
        await plan.save();

        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    createNewPlan,
    getAllPlans,
    fetchPlanById,
    modifyPlan,
    removePlan,
    addMealToPlan,
    deleteMealFromPlan,
};
