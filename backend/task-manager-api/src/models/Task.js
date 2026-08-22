const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required and cannot be empty'],
        validate: {
            validator: function(v) {
                return v && v.trim().length > 0;
            },
            message: 'Task title is required and cannot be empty'
        }
    },
    description: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: "Priority must be either 'low', 'medium', or 'high'"
        },
        default: 'medium'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Task must belong to a user']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook that automatically trims whitespace from the title field before saving
taskSchema.pre('save', async function() {
    if (this.title) {
        this.title = this.title.trim();
    }
});

module.exports = mongoose.model('Task', taskSchema);
