const { Validator } = require('node-input-validator');

// @ts-ignore
const validate = function (data, rule)
  {
  const validatorObj = new Validator(data, rule);
  return validatorObj;
}
//@ts-ignore
// const validate = ( data, rule) => {
//   const validatorObj = new Validator(data, rule);
//   validatorObj.check().then((matched:any)=>{
//     if()
//   })

// }
export default(
  validate  
)
