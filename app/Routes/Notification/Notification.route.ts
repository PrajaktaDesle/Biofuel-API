import notificationController from '../../Controllers/Notification.controller';
import notificationSchema from '../../Constants/Schema/Notification.schema';
import express from 'express';
import path from 'path';
import { celebrate } from 'celebrate';
const router = express.Router();

router.post(
  '/create',
  celebrate( notificationSchema.createNotification ),
  notificationController.createNotification
);

router.put( 
  '/update/status',
  celebrate( notificationSchema.updateNotficationStatus),
  notificationController.updateNotificationDetails
)

router.post(
  '/fetch/all',
  notificationController.fetchAllnotifications
)

router.get(
  '/fetch/By-id',
celebrate( notificationSchema.fetchNotificationById ),
  notificationController.fetchNotificationById
);

router.get(
  '/menu',
  notificationController.getNotificationMenue
)

export default router;
