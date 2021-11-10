const router                = require('express').Router();
const criancaController    = require('../controllers/criancaController');
//const tokenController       = require('../controllers/tokenController');

router.get('/buscaReduzidaCrianca/:id', /* tokenController.validation, */ criancaController.buscaReduzidaCrianca);
router.post('/', criancaController.novaCrianca);

module.exports = router;