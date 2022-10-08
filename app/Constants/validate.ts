const { Validator } = require('node-input-validator');

// @ts-ignore
const validate = function (rule, data)
  {
  const validatorObj = new Validator(data, rule);
  return validatorObj;
}


export default(
  validate  
)
