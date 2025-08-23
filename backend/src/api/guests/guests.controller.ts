import { Request, Response } from 'express';
import { getGuests, getGuestById } from './guests.service';

export const getGuestsController = async (req: Request, res: Response) => {
    const guests = await getGuests(req.query);
    res.json(guests);
}

export const getGuestByIdController = async (req: Request, res: Response) => {
    const guest = await getGuestById(req.params.id);
    res.json(guest);
}