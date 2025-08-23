
import { Request, Response } from 'express';
import { getProperties, getPropertyById } from './properties.service';

export const getPropertiesController = async (req: Request, res: Response) => {
    const properties = await getProperties(req.query);
    res.json(properties);
}

export const getPropertyByIdController = async (req: Request, res: Response) => {
    const property = await getPropertyById(req.params.id);
    res.json(property);
}
