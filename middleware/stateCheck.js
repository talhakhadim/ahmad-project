const data= require('../model/statesData.json');
module.exports = (req, res, next) => {
    //get the states codes from the data
    const stateCodes = data.map(state => state.code.toLowerCase());
    const stateCode = req.params?.state?.toLowerCase();
    if(!stateCode){
        return res.status(400).json({'message': 'State required'});
    }
    else if(!stateCodes.includes(stateCode)){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }else{
        next();
    }

}