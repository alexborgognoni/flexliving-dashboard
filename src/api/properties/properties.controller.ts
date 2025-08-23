import { Request, Response } from 'express';
import { getProperties } from './properties.service';

export const getPropertiesController = async (req: Request, res: Response) => {
    const properties = await getProperties(req.query);
    res.json(properties);
}