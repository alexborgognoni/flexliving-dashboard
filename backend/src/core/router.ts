
import { Router } from 'express';

export const createRouter = (controller: any) => {
    const router = Router();
    router.get('/', controller);
    return router;
}
