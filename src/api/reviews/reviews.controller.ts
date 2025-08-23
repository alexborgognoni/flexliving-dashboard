import { Request, Response } from 'express';
import { getReviews } from './reviews.service';

export const getReviewsController = async (req: Request, res: Response) => {
    const reviews = await getReviews(req.query);
    res.json(reviews);
}