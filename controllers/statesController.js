const data = require('../model/statesData.json');
const State = require('../model/State');

//All states data returned.
const getAllStates = async (req, res) =>{
    
    const states = await State.find(); 
    if(!states) return res.status(404).json({'message': 'No states found.'});
    
    const resultStates = [];

    //Loops through each state in statesData.
    if(req.query.contig != 'true')
    { //If there is no contig query parameter OR the parameter is set to false.
        let match = false;
        
        for(let i = 0; i < data.length; i++)
        {
            if(req.query.contig === 'false')
            { //If the contig query parameter is set to false, then only HI and AK are returned.
                if(data[i].code === "AK" || data[i].code === "HI")
                {
                    //Loops through each of the data in MongoDB
                    for(let j = 0; j < states.length; j++){
                        if(data[i].code === states[j].stateCode){ //If the code from statesData matches stateCode from MongoDB.
                            //console.log(states[j].stateCode);
                            resultStates.push({...data[i], funfacts: states[j].funfacts});
                            match = true;
                        } 
                    }
                if(!match) 
                { //Makes sure that if the state with the funfact was added, it won't be added again.
                    resultStates.push({...data[i]});
                }   
                match = false;
                }
            } 
            else 
            {
                //Loops through each of the data in MongoDB
                for(let j = 0; j < states.length; j++)
                {
                    if(data[i].code === states[j].stateCode)
                    { //If the code from statesData matches stateCode from MongoDB.
                        //console.log(states[j].stateCode);
                        resultStates.push({...data[i], funfacts: states[j].funfacts});
                        match = true;
                    } 
                }
                if(!match)
                { //Makes sure that if the state with the funfact was added, it won't be added again.
                    resultStates.push({...data[i]});
                }   
                //console.log(data[i].slug);
                match = false;
            }
        }
    } 
    else 
    { //If there is a contig query parameter set to true.
        let match = false;
        //Loops through each state in statesData.
        for(let i = 0; i < data.length; i++)
        {
            if(data[i].code !== "AK" && data[i].code !== "HI")
            {
                //Loops through each of the data in MongoDB
                for(let j = 0; j < states.length; j++)
                {
                    if(data[i].code === states[j].stateCode)
                    { //If the code from statesData matches stateCode from MongoDB.
                        
                        resultStates.push({...data[i], funfacts: states[j].funfacts});
                        match = true;
                    } 
                }
                if(!match)
                { //Makes sure that if the state with the funfact was added, it won't be added again.
                    resultStates.push({...data[i]});
                }   
                match = false;
            } 
        }
    }
    //console.log(resultStates);
    res.json(resultStates);
}


//Creates a new funfact.
const createNewFunfact = async (req, res)=>{

    if(!req?.body?.funfacts || req?.body?.funfacts.length < 1)
    { //If there are no funfacts in body of the request.
        return res.status(400).json({'message': 'State fun facts value required'});
    }

    if(!Array.isArray(req?.body?.funfacts))
    { //If funfacts is NOT an array.
        return res.status(400).json({'message': 'State fun facts value must be an array'});
    }

    const state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        const states = await State.find(); //Retrieves all stateCodes and funfacts from MongoDB.
        let isInDB = false;
        //console.log(req.body.stateCode.toUpperCase());
        //console.log(req.params.state.toUpperCase());
        
        //Loops through each of the data in MongoDB
        for(let j = 0; j < states.length; j++)
        {
            if(req.params.state.toUpperCase() === states[j].stateCode)
            { //If the state is already in MongoDB, it does not need to be added.
             
                /*   if(req.body.stateCode.toUpperCase() !== req.params.state.toUpperCase()){ //If the state in the url is different than what state we want to add to, an error is output.
                    return res.json({'message': 'stateCode and url state must match'});
                }*/

                isInDB = true;      
                states[j].funfacts = states[j].funfacts.concat(req.body.funfacts); //Appends the new funfacts to the current funfacts.  
                const result = await states[j].save();
                return res.json(result);
            } 
        }
        if(!isInDB)
        { //If the state is NOT in MongoDB, it must be added.
          
            /* if(req.body.stateCode.toUpperCase() !== req.params.state.toUpperCase()){ //If the state in the url is different than the body, an error is output.
                return res.json({'message': 'stateCode and url state must match'});
            } */
            
            const result = await State.create({
                stateCode: req.params.state.toUpperCase(),
                funfacts: req.body.funfacts
            });
            return res.status(201).json(result);
        }
    }
}

