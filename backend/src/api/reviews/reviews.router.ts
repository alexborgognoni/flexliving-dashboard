import { Router } from "express";
import { getReviewsController, getReviewByIdController, updateReviewStatusController } from "./reviews.controller";

const router = Router();

router.get("/reviews", getReviewsController);
router.get("/reviews/:id", getReviewByIdController);
router.patch("/reviews/:id/status", updateReviewStatusController);

export default router;
