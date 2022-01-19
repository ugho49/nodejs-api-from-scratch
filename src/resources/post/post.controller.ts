import { NextFunction, Request, Response, Router } from 'express';
import { Controller } from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';

export default class PostController implements Controller {
    readonly #PATH = '/posts';
    readonly #postService = new PostService();

    public routes(): Router {
        const router = Router();
        router.get(`${this.#PATH}`, this.#getAll);
        router.post(`${this.#PATH}`, validationMiddleware(validate.create), this.#create);
        return router;
    }

    #create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, body } = req.body;

            const post = await this.#postService.create(title, body);

            return res.status(201).json({ post });
        } catch (error) {
            return next(new HttpException(400, 'Cannot create post', error));
        }
    };

    #getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await this.#postService.findAll();
            return res.status(200).json({ posts });
        } catch (error) {
            return next(new HttpException(500, 'Cannot get posts', error));
        }
    };
}
