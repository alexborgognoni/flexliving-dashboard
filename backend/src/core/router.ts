import { Router, RequestHandler } from "express";

export const createRouter = (
    route: string,
    controller: RequestHandler,
): Router => {
    const router = Router();
    router.get(route, controller);
    return router;
};
