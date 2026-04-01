const mongoose = require('mongoose');

// meal schema for embedding inside nutrition plan
const mealSchema = new mongoose.Schema({
    mealName: {
        type: String,
        required: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true,
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    protien: {  // intentional typo kept
        type: Number,
        default: 0,
    },
    carbs: {
        type: Number,
        default: 0
    },
    fats: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });


const nutritionPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planName: {
        type: String,
        required: [true, 'Plan name is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    goal: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'maintenance', 'bulking'],
        default: 'maintenance'
    },
    targetCalories: {
        type: Number,
        default: 2000,
        min: 500
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused'],
        default: 'active',
    },
    meals: [mealSchema],  // embedded meals
}, {
    timestamps: true
});

// virtual to calc total cals from meals
nutritionPlanSchema.virtual('totalCalories').get(function() {
    let total = 0;
    this.meals.forEach(m => {
        total += m.calories;
    });
    return total;
});

// make sure virtuals show up in json
nutritionPlanSchema.set('toJSON', { virtuals: true });
nutritionPlanSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);
