const { body, validationResult } = require('express-validator');
const updateRules = [
    body('id').not().isEmpty(),
  ]
const registerRules = [
    // body('name').not().isEmpty().withMessage('Name must have more than 5 characters'),
    body('pincode').isNumeric()
   
   

]
const isFileValid = (file:any) => {
    const type = file.type.split("/").pop();
    const validTypes = ["jpg", "jpeg", "png", "pdf"];
    if (validTypes.indexOf(type) === -1) {
      return false;
    }
    return true;
  };
export  {
  updateRules,
  registerRules
}