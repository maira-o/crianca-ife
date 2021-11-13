const Usuario   = require('../models/Usuario');
const Apoio     = require('../models/Apoio');

exports.buscaApoios = async (req, res) => {
    try {
        let apoios = await Apoio.find({ isActive: true }).sort({ createAt: 'asc' }).exec();
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
        const newApoio = new Apoio({
            valor:      valor,
            pix:        pix,
            telefone:   telefone,
            livro:      livro,
            educador:   userLoggedId,     // id do usuário logado (req.user._id)
            crianca:    criancaUsrId
        })

        console.log("newApoio")
        console.log(newApoio)
        const criancaExiste = await Usuario.findOne({ _id: newApoio.crianca, papel: 2 });
        if(!criancaExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Cadastro de usuário da criança não encontrado"});
        }

        const educadorExiste = await Usuario.findOne({ _id: newApoio.educador, papel: 1 });
        if(!educadorExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Cadastro de usuário do educador não encontrado"});
        }

        const apoio = await newApoio.save();
        res.status(200).json({ status: 200, message: "Apoio cadastrado com sucesso", apoio: apoio });
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
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Educador não encontrado' });
        }

        let apoioExiste = await await Apoio.findOne({ _id: req.params.id, educador: userLoggedId }).exec(); // id do usuário logado (req.user._id)
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
        res.status(500).send({ status: 500, message: "Erro ao excluir apoio" });
    }
}