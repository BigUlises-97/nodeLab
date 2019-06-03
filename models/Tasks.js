const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema({
    compuesto: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    cantidad: {
        type: String,
        required: true
    }
});

const Tasks = mongoose.model('Tasks', TasksSchema);

module.exports = Tasks;