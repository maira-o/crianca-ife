const router            = require('express').Router();
const apoioController   = require('../controllers/apoioController');
//const tokenController = require('../controllers/tokenController');

router.get('/', /* tokenController.validation, */ apoioController.buscaApoios);
router.post('/', /* tokenController.validation, */ apoioController.novoApoio);
router.delete('/:id', /* tokenController.validation, */ apoioController.inativaApoio);

module.exports = router;