import { Router, Request, Response } from 'express';
import logger from '../helpers/logger';

const router: Router = Router();

/**
 * GET /ping
 * Returns 'pong' if the server is up.
 */
router.get('/ping', async (req: Request, res: Response) => {
    logger.debug(`GET /ping`);
    res.send('pong');
});

export default router;