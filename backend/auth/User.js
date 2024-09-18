const mongodb = require("mongodb");
const bcrypt = require("bcrypt");
const axios = require("axios");

require("dotenv").config(); //for reading .env files
// const mongo_client = new mongodb.MongoClient(process.env.DB_URL);

User = (function(){

    /**
     * - Checks if a user exists already...
     * - does the checking by using their username
     * @param {*} username 
     */
    const checkUserExistsByUsername = async (username) => {

    // sends the request to the backend
        let feedback = await axios.get("http://process.env.BASTION_IP/submit");



        response.send({
            message: "Application submitted successfully!",
            feedback: feedback
        })

    }


    const checkUserExistsByEmail = async (email) => {
        const check_user_email = await mongo_client.db(process.env.DB_NAME).collection("users").findOne({"email": email });

        if(check_user_email){
            return {
                message: "user email exists already",
                data: check_user_email,
                code: "success"
            }
        }

        return {
            message: "invalid email",
            data: null,
            code: "error"
        }



    }


    /**
     * Creates a new account
     */
    const createNewAccount = async (user) => {
        const {firstname, lastname, username, email, password } = user


        //hash the password
        const hashed_password = await bcrypt.hash(password, 10);

        const create_account = mongo_client.db(process.DB_NAME).collection("users").insertOne({
            firstname, lastname, email, username, password: hashed_password
        })

        if(create_account){
            return {
                message: "Account created successfully!",
                code: "success",
                data: {
                    firstname,
                    lastname, 
                    email,
                    username
                },
            }
        }


        return {
            message: "Could not create an account",
            code: "error",
            data: null
        }

    }



    const loginUser = async (username, password) => {

            //check that the username exists
            const check_user_exists = await checkUserExistsByUsername(username);

            if(check_user_exists.code === "error"){
                //this user does not exist
                return {
                    message: "User does not exist",
                    code: "error",
                    type: "login-user"
                }
            }

            //the user's data will be available on the data attribute
            const retrieved_user_data = check_user_exists.data; 

            //get the hashed passwor
            const hashed_password = retrieved_user_data.password;

            console.log("User data retrieved: ", retrieved_user_data)
           
            //check that the password is correct
            const compare_password_result = await bcrypt.compare(password, hashed_password)

            if(!compare_password_result){
                //this user does not exist
                return {
                    message: "Invalid Username/Password Combination!",
                    code: "error",
                    data: null,
                    type: "login-user",
                }

            }


            //login the user
            return {
                message: "User may be logged in", 
                code: "success",
                data: check_user_exists,
                type: "login-user"
            }


    }




    return {
        checkUserExistsByUsername,
        createNewAccount,
        checkUserExistsByEmail,
        loginUser
    }





})()



module.exports = User;