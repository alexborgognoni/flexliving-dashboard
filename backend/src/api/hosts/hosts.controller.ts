import { Request, Response } from 'express';
import { getHosts, getHostById } from './hosts.service';

export const getHostsController = async (req: Request, res: Response) => {
    const hosts = await getHosts(req.query);
    res.json(hosts);
}

export const getHostByIdController = async (req: Request, res: Response) => {
    const host = await getHostById(req.params.id);
    res.json(host);
}