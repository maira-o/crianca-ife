const router            = require('express').Router();
const criancaController = require('../controllers/criancaController');

router.get('/buscaReduzidaCrianca/:id',     criancaController.buscaReduzidaCrianca);
router.get('/buscaCriancasEducador/:id',    criancaController.buscaCriancasEducador);
router.post('/',                            criancaController.novaCrianca);
router.delete('/:id',                       criancaController.apagaCrianca);
router.delete('/educador/:id',              criancaController.apagaCriancasEducador);

module.exports = router;