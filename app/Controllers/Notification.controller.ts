import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import notificationService from '../Services/Notification.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const createNotification: IController = async (req, res) => {
    let notification: any;
    try {
        notification = await notificationService.createNotification(req.body);
        if (notification instanceof Error) {
            console.log("error", notification)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res, {
                notification
            }, httpStatusCodes.CREATED);
        }
    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                'MOBILE_AND_EMAIL_ALREADY_EXISTS',
            );
        }
        else{
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
        }
        return;
    }
};


const fetchAllnotifications: IController = async (req, res) => {
    notificationService.fetchAllNotifications()
        .then( (notifications) => {
            if(notifications instanceof Error){
                console.log("User 2", notifications.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    notifications.message
                );
            }else{
                console.log("User 3", notifications)
                apiResponse.result(res, notifications, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            //locale.INVALID_CREDENTIALS,
        );
    });
};


const fetchNotificationById: IController = async (req, res) => {
    notificationService.fetchNotificationById(req.query.id)
        .then( (notification : any) => {
            if(notification instanceof Error){
                console.log("User 2", notification.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    notification.message
                );
            }else{
                console.log("User 3", notification)
                apiResponse.result(res, notification, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};



const updateNotificationDetails: IController = async (req, res) => {
    notificationService.updateNotificationDetails(req.body)
        .then( (notification) => {
            if(notification instanceof Error){
                console.log("user 2", notification.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    notification.message
                );
            }else{
                console.log("user 3", notification)
                apiResponse.result(res, notification, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};



export default {
    createNotification,
    updateNotificationDetails,
    fetchNotificationById,
    fetchAllnotifications,

};
