const { User,Assignment } = require('./models/user_model.js');
const { uuid } = require('uuidv4');
const { parse } = require('csv-parse');
const fs = require('fs');
const bcrypt = require('bcrypt');



async function createUsers( firstname, lastname, emailID, passwd)
{
    try
    {
        //const { User } = require('./models/user.js');
        const user = await User.create
        ({
            id: uuid(),
            first_name: firstname,
            last_name: lastname,
            password:  passwordHash(passwd,10),
            email: emailID,
            account_created: new Date(),
            account_updated: new Date(),
            //accountNew : "1"
          });
          //await user.save();
          console.log(`${emailID} created successfully! with id : ${user.id}`);
    }
    catch (error)
    {
        if (error.original.errno === 1062)
        {
            console.error(`User ${emailID} already exist`);
        }
        else
        {
            console.error("Error",error.original);
        }
    }

};


function passwordHash(myPlaintextPassword,saltRounds)
{
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    return hash;
}


function processCSVFile () {
    console.log("inside csv process");
    fs.createReadStream("./opt/user.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        createUsers(row[0], row[1], row[2], row[3]);
    })
    .on("error", function (error) {
        console.log(error.message);
    })
    .on("end", function () {
        console.log("finished");
    });
}


module.exports = { createUsers, processCSVFile };