import { Router } from "express";
import { getPropertiesController, getPropertyByIdController, getPropertyReviewsController } from "./properties.controller";

const router = Router();
router.get("/properties", getPropertiesController);
router.get("/properties/:id", getPropertyByIdController);
router.get("/properties/:id/reviews", getPropertyReviewsController);

export default router;
