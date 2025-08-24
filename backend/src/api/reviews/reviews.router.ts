import { Router } from "express";
import { getReviewsController, getReviewByIdController, updateReviewStatusController, getHostawayReviewsController } from "./reviews.controller";

const router = Router();

router.get("/reviews", getReviewsController);
router.get("/reviews/hostaway", getHostawayReviewsController);
router.get("/reviews/:id", getReviewByIdController);
router.patch("/reviews/:id/status", updateReviewStatusController);

export default router;
