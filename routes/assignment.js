const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { Op } = require('sequelize'); 

const { User,Assignment,AssignmentCreator } = require('../models/user_model.js');
const { getAssignmentbyID, getUserAssignments, postAssignment, removeAssignment, updateAssignment } = require('../controller/assignmentController.js');




router.get('/',getUserAssignments).get('/:id', getAssignmentbyID);

router.post('/',postAssignment);

router.delete('/:id', removeAssignment);

router.put('/:id', updateAssignment);





//router.get('/', getUserAssignments);




/*router.get('/:id',async (req, res) => 
{
    const authorizationHeader = req.headers.authorization;
    const reqQueryId = req.params.id;
    console.log(reqQueryId,"jkvwrjkv wrkjfv wjkrf ");

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
    }
    else
    {
        const currentUser = await validateUser(authorizationHeader);
        if (currentUser)
        {
            var assignmentListForCurrentUser = await currUserAsignments(currentUser);
            console.log(assignmentListForCurrentUser)
            if (assignmentListForCurrentUser.includes(reqQueryId))
            {
                console.log("the give assignment is valid with the user");
                var usersAssignment = await Assignment.findAll({
                    where : {
                        id : reqQueryId
                    }
                });
                console.log("this user is validated ", usersAssignment);
                return res.status(200).json(usersAssignment);
            }  
            else{
                res.status(401).json("Un authorized");
            }
        }
        else
        {
            return res.status(401).json("Un authorized");
        }
        //return res.status(401).json("un authorized");
        
    }
});*/



/*router.get('/', async (req,res) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
      }
    else
    {
        const currentUser = await validateUser(authorizationHeader);
        //console.log(currentUser,"i am here in the current user");
        if (currentUser)
        {
            /*var curr_assignment = await AssignmentCreator.findAll({
                where :
                {
                    userId : currentUser.id
                }
            });

            var assignmentIdForCurrUser = [];

            for (var i=0 ; i<curr_assignment.length;i++)
            {
                assignmentIdForCurrUser.push(curr_assignment[i].assignmentId);
            }
            var currUserAsignments = await Assignment.findAll({
                where: {
                    id: {
                        [Op.in] : assignmentIdForCurrUser
                    }
                }

            });
            var assignmentListForCurrentUser = await currUserAsignments(currentUser)
            console.log(assignmentListForCurrentUser)
            //var currentUserAssignments = 
            return res.status(200).json(assignmentListForCurrentUser);
        }
        else{
            return res.status(401).json("Unauthorized request");
        }
    }
})*/



/*const currUserAsignments = async(presentUser) => {
    //console.log("inside current user assignment")

    var curr_assignment = await AssignmentCreator.findAll({
        where :
        {
            userId : presentUser.id
        }
    });

    var assignmentIdForCurrUser = [];

    for (var i=0 ; i<curr_assignment.length;i++)
    {
        assignmentIdForCurrUser.push(curr_assignment[i].assignmentId);
    }
    var currUserAsignments = await Assignment.findAll({
        where: {
            id: {
                [Op.in] : assignmentIdForCurrUser
            }
        }

    });
    return assignmentIdForCurrUser;

}*/


/*router.post('/', async (req,res) => 
{
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
      }

    const currentUser = await validateUser(authorizationHeader);
    console.log(currentUser.id);

    if (currentUser)
    {
        try{
            const assignment = await Assignment.create
            ({
                //id : req.body.id,
                name : req.body.name,
                points : req.body.points,
                num_of_attempts : req.body.num_of_attempts,
                deadline : req.body.deadline,
                assignment_created : new Date(),
                assignment_updated : new Date()
            })

            const mappedAssignment = await AssignmentCreator.create
            ({
                userId : currentUser.id,
                assignmentId : assignment.id
            })

            console.log(assignment.id);
            res.status(200).json("Successfully created assignment!");
        }
        catch (error)
        {
            res.status(400).json(error.message);
            console.error('Error adding assignment:', error);
        }
    }
    else
    {
        return res.status(400).json("not success");
    }
})*/



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
        return user;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error while validating user:', error);
      return 0;
    }
  };*/



//router.remove()



module.exports = router;
