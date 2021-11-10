const Usuario   = require('../models/Usuario');
const Educador  = require('../models/Educador');
const Crianca   = require('../models/Crianca');

exports.buscaReduzidaCrianca = async (req, res) => {
    usuarioId = req.params.id
    try {
        const educador = await Educador.findOne({ usuario: usuarioId }).exec();
        if(!educador){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Educador não encontrado' });
        }
        // 200 OK
        res.status(200).json({ status: 200, message: "Sucesso", educador: educador });
    } catch (err){
        console.log("buscaReduzidaEducador > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao buscar Educador" });
    }
}

exports.novaCrianca = async (req, res) => {
    try {
        console.log("req.body >>>")
        console.log(req.body)
        const usuario = req.body.usuario;
        const crianca = req.body.crianca;

        const usuarioExiste = await Usuario.findOne({ _id: usuario._id });
        if(!usuarioExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Usuário não encontrado"});
        }

        if(usuarioExiste.papel !== 2) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Usuário não é criança"});
        }

        const educadorExiste = await Educador.findOne({ usuario: crianca.educadorUsrId });
        if(!educadorExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Educador não encontrado"});
        }

        const criancaExiste = await Crianca.findOne({ usuario: usuarioExiste._id });
        if(criancaExiste) {
            // 406 Not Acceptable
            return res.status(406).send({ status: 406, message: "Criança já registrada"});
        }

        const newCrianca = new Crianca({
            dt_nasc:        crianca.dt_nasc,
            ano_escolar:    crianca.ano_escolar,
            cidade:         crianca.cidade,
            uf:             crianca.uf,
            telefone:       crianca.telefone,
            observacoes:    crianca.observacoes,
            nivel_leitura:  crianca.nivel_leitura,
            usuario:        usuarioExiste._id,
            educador:       crianca.educadorUsrId    // id do usuário logado
        });

        const criancaRes = await newCrianca.save();
        res.status(200).json({ status: 200, message: "Crianca cadastrado com sucesso", crianca: criancaRes });
    } catch (err){
        console.log("novoCrianca > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao registrar crianca", error: err });
    }
}