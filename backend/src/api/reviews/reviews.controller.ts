import { Request, Response } from 'express';
import { getReviews, getReviewById } from './reviews.service';

export const getReviewsController = async (req: Request, res: Response) => {
    const reviews = await getReviews(req.query);
    res.json(reviews);
}

export const getReviewByIdController = async (req: Request, res: Response) => {
    const review = await getReviewById(req.params.id);
    res.json(review);
}