import logger from "../helpers/logger";
import { Request, Response, NextFunction } from 'express';

/**
 * Verifies the authorization token in the request headers.
 * The token is compared to the AUTH_TOKEN environment variable.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns void
 */
export function verifyAuthToken(req: Request, res: Response, next: NextFunction): void {
    const bearerHeader = req.headers.authorization;

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];

        if (bearerToken === process.env.AUTH_TOKEN) {
            next();
        } else {
            logger.error(`Invalid token: ${bearerToken}`);
            res.sendStatus(403);
        }
    } else {
        logger.error('No token provided');
        res.sendStatus(401);
    }
}