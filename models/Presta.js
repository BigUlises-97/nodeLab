const mongoose = require('mongoose');

const PrestaSchema = new mongoose.Schema({
    responsable: {
        type: String,
        required: true
    },
    herramienta: {
        type: String,
        required: true
    },
    limite: {
        type: String,
        required: true
    },
    fechaAdquisicion: {
        type: Date,
        default: Date.now()
    }
});

const Presta = mongoose.model('Presta', PrestaSchema);

module.exports = Presta;