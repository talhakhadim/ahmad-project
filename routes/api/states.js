const express = require('express');
const checkState = require('../../middleware/stateCheck');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)

router.route('/:state').get (checkState, statesController.getState);
router.route('/:state/funfact')
    .get(checkState,statesController.getFunfact)
    .patch(checkState,statesController.updateFunfact)
    .post(checkState,statesController.createNewFunfact)
    .delete(checkState,statesController.deleteFunFact);

router.route('/:state/capital')
    .get(checkState,statesController.getCapital);

router.route('/:state/nickname')
    .get(checkState,statesController.getNickname);

router.route('/:state/population')
    .get(checkState,statesController.getPopulation);

router.route('/:state/admission')
    .get(checkState,statesController.getAdmission);
    
module.exports = router;
