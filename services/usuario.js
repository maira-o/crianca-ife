const axios = require('axios');

exports.buscaReduzidaUsuario = async (id) => {
    try {
        return await axios.get(`${process.env.APP_USUARIO_URL}/usuario/buscaReduzidaUsuario/${id}`, {
            headers: { 'Content-Type': 'application/json' /* , token: localStorage.getItem('token') */ }
        });
    } catch (err) {
        return (err.response)
    }
}