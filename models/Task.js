//Decimal128

const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
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

const Task = mongoose.model('Tasks', TaskSchema);

module.exports = Task;