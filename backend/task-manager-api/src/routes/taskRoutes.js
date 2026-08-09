const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateId = require('../middleware/validateId');

router.get('/', taskController.getAllTasks);
router.get('/:id', validateId, taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', validateId, taskController.updateTask);
router.delete('/:id', validateId, taskController.deleteTask);

module.exports = router;
