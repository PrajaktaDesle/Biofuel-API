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

router.get(
  '/fetch',
  celebrate( notificationSchema.fetchNotificationById ),
  notificationController.fetchNotificationById
)

// router.get(
//   '/fetch/all',
//   notificationController.fetchAllSuppliers
// )

export default router;
