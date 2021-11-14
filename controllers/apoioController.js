const Joi       = require('joi')
const Usuario   = require('../models/Usuario');
const Apoio     = require('../models/Apoio');

exports.buscaApoios = async (req, res) => {
    try {
        const apoios = await Apoio.find({ isActive: true }).sort({ createAt: 'asc' }).exec();
        if(!apoios){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Não existem solicitações de apoio no momento' });
        }
        if(apoios.length === 0){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Não existem solicitações de apoio no momento' });
        }
        
        res.status(200).json({ status: 200, message: "Sucesso", apoios: apoios });
    } catch (err){
        console.log("buscaApoios > err >>>")
        console.log(err)
        res.status(500).send({ status: 500, message: "Erro ao buscar apoios" });
    }
}

exports.novoApoio = async (req, res) => {
    try {
        const userLoggedId = '61873f5d6212a24abe8dd210' // >>> APAGAR <<<

        const { valor, pix, telefone, livro, criancaUsrId } = req.body
        const apoio = {
            valor:      valor,
            pix:        pix,
            telefone:   telefone,
            livro:      livro,
            educador:   userLoggedId,     // id do usuário logado (req.user._id)
            crianca:    criancaUsrId
        }

        let { error } = await validaApoio(apoio);
        if(error){
            console.log("novoApoio > validaApoio > error >>>")
            console.log(error.details[0].message)
            // 406 Not Acceptable
            return res.status(406).send({ status: 406, message: 'O objeto enviado é inválido (dados do apoio)' });
        }

        const criancaExiste = await Usuario.findOne({ _id: apoio.crianca, papel: 2 });
        if(!criancaExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Cadastro de usuário da criança não encontrado"});
        }

        const educadorExiste = await Usuario.findOne({ _id: apoio.educador, papel: 1 });
        if(!educadorExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Cadastro de usuário do educador não encontrado"});
        }
        const newApoio = new Apoio(apoio)
        const apoioRes = await newApoio.save();
        res.status(200).json({ status: 200, message: "Apoio cadastrado com sucesso", apoio: apoioRes });
    } catch (err){
        console.log("novoApoio > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao registrar apoio", error: err });
    }
}

exports.inativaApoio = async (req, res) => {
    try {
        const userLoggedId  = '61873f5d6212a24abe8dd210' // >>> APAGAR <<<
        const filter        = { _id: req.params.id } // apoioId

        const educadorExiste = await Usuario.findOne({ _id: userLoggedId, papel: 1 }).exec(); // id do usuário logado (req.user._id)
        if(!educadorExiste){
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: 'Educador não encontrado' });
        }

        let apoioExiste = await Apoio.findOne({ _id: req.params.id, educador: userLoggedId }).exec(); // id do usuário logado (req.user._id)
        if(!apoioExiste){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Apoio não encontrado ou não pertence ao educador' });
        }

        // 200 OK
        apoioExiste.isActive = false
        await Apoio.findOneAndUpdate(filter, apoioExiste).exec();
        res.status(200).json({ status: 200, message: "Sucesso" });
    } catch (err){
        console.log("inativaApoio > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao excluir apoio", error: err });
    }
}

const validaApoio = (apoio) => {
    const schema = Joi.object({
        valor:      Joi.number().required(),
        pix:        Joi.string().required(),
        telefone:   Joi.string().min(12).max(15).required(),
        livro:      Joi.string().required(),
        educador:   Joi.string().required(),
        crianca:    Joi.string().required()
    });
    return schema.validate(apoio);
}