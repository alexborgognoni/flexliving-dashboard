import { Router, RequestHandler } from "express";

export const createRouter = (
    route: string,
    listController: RequestHandler,
    itemController?: RequestHandler,
): Router => {
    const router = Router();
    router.get(route, listController);
    if (itemController) {
        router.get(`${route}/:id`, itemController);
    }
    return router;
};
