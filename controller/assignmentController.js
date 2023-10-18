const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User,Assignment,AssignmentCreator } = require('../models/user_model.js');


const { Op } = require('sequelize'); 



const setCustomHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept,Origin');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Encoding', 'gzip');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  res.setHeader('ETag', 'W/"a9-N/X4JXf/69QQSQ1CLHMNPzj473I"');
  res.setHeader('Expires', '-1');
};

const sendResponse = (res, statusCode, message) => {
  res.status(statusCode).json(message);
};


const getAssignmentbyID = async (req,res) => {
  const authorizationHeader = req.headers.authorization;

  //setCustomHeaders(res);

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
       sendResponse(res,401);
      }
    else
    {
      console.log("I am here inside the controller");
        const currentUser = await validateUser(authorizationHeader);
        if (currentUser)
        {
            var assignmentListForCurrentUser = await currUserAsignments(currentUser)
            console.log(assignmentListForCurrentUser);
            const index = assignmentListForCurrentUser.indexOf(req.params.id);
            if (index !== -1)
            {
              const currentAssignment = await Assignment.findAll({
                where : {
                  id : req.params.id
                }
              })
              sendResponse(res,200,currentAssignment);
            }
            else
            {
              sendResponse(res,403,"Data restricted for the user");
            }
        }
        else{
          sendResponse(res,401);
          //return res.status(401).json("Unauthorized request");
        }
    }

}


const patchAssignment = async (req, res) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
    sendResponse(res, 401);
  } else {
    const currentUser = await validateUser(authorizationHeader);
    if (currentUser) {
      try {
        const assignmentListForCurrentUser = await currUserAsignments(currentUser);
        const index = assignmentListForCurrentUser.indexOf(req.params.id);
        console.log(assignmentListForCurrentUser );
        console.log(req.params.id);
        console.log("hello");
        console.log(req.body);
        if (index !== -1) {
          var values = req.body;
          if (values.hasOwnProperty('assignment_created') || values.hasOwnProperty('assignment_updated')) {
            delete values.assignment_created;
            delete values.assignment_updated;
          }
          const updatedValues = {
            ...values,
            "assignment_updated": new Date()
          };
          // Use the `where` clause to specify the record to update based on the `id` parameter
          const patchAssignment = await Assignment.update(updatedValues, {
            where: {
              id: req.params.id
            }
          });
          sendResponse(res, 204); // Send a 204 (No Content) response for successful PATCH
        } else {
          sendResponse(res, 401);
        }
      } catch (error) {
        sendResponse(res, 400);
      }
    } else {
      sendResponse(res, 403);
    }
  }
};



const getUserAssignments = async(req,res) => 
{
  //console.log("advfadgfvafdgv");
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      sendResponse(res,401, "Un authenticated, authentication required");
    }
  else
  {
      const currentUser = await validateUser(authorizationHeader);
      //console.log(currentUser,"i am here in the current user");
      if (currentUser)
      {
          var assignmentListForCurrentUser = await currUserAsignments(currentUser)
          console.log(assignmentListForCurrentUser)

          var currUserDetailAsignments = await Assignment.findAll({
            where: {
                id: {
                    [Op.in] : assignmentListForCurrentUser
                }
            }});
          sendResponse(res,200,currUserDetailAsignments);
      }
      else{
        sendResponse(res,401,"Un authenticated, authentication required");
      }
  }
}

const postAssignment = async (req,res) =>
{
  //console.log("agbvagbvargv");
  const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      sendResponse(res,401, "Un authenticated authentication required");
      }

    const currentUser = await validateUser(authorizationHeader);
    //console.log(currentUser.id);

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
            sendResponse(res,201,"Assignment created");
        }
        catch (error)
        {
          sendResponse(res,400,"Bad request");
        }
    }
    else
    {
      sendResponse(res,401,"Authentication required");
    }

}


