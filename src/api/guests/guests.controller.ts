import { Request, Response } from 'express';
import { getGuests } from './guests.service';

export const getGuestsController = async (req: Request, res: Response) => {
    const guests = await getGuests(req.query);
    res.json(guests);
}