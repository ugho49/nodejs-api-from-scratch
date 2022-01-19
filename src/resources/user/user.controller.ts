import { NextFunction, Request, Response, Router } from 'express';
import { Controller } from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';

export default class UserController implements Controller {
    readonly #userService = new UserService();

    public routes(router: Router): Router {
        const routes = Router();
        routes.get('/', authenticated, this.#getUser);
        routes.post('/register', validationMiddleware(validate.register), this.#register);
        routes.post('/login', validationMiddleware(validate.login), this.#login);
        return router.use('/users', routes);
    }

    #register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;

            const token = await this.#userService.register(name, email, password, 'user');

            return res.status(201).json({ token });
        } catch (error) {
            const { message } = error as Error;
            return next(new HttpException(400, message, error));
        }
    };

    #login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const token = await this.#userService.login(email, password);
            return res.status(200).json({ token });
        } catch (error) {
            const { message } = error as Error;
            return next(new HttpException(400, message));
        }
    };

    #getUser = (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        return res.status(200).send({ data: req.user });
    };
}
