import { Joi, Segments } from 'celebrate';
// @ts-ignore
export default {
    customer_supplier: {
        [Segments.BODY]:  Joi.object().keys({
            customer_id: Joi.number().required(),
            supplier_id: Joi.number().required()
        }).unknown()
    },
    updateStatus: {
        [Segments.BODY]:  Joi.object().keys({
            customer_id: Joi.number().required(),
            supplier_id: Joi.number().required(),
            status: Joi.number().required().min(0).max(1)
        }).unknown()
    }
}