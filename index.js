const express = require('express');
const sequelize = require('./database.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const bcrypt = require('bcrypt');
const {uuid} = require('uuidv4');
const bodyParser = require('body-parser');
const { UserSchema, AssignmentSchema} = require('./models/user_model.js');
const assignmentRoute = require('./routes/assignment.js');
const { createUsers, processCSVFile } = require('./userCreate.js')
const  healthCheckRoutes  = require('./routes/healthCheck.js');

//fs.createReadStream('./opt/user.csv');

//app.use(bodyParser.json());

/*function isValidJson(value) {
    try {
        JSON.parse(JSON.stringify(value));
        return true;
    } catch (error) {
        return false;
    }
}*/


const app = express();
app.use(bodyParser.json());


function isValidJson(req,res,next) {
    try {
        JSON.parse(JSON.stringify(req.body));
        next();
    } catch (error) 
    {
        console.log("i am valid function",error);
        res.status(400).json();
    }
}


function isEmptyRequest(req, res, next) {
    if (Object.keys(req.body).length === 0 && Object.keys(req.params).length === 0) 
    {
        next();
    }
    else
    {
        return res.status(400).json();
    }
}


/*app.use('/v1/assignments', (req, res, next) => {

    if (isValidJson(req.body)) 
    {
        next();
         // Continue to the next middleware or route handler
    } 
    else 
    {
        res.status(400);
    }

});*/


const setCustomHeaders = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept,Origin');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.setHeader('ETag', 'W/"a9-N/X4JXf/69QQSQ1CLHMNPzj473I"');
    res.setHeader('Expires', '-1');
    next(); // Move to the next middleware or route handler
};





app.use('/v1/assignments', isValidJson, assignmentRoute);
app.use('/healthz', isValidJson, isEmptyRequest, healthCheckRoutes);

app.use('*', (req,res) => {
    res.status(404).json();
})


//app.use(setCustomHeaders);

const { User,Assignment,AssignmentCreator } = require('./models');
//const {  } = require('./models/assignment.js');
const { UUID, UUIDV4, UniqueConstraintError } = require('sequelize');



async function bootstrapDatabase() {
    //console.log('inside the bootstrap')
    try {
      await sequelize.authenticate();
      console.log('Connected to the database');
      //const pendingMigrations = await sequelize.getMigrator().findPending();
      await sequelize.sync();
      //await sequelize.UserSchema.sync({alter: true})
      //await sequelize.AssignmentSchema.sync({alter: true})
      console.log('Database bootstrapped successfully');
      return true;
    } 
    catch (error) 
    {
        console.log(error);
        if (error.original.errno === -61)
        {
            console.error("Connection refused error");
        }
        else
        {
            console.error('Error bootstrapping the database:', error);
        }
        return false;
    }
  }





/*function passwordHash(myPlaintextPassword,saltRounds)
{
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    return hash;
}*/


//below function creates the users with the data given in the csv file

/*async function createUsers( firstname, lastname, emailID, passwd)
{
    try
    {
        //const { User } = require('./models/user.js');
        const user = await User.build
        ({
            id: uuid(),
            first_name: firstname,
            last_name: lastname,
            password:  passwordHash(passwd,10),
            email: emailID,
            account_created: new Date(),
            account_updated: new Date(),
          });
          await user.save();
          console.log(`${emailID} created successfully! with id : ${user.id}`);
    }
    catch (error)
    {
        console.error('User already exist',error);
    }

}*/

//createUsers("jan", "doe", "hello@123", "bar@gmail.com");


//const addUser() => ({})


/*app.get('/v1/assignments/:id',async (req, res) => {

    var assignment = await Assignment.findAll({
        where : {
            id : req.params.id
        }
    })

    res.json(assignment).status(200);
});*/


/*app.get('/v1/assignments', async (req,res) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
      }
    else
    {
        const currentUser = await validateUser(authorizationHeader);
        console.log(currentUser,"i am here in the current user");
        if (currentUser)
        {
            var curr_assignment = await Assignment.findAll()
            return res.json(curr_assignment).status(200);
        }
        else{
            return res.json("User not found").status(401);
        }
    }

})*/


/*app.post('/v1/assignments', async (req,res) => 
{
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
      }

    const currentUser = await validateUser(authorizationHeader);

    if (currentUser)
    {
        try{
            const assignment = await Assignment.create
            ({
                id : req.body.id,
                name : req.body.name,
                points : req.body.points,
                num_of_attempts : req.body.num_of_attempts,
                deadline : req.body.deadline,
                assignment_created : new Date(),
                assignment_updated : new Date()
            })
            res.status(200).json("Successfully created assignment!");
        }
        catch (error)
        {
            console.error('Error adding assignment:', error);
        }
    }
    else
    {
        return res.status(400).json("not success");
    }
})*/

//bootstrapDatabase();

const userExist = async (id) => {
    try{
        const users = await User.findAll({
            where: {
                id : id
            }
        })
        console.log(users);
        return users.length>0;
    }
    catch (error)
    {
        console.error('Error while searching for the user:', error);
        return false;
    }
}


/*const validateUser = async (authorizationHeader) => {
    try {
      // Extract the base64-encoded credentials from the Authorization header
      const base64Credentials = authorizationHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
  
      // Find the user by username
      const user = await User.findOne({ where: { email: username } });
  
      // If no user is found, return null (user not found)
      if (!user) {
        //console.log("I am returning null");
        return null;
      }
  
      // Compare the provided password with the hashed password in the database
      console.log("i am going here now")
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log("password is matched here")
      console.log(passwordMatch)
  
      // If the passwords match, return the user object; otherwise, return null
      if (passwordMatch) {
        //console.log(user)
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error while validating user:', error);
      return 0;
    }
  };*/

function startServer() {
    const port = 8080;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}


async function main() {
    try {
      // Bootstrap the database
      if (await bootstrapDatabase())
      {
        processCSVFile();
        startServer();
        console.log("success")
      }
      else
      {
        startServer();
        console.log("failure");
      }
  
      // Start the server
      //startServer();

      //processCSVFile();

      //startServer();
  
      // Create users
      //createUsers("jan", "doe", "hello@123", "bar@gmail.com");
      /*fs.createReadStream("./opt/user.csv")
      .pipe(parse({ delimiter: ",", from_line: 1 }))
      .on("data", function (row) {
        createUsers(row[0], row[1], row[2], row[3]);
    })
    .on("error", function (error) {
        console.log(error.message);
    })
    .on("end", function () {
        console.log("finished");
    });*/

    } catch (error) {
      console.error('Error in main:', error);
    }
  }



main();

module.exports = app;