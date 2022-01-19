import { Router } from 'express';

export interface Controller {
    routes: () => Router;
}
