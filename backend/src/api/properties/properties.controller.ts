
import { Request, Response } from 'express';
import { getProperties, getPropertyById, getPropertyReviews } from './properties.service';

export const getPropertiesController = async (req: Request, res: Response) => {
    const properties = await getProperties(req.query);
    res.json(properties);
}

export const getPropertyByIdController = async (req: Request, res: Response) => {
    const property = await getPropertyById(req.params.id);
    res.json(property);
}

export const getPropertyReviewsController = async (req: Request, res: Response) => {
    console.log(`[API] GET /properties/${req.params.id}/reviews with query:`, req.query);
    const reviews = await getPropertyReviews(req.params.id, req.query);
    console.log(`[API] Returning ${reviews.data.length} reviews`);
    res.json(reviews);
}
