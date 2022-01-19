import { NextFunction, Request, Response, Router } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path}/register`, validationMiddleware(validate.register), this.register);
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
        this.router.get(`${this.path}`, authenticated, this.getUser);
    }

    private async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;

            const token = await this.UserService.register(name, email, password, 'user');

            res.status(201).json({ token });
        } catch (error) {
            const { message } = error as Error;
            next(new HttpException(400, message));
        }
    }

    private async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const token = await this.UserService.login(email, password);
            res.status(200).json({ token });
        } catch (error) {
            const { message } = error as Error;
            next(new HttpException(400, message));
        }
    }

    private getUser(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).send({ data: req.user });
    }
}

export default UserController;
