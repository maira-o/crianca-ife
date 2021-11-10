const   mongoose    = require('mongoose');
var     Schema      = mongoose.Schema;

const criancaSchema = new Schema({
    dt_nasc: {
        type: Date,
        required: true
    },
    ano_escolar: {
        type: Number,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    uf: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    observacoes: {
        type: String,
    },
    nivel_leitura: {
        type: Number,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: 'Usuario'
    },
    educador: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

criancaSchema.index({'$**': 'text'});

module.exports = mongoose.model('Crianca', criancaSchema)