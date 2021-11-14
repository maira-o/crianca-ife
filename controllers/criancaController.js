const Usuario           = require('../models/Usuario');
const Educador          = require('../models/Educador');
const Crianca           = require('../models/Crianca');
const usuarioService    = require('../services/usuario');

exports.buscaReduzidaCrianca = async (req, res) => {
    criancaUsrId = req.params.id
    try {
        const crianca = await Crianca.findOne({ usuario: criancaUsrId }).exec();
        if(!crianca){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Criança não encontrada' });
        }
        // 200 OK
        res.status(200).json({ status: 200, message: "Sucesso", crianca: crianca });
    } catch (err){
        console.log("buscaReduzidaCrianca > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao buscar Criança" });
    }
}

exports.buscaCriancasEducador = async (req, res) => {
    educadorUsrId = req.params.id
    try {
        const criancasReduzido = await Crianca.find({ educador: educadorUsrId }).sort({ cidade: 'asc' }).exec();
        if(!criancasReduzido){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Crianças não encontradas' });
        }
        if(criancasReduzido.length === 0){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Crianças não encontradas' });
        }

        // 200 OK
        res.status(200).json({ status: 200, message: "Sucesso", criancas: await completaCriancas(criancasReduzido) });    
    } catch (err){
        console.log("buscaCriancasEducador > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao buscar Crianças" });
    }
}

exports.novaCrianca = async (req, res) => {
    try {
        console.log("req.body >>>")
        console.log(req.body)
        const usuario = req.body.usuario;
        const crianca = req.body.crianca;

        const usuarioExiste = await Usuario.findOne({ _id: usuario._id, papel: 2 });
        if(!usuarioExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Cadastro de usuário da criança não encontrado"});
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
        res.status(200).json({ status: 200, message: "Crianca cadastrada com sucesso", crianca: criancaRes });
    } catch (err){
        console.log("novaCrianca > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao registrar crianca", error: err });
    }
}

const completaCriancas = async (incompletas) => {
    let completas = []
    for (var i = 0; i < incompletas.length; i++) {  // >>> FOR funciona <<<
        let result      = await usuarioService.buscaReduzidaUsuario(incompletas[i].usuario)
        result          = result.data.usuario
        result.crianca  = incompletas[i]
        completas.push(result)
    }
    return completas
}

/*     let completos = []
    await incompletos.forEach(                      // >>> FOREACH não funciona <<<
        async (crianca) => {
            let result      = await usuarioService.buscaReduzidaUsuario(crianca.usuario)
            result          = result.data.usuario
            result.crianca  = crianca
            completos.push(result)
        }
    )
    return await completos */


/*     return await incompletos.map(                // >>> MAP não funciona <<<
        async (crianca) => {
            let result      = await usuarioService.buscaReduzidaUsuario(crianca.usuario)
            result          = result.data.usuario
            result.crianca  = crianca
            return await result
        }
    ) */