const removeAssignment = async (req, res) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Invalid Authorization header' });
  } else {
    const currentUser = await validateUser(authorizationHeader);
    if (currentUser) {
      var assignmentListForCurrentUser = await currUserAsignments(currentUser);
      const index = assignmentListForCurrentUser.indexOf(req.params.id);
      if (index !== -1) {
        const assignment = await Assignment.findByPk(req.params.id);
        if (assignment) {
          const assignmentCreator = await AssignmentCreator.findOne({
            where: {
              assignmentId: req.params.id,
              userId: currentUser.id,
            },
          });

          if (assignmentCreator) {
            const removeFromAssignments = await Assignment.destroy({
              where: {
                id: req.params.id,
              },
            });

            const removeFromAssignmentCreator = await AssignmentCreator.destroy({
              where: {
                assignmentId: req.params.id,
              },
            });

            if (removeFromAssignments > 0 && removeFromAssignmentCreator) {
              sendResponse(res, 204);
            } else {
              sendResponse(res, 400);
              // return res.status(400).json(`Assignment ${req.params.id} already deleted`);
            }
          } else {
            return res.status(401).json({ message: 'Unauthorized request' });
          }
        } else {
          sendResponse(res, 400);
          // return res.status(400).json("Assignment id not found for the user");
        }
      } else {
        sendResponse(res, 401);
        // return res.status(401).json("Unauthorized request");
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized request' });
    }
  }
};


// const removeAssignment = async (req,res) => {
//   const authorizationHeader = req.headers.authorization;

//     if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
//         return res.status(401).json({ message: 'Invalid Authorization header' });
//       }
//       else{
//         const currentUser = await validateUser(authorizationHeader);
//         if (currentUser)
//         {
//           var assignmentListForCurrentUser = await currUserAsignments(currentUser)
//             //console.log(req.params.id, "i am the params id");
//             const index = assignmentListForCurrentUser.indexOf(req.params.id);
//             if (index !== -1)
//             {
//               //console.log("i am inside the indexwrgvwargvwragv");
//               const removeFromAssignments = await Assignment.destroy({
//                 where : {
//                   id : req.params.id
//                 }
//               })

//               const removeFromAssignmentCreator = await AssignmentCreator.destroy({
//                 where : {
//                   assignmentId: req.params.id
//                 }
//               })

//               if (removeFromAssignments > 0 && removeFromAssignmentCreator)
//               {
//                 sendResponse(res,204);
//               }
//               else
//               {
//                 sendResponse(res,400);
//                 //return res.status(400).json(`Assignment ${req.params.id} already deleteted`);
//               }
//               //console.log(currentAssignment);
//             }
//             else
//             {
//               sendResponse(res,400);
//               //return res.status(400).json("Assignment id not found for the user");
//             }
//         }
//         else{
//             return res.status(401).json("Unauthorized request");
//         }


//         }
//       }



const updateAssignment = async (req, res) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
    sendResponse(res, 401);
  } else {
    const currentUser = await validateUser(authorizationHeader);
    if (currentUser) {
      try {
        const assignmentListForCurrentUser = await currUserAsignments(currentUser);
        const index = assignmentListForCurrentUser.indexOf(req.params.id);
        if (index !== -1) {
          const assignmentCreator = await AssignmentCreator.findOne({
            where: {
              assignmentId: req.params.id,
              userId: currentUser.id,
            },
          });

          if (assignmentCreator) {
            const values = req.body;
            if (values.hasOwnProperty('assignment_created') || values.hasOwnProperty('assignment_updated')) {
              delete values.assignment_created;
              delete values.assignment_updated;
            }

            const updatedValues = {
              ...values,
              assignment_updated: new Date(),
            };

            const [updatedCount] = await Assignment.update(updatedValues, {
              where: {
                id: req.params.id,
              },
            });
            if (updatedCount > 0) {
              sendResponse(res, 201);
            } else {
              sendResponse(res, 401);
            }
          } else {
            sendResponse(res, 401);
          }
        } else {
          sendResponse(res, 401);
        }
      } catch (error) {
        sendResponse(res, 401);
      }
    } else {
      sendResponse(res, 403);
    }
  }
};


// const updateAssignment = async(req,res) => {
//   const authorizationHeader = req.headers.authorization;

//     if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
//       sendResponse(res,401);
//       }
//       else
//       {
//         const currentUser = await validateUser(authorizationHeader);
//         if (currentUser)
//         {
//           try{
//             var assignmentListForCurrentUser = await currUserAsignments(currentUser)
//             const index = assignmentListForCurrentUser.indexOf(req.params.id);
//             console.log(req.body);
//             if (index !== -1)
//             {
//               var values = req.body;
//               if (values.hasOwnProperty('assignment_created') || values.hasOwnProperty('assignment_updated'))
//               {
//                 delete values.assignment_created;
//                 delete values.assignment_updated;
//               }
//               const updatedValues = {
//                 ...values,
//                 "assignment_updated": new Date()
//               };
//               const updatedAssignment = await Assignment.update( updatedValues, {
//                 where : {
//                   id : req.params.id
//                 }
//               })
//               sendResponse(res,201);;
//             }
//             else
//             {
//               sendResponse(res,401);
//             }
//           }
//           catch{
//             sendResponse(res,400);
//           }
//           }
//           else
//           {
//             sendResponse(res,403);
//           }
//         }
//       }


