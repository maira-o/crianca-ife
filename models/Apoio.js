const   mongoose    = require('mongoose');
var     Schema      = mongoose.Schema;

const apoioSchema = new Schema({
    valor: {
        type: Number,
        required: true
    },
    pix: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    livro: {
        type: String,
        required: true
    },
    educador: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    crianca: {
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

apoioSchema.index({'$**': 'text'});

module.exports = mongoose.model('Apoio', apoioSchema)