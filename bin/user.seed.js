const mongoose = require("mongoose");
const User = require("../models/user.model");
require("../db/index");

const users = {
username:"The chef of the house",
password:"",
email: "thechefofthehouse@chefofthehouse.me",
description:"I live for cooking",
imageUrl:"",
foodPreferences:["omnivorous"],
recipesMade :[],
recipesLiked :[],
}

User.deleteMany()
.then(() =>{

    User.create(users)
    .then((usersObj) => {
        console.log(`${usersObj.length} recipes have been added to the database`)
        mongoose.connection.close()
    })
})
.catch((err) => console.log("Opps there was an error: ", err))