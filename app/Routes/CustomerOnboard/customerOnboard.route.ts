import express from "express"
import {celebrate} from "celebrate";
import CustomerOnboardController from "../../Controllers/customerOnboard.controller"
const router = express.Router()

router.post(
    '/create',
        CustomerOnboardController.Create
);
router.get(
    '/fetch',
    CustomerOnboardController.fetchCustomerById
);
router.put(
    '/update',
    CustomerOnboardController.updateCustomerDetails
)
router.put(
    '/update/customer-status',
    CustomerOnboardController.updateCustomerStatus
)
router.get(
    '/fetch-all',
    CustomerOnboardController.fetchAllCustomers
)

export default router;
