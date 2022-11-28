import { Joi, Segments } from 'celebrate';
export default {
   
   

     createEstimate: {
        [Segments.BODY]:  Joi.object().keys({
            customer: Joi.number().required(),
            estimate_id: Joi.number().integer().required(),
            estimate_date: Joi.string().required(),
            expiry_date: Joi.string().required(),
            product: Joi.number().required(),
            raw_material: Joi.number().required(),
            product_description: Joi.string().required(),
            packaging: Joi.number().required(),
            rate: Joi.number().required(),
            quantity: Joi.number().required(),
            customer_note: Joi.string().required(),
            tnc: Joi.string().required(),
            status: Joi.number().required(),
            user_id: Joi.number().required(),
    }).unknown(),
    },
    updateEstimate: {
        [Segments.BODY]:  Joi.object().keys({
            id: Joi.number().required(),
            customer: Joi.number().optional(),
            estimate_id: Joi.number().integer().optional(),
            estimate_date: Joi.string().optional(),
            expiry_date: Joi.string().optional(),
            product: Joi.number().optional(),
            raw_material: Joi.number().optional(),
            product_description: Joi.string().optional(),
            packaging: Joi.number().optional(),
            rate: Joi.number().optional(),
            quantity: Joi.number().optional(),
            customer_note: Joi.string().optional(),
            tnc: Joi.string().optional(),
            status: Joi.number().optional(),
            user_id: Joi.number().optional(),
    }).unknown(),
    },
    fetchEstimateById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },
    // CREATE TABLE `customer_estimates` (
    //     `id` int(11) NOT NULL AUTO_INCREMENT,
    //     `customer_id` int(11) DEFAULT NULL,
    //     `address_id` int(11) DEFAULT NULL,
    //     `estimate_no` varchar(100) DEFAULT NULL,
    //     `estimate_date` date DEFAULT NULL,
    //     `expiry_date` date DEFAULT NULL,
    //     `product_id` int(11) DEFAULT NULL,
    //     `raw_material_id` int(11) DEFAULT NULL,
    //     `packaging_id` int(11) DEFAULT NULL,
    //     `product_description` text,
    //     `quantity` double DEFAULT NULL COMMENT 'Default as TON\n',
    //     `estimate_url` varchar(45) DEFAULT NULL,
    //     `rate` double DEFAULT NULL COMMENT 'Per TON\n',
    //     `adjustment_amount` double DEFAULT NULL COMMENT 'total_amount = (quantity * rate)  + adjustment_amount',
    //     `customer_note` text,
    //     `tnc` text,
    //     `status` tinyint(1) DEFAULT NULL COMMENT 'Initial -> Draft\nSent for approval -> pending approval\nApproved -> approved\nEmail click -> sent\nCustomer says yes -> accepted\nDeclined\nConvert to SO\n\n',
    //     `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    //     `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //     PRIMARY KEY (`id`)
    //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4


};