//Update a funfact.
const updateFunfact = async (req, res) =>{

    if(!req?.body?.index){ //If there is no index in body of the request.
        return res.status(400).json({'message': 'State fun fact index value required'});
    }

    if(typeof req?.body?.funfact !== 'string'){ //If funfact is NOT a string.
        return res.status(400).json({'message': 'State fun fact value required'});
    }

    const state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        const states = await State.find(); //Retrieves all stateCodes and funfacts from MongoDB.

        //Loops through each of the data in MongoDB
        for(let j = 0; j < states.length; j++)
        {
            if(req.params.state.toUpperCase() === states[j].stateCode.toUpperCase())
            { //If the state is already in MongoDB.
                if(states[j].funfacts.length < 1)
                { //If there are no funfacts for state in MongoDB.
                    for(let i = 0; i < data.length; i++)
                    {
                        if(states[j].stateCode.toUpperCase() === data[i].code.toUpperCase())
                        {
                            return res.status(400).json({'message': `No Fun Facts found for ${data[i].state}`});
                        }
                    }  
                }

                //Loop through each funfact for that state.
                for(let e = 0; e < states[j].funfacts.length; e++)
                {
                    if((e + 1) === req?.body?.index)
                    { //Once the correct index has been found.
                        states[j].funfacts[e] = req.body.funfact; //Changes the funfact at the specified index.  
                        const result = await states[j].save(); //Updates the state's funfacts.
                        return res.json(result);
                    }
                }
                for(let i = 0; i < data.length; i++)
                {
                    if(states[j].stateCode.toUpperCase() === data[i].code.toUpperCase())
                    {
                        return res.status(400).json({'message': `No Fun Fact found at that index for ${data[i].state}`});
                    }
                }   
            } 
        }
        for(let i = 0; i < data.length; i++)
        {
            if(req.params.state.toUpperCase() === data[i].code.toUpperCase())
            {
                return res.status(400).json({'message': `No Fun Facts found for ${data[i].state}`});
            }
        }  
    }
}

//Delete a funfact
const deleteFunFact = async (req, res) =>{

    //If there is no index in body of the request.
    if(!req?.body?.index) return res.status(400).json({'message': 'State fun fact index value required'});

    const state = req.params.state.toLowerCase();

    //Checks to see if the statecode on thr url is invalid. 
    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        
        //Retrieves all stateCodes and funfacts from MongoDB.
        const states = await State.find(); 
        let newFunfactArray = [];

        //Loops through each of the data in MongoDB
        for(let j = 0; j < states.length; j++)
        {
            if(req.params.state.toUpperCase() === states[j].stateCode.toUpperCase())
            { //If the state is already in MongoDB.
                if(states[j].funfacts.length < 1)
                { //If there are no funfacts for the state.
                    for(let i = 0; i < data.length; i++)
                    { //Loops through the statesData.json to find the corresponding state so a message can be output to the user.
                        if(states[j].stateCode.toUpperCase() === data[i].code.toUpperCase()) 
                            return res.status(400).json({'message': `No Fun Facts found for ${data[i].state}`});
                    }  
                }

                let indexFound = false;

                //If there is as least ONE funfact, loop through each funfact for the specified state.
                for(let e = 0; e < states[j].funfacts.length; e++)
                {
                    if((e + 1) === req?.body?.index)
                    { //Once the correct index has been found, it will be skipped over.
                        indexFound = true;
                    }
                    else
                    { 
                        newFunfactArray.push(states[j].funfacts[e]); //Pushes all funfacts that the user does NOT want to be deleted.
                    }
                }
                if(!indexFound)
                { //If the index does not exist for that particular state.
                    for(let i = 0; i < data.length; i++)
                    { //Loops through the statesData.json to find the corresponding state so a message can be output to the user.
                    if(states[j].stateCode.toUpperCase() === data[i].code.toUpperCase())
                        return res.status(400).json({'message': `No Fun Fact found at that index for ${data[i].state}`});
                    } 
                }
                else 
                { //If the index was found.
                    states[j].funfacts = newFunfactArray; //Sets the state to the new array of funfacts - the removed index.  

                    const result = await states[j].save(); //Updates the state's funfacts.
                    return res.json(result);
                }
                  
            } 
        } 
        for(let i = 0; i < data.length; i++)
        { //Loops through the statesData.json to find the corresponding state so a message can be output to the user.
            if(state.toUpperCase() === data[i].code.toUpperCase()) 
                return res.status(400).json({'message': `No Fun Facts found for ${data[i].state}`});
        }  
    }
    
}

