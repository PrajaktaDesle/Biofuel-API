import express from 'express';
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../utilities/ApiResponse';
import Encryption from '../utilities/Encryption';
import { extractCookieFromRequest } from '../utilities/ApiUtilities';
import application from '../Constants/application'

/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (application.authorizationIgnorePath.indexOf(
      `${req.originalUrl}`
    ) === -1
  ) {
    const authorizationHeader = extractCookieFromRequest(
      req, 'x-biofuel-token'
    );
    console.log("authorizationHeader ->", authorizationHeader);
    if (authorizationHeader) {
      const decoded = await new Encryption().verifyJwtToken(authorizationHeader);
      console.log("Decoded -",decoded)
      // @ts-ignore
      if (decoded) {
        console.log('TOKEN ---> Verified Successfully');
      } else {
        apiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
        return;
      }
    } else {
      apiResponse.error(res, httpStatusCodes.FORBIDDEN);
      return;
    }
  }

  next();
};