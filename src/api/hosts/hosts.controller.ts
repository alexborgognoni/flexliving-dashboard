import { Request, Response } from 'express';
import { getHosts } from './hosts.service';

export const getHostsController = async (req: Request, res: Response) => {
    const hosts = await getHosts(req.query);
    res.json(hosts);
}