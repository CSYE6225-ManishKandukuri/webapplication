const express = require("express");
const {assignmentPost,updateAssignment,deleteAssignment,getAssignment,getAssignments,patchAssignment,updateAssignments,deleteAssignments,patchAssignments}=require('../controllers/assignmentController.js')
const {gethealthCheck}=require('../controllers/healthCheckController.js')

const router = express.Router(); // get router object

// route for 'get' (fetch all todo's) and 'post' requests on endpoint '/todo-items' 
router.route('/v1/assignments/:id')
      .get(getAssignment)
      .put(updateAssignment)
      .delete(deleteAssignment)
      .patch(patchAssignment)

//route for 'get', 'put' and 'delete' for single instance of todo item based on request parameter 'id'
router.route('/v1/assignments')
      .post(assignmentPost)
      .get(getAssignments)
      .put(updateAssignments)
      .delete(deleteAssignments)
      .patch(patchAssignments)

router.route('/healthz')
      .get(gethealthCheck)
      
module.exports=router