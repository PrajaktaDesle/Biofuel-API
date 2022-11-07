import { Joi, Segments } from 'celebrate';
export default {
   
   

    fetchProductById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },


};
