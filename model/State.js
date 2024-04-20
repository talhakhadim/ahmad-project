const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: [{
        type: String,
    }]
});

module.exports = mongoose.model("State", stateSchema);

// g) You are not expected to provide fun facts for all 50 states. Instead, provide at minimum of 3 fun
// facts for each of the following 5 states: (this site might be handy: 50states.com)
// i) Kansas
// ii) Missouri
// iii) Oklahoma
// iv) Nebraska
// v) Colorado

const data=[
    {
        stateCode: "KS",
        funfacts: [
            "Kansas produces enough wheat each year to feed everyone in the world for about two weeks.",
            "Kansas is known as the Sunflower State.",
            "Kansas is the home of the first Pizza Hut.",
            
        ]
    },
    {
        stateCode: "MO",
        funfacts: [
            "Missouri is known as the Show Me State.",
            "The Gateway Arch in St. Louis is the tallest monument in the United States.",
            "Missouri was the first state to free its slaves.",
        ]
    },
    {
        stateCode: "OK",
        funfacts: [
            "Oklahoma is home to the world’s largest concrete totem pole.",
            "Oklahoma  is the only state that produces iodine.",
            "Oklahoma is the only state that produces iodine.",
        ]
    },
    {
        stateCode: "NE",
        funfacts: [
            "Nebraska is the birthplace of the Reuben sandwich.",
            "Nebraska has more miles of river than any other state.",
            "Nebraska is the birthplace of the Reuben sandwich.",
        ]
    },
    {
        stateCode: "CO",
        funfacts: [
            "Colorado is home to the world’s largest flat-top mountain.",
            "Colorado is the only state in history to turn down the Olympics.",
            "Colorado is home to the world’s largest flat-top mountain.",
        ]
    }

]

