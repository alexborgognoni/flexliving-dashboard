import { Request, Response } from 'express';
import { getReviews, getReviewById, updateReviewStatus } from './reviews.service';

export const getReviewsController = async (req: Request, res: Response) => {
    const reviews = await getReviews(req.query);
    res.json(reviews);
}

export const getReviewByIdController = async (req: Request, res: Response) => {
    const review = await getReviewById(req.params.id);
    res.json(review);
}

export const updateReviewStatusController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['published', 'unpublished'].includes(status)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid status. Must be "published" or "unpublished"'
        });
    }
    
    const result = await updateReviewStatus(id, status);
    res.json(result);
}