//Get a state and all of its information.
const getState = async (req, res) =>{
    
    if(!req?.params?.state)
    {
        return res.status(400).json({'message': 'State required'});
    } 

    const state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        const states = await State.find(); //Retrieves all stateCodes and funfacts from MongoDB.
        if(!states) return res.status(204).json({'message': 'No states found.'});

        for(let i = 0; i < data.length; i++)
        { //Loop through all the statesData.json
            //console.log(data[i].code);
            if(data[i].code.toLowerCase() == state)
            { //If the state code matches the state parameter
                
                for(let j = 0; j < states.length; j++)
                { //Loops through each of the data in MongoDB
                    if(data[i].code === states[j].stateCode)
                    { //If the code from statesData matches stateCode from MongoDB.
                        //console.log(states[j].stateCode);
                        //resultState.push({...data[i], funfacts: states[j].funfacts});

                        const resultState = { //Sets a new object to the state's statesData data, plus the funfacts from MongoDB.
                            ...data[i],
                            funfacts: states[j].funfacts
                        }
                        return res.json(resultState);
                    } 
                }
                const resultState = {
                    ...data[i]
                }
                return res.json(resultState);
            } 
        }
    }
}

//Returns a random fun fact.
const getFunfact = async (req, res) =>{

    if(!req?.params?.state)
    {
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        state = state.toUpperCase();
        const stateInfo = await State.findOne({stateCode: `${state}`}); //Retrieves the stateCode and funfacts from MongoDB.

        for(let i = 0; i < data.length; i++)
        { //Loop through all the statesData.json
            if(data[i].code == state)
            { //If the state code matches the state parameter
                if(stateInfo == null)
                { //If the state is NOT located in MongoDB
                    return res.status(404).json({'message': `No Fun Facts found for ${data[i].state}`});
                } 
                else if(data[i].code === stateInfo.stateCode)
                { //If the code from statesData matches stateCode from MongoDB.
                    const randomIndex = Math.floor(Math.random() * stateInfo.funfacts.length);    
                    const randomFact = stateInfo.funfacts[randomIndex];
                    const resultState = { //Sets a new object to the state's statesData data, plus the funfacts from MongoDB.
                        funfact: randomFact
                    }
                    return res.json(resultState);
                }
            } 
        } 
    }
}

//Returns the capital of the specified state.
const getCapital = async (req, res) =>{

    if(!req?.params?.state){
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        state = state.toUpperCase();
        
        for(let i = 0; i < data.length; i++)
        { //Loop through all the statesData.json
            if(data[i].code == state)
            { //If the state code matches the state parameter
                const resultState = { //Sets a new object to the state's statesData data.
                    state: data[i].state,
                    capital: data[i].capital_city
                }
                return res.json(resultState);
            } 
        } 
    }
}

//Returns the nickname of the specified state.
const getNickname = async (req, res) =>{

    if(!req?.params?.state)
    {
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        state = state.toUpperCase();

        for(let i = 0; i < data.length; i++)
        { //Loop through all the statesData.json
            if(data[i].code == state)
            { //If the state code matches the state parameter
                const resultState = { //Sets a new object to the state's statesData data.
                    state: data[i].state,
                    nickname: data[i].nickname
                }
                return res.json(resultState);
            } 
        } 
    }
}

//Returns the population of the specified state.
const getPopulation = async (req, res) =>{

    if(!req?.params?.state)
    {
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        state = state.toUpperCase();

        for(let i = 0; i < data.length; i++)
        { //Loop through all the statesData.json
            if(data[i].code == state)
            { //If the state code matches the state parameter
                const resultState = { //Sets a new object to the state's statesData data.
                    state: data[i].state,
                    population: data[i].population.toLocaleString("en-US")
                }
                return res.json(resultState);
            } 
        } 
    }
}

//Returns the admission date of the specified state.
const getAdmission = async (req, res) =>{
    if(!req?.params?.state)
    {
        return res.status(400).json({'message': 'State required'});
    } 

    let state = req.params.state.toLowerCase();

    if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
    && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
    && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
    && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
    && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
    && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
    && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
    && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
    && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
    && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
    {
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    } 
    else 
    { //If the statecode is valid:
        state = state.toUpperCase();

        for(let i = 0; i < data.length; i++)
        { //Loop through all the statesData.json
            if(data[i].code == state)
            { //If the state code matches the state parameter
                const resultState = { //Sets a new object to the state's statesData data.
                    state: data[i].state,
                    admitted: data[i].admission_date.toLocaleString("en-US")
                }
                return res.json(resultState);
            } 
        } 
    }
}

module.exports = {
    getAllStates,
    createNewFunfact,
    updateFunfact,
    deleteFunFact,
    getState,
    getFunfact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
}
