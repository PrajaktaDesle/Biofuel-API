const { check, validationResult } = require('express-validator/check');
const updateRules = [
    check('id').not().isEmpty(),
  ]
const registerRules = [
    check('name').not().isEmpty(),
    check('address').not().isEmpty(),
    check('pincode').not().isEmpty(),
    check('aadhar_img').custom((value:any) => {
        if (isFileValid(value)) {
          throw new Error('Password confirmation does not match password');
        }}),
    check('pan_img').not().isEmpty(),
    check('gst_img').not().isEmpty(),

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