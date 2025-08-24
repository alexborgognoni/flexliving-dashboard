import { Request, Response } from 'express';
import { getReviews, getReviewById, updateReviewStatus } from './reviews.service';
import { getHostawayReviews } from './hostaway.service';

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

export const getHostawayReviewsController = async (req: Request, res: Response) => {
    try {
        const normalizedReviews = await getHostawayReviews();
        const validReviews = normalizedReviews.filter(review => review !== null);
        
        res.json({
            status: 'success',
            data: validReviews,
            meta: {
                totalCount: validReviews.length,
                sourceCount: normalizedReviews.length,
                mappingSuccessRate: `${Math.round((validReviews.length / normalizedReviews.length) * 100)}%`
            }
        });
    } catch (error) {
        console.error('Error fetching Hostaway reviews:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch and normalize Hostaway reviews'
        });
    }
}