const validateUser = async (authorizationHeader) => {
  try {
    const base64Credentials = authorizationHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    const user = await User.findOne({ where: { email: username } });

    if (!user) {
      return null; // User not found
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return user;
    } else {
      return 403; // Incorrect password, return Forbidden
    }
  } catch (error) {
    console.error('Error while validating user:', error);
    return 0;
  }
};




// const validateUser = async (authorizationHeader) => {
//     try {
//       // Extract the base64-encoded credentials from the Authorization header
//       const base64Credentials = authorizationHeader.split(' ')[1];
//       const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
//       const [username, password] = credentials.split(':');
  
//       // Find the user by username
//       const user = await User.findOne({ where: { email: username } });
  
//       // If no user is found, return null (user not found)
//       if (!user) {
//         //console.log("I am returning null");
//         return null;
//       }
  
//       // Compare the provided password with the hashed password in the database
//       //console.log("i am going here now")
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       //console.log("password is matched here")
//       //console.log(passwordMatch)
  
//       // If the passwords match, return the user object; otherwise, return null
//       if (passwordMatch) {
//         //console.log(user)
//         return user;
//       } else {
//         return 0;
//       }
//     } catch (error) {
//       console.error('Error while validating user:', error);
//       return 0;
//     }
//   };



  const currUserAsignments = async(presentUser) => {
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

}

// const patchAssignment = async (req, res) => {
//   const authorizationHeader = req.headers.authorization;

//   if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
//     sendResponse(res, 401);
//   } else {
//     const currentUser = await validateUser(authorizationHeader);
//     if (currentUser) {
//       try {
//         const assignmentListForCurrentUser = await currUserAsignments(currentUser);
//         const index = assignmentListForCurrentUser.indexOf(req.params.id);

//         if (index !== -1) {
//           const values = req.body;

//           // Remove assignment_created and assignment_updated from the request body
//           if (values.hasOwnProperty('assignment_created') || values.hasOwnProperty('assignment_updated')) {
//             delete values.assignment_created;
//             delete values.assignment_updated;
//           }

//           // Add the updated timestamp
//           values.assignment_updated = new Date();

//           // Update the assignment in the database using a PATCH method
//           const [rowsUpdated, updatedAssignments] = await Assignment.update(values, {
//             where: {
//               id: req.params.id,
//             },
//             returning: true, // Return the updated assignment
//           });

//           if (rowsUpdated > 0) {
//             sendResponse(res, 200, updatedAssignments[0]);
//           } else {
//             sendResponse(res, 404, "Assignment not found");
//           }
//         } else {
//           sendResponse(res, 403, "Data restricted for the user");
//         }
//       } catch (error) {
//         sendResponse(res, 400, "Bad request");
//       }
//     } else {
//       sendResponse(res, 401, "Authentication required");
//     }
//   }
// };

module.exports = {
  getAssignmentbyID,
  getUserAssignments,
  postAssignment,
  removeAssignment,
  updateAssignment,
  patchAssignment, // Add the patch function to the exported module
};


/*const removeAssignment = async (req,res) => {
  const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
      }
      else{
        const currentUser = await validateUser(authorizationHeader);
        if (currentUser)
        {
          var assignmentListForCurrentUser = await currUserAsignments(currentUser)
            //console.log(req.params.id, "i am the params id");
            const index = assignmentListForCurrentUser.indexOf(req.params.id);
            if (index !== -1)
            {
              //console.log("i am inside the indexwrgvwargvwragv");
              const currentAssignment = await Assignment.destroy({
                where : {
                  id : req.params.id
                }
              })
              if (currentAssignment > 0)
              {
                return res.status(200).json(`Assignment ${req.params.id} deleteted`);
              }
              else
              {
                return res.status(400).json(`Assignment ${req.params.id} already deleteted`);
              }
              //console.log(currentAssignment);
            }
            else
            {
              return res.status(400).json("Assignment id not found for the user");
            }
        }
        else{
            return res.status(401).json("Unauthorized request");
        }


        }
      }*/










module.exports = {
  getAssignmentbyID,
  getUserAssignments,
  postAssignment,
  removeAssignment,
  updateAssignment,
  patchAssignment,
};