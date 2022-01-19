import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import { Controller } from '@/utils/interfaces/controller.interface';
import { errorHandler, notFound } from '@/middleware/error.middleware';
import helmet from 'helmet';
import log from '@/utils/logger';

export default class App {
    #app: Application;

    constructor() {
        this.#app = express();
    }

    public init(controllers: Controller[]) {
        this.#initializeDatabaseConnection();
        this.#initializeMiddlewares();
        this.#initializeControllers(controllers);
        this.#initializeErrorHandling();
    }

    public listen(port: number) {
        this.#app.listen(port, () => {
            log.info(`App listening on the port ${port} in ${process.env.NODE_ENV} mode`);
        });
    }

    #initializeMiddlewares() {
        log.info('Initialize Middlewares');

        this.#app.use(helmet());
        this.#app.use(cors());
        this.#app.use(morgan('dev'));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: false }));
        this.#app.use(compression());
    }

    #initializeControllers(controllers: Controller[]) {
        log.info('Initialize Controllers');
        controllers.forEach((controller: Controller) => {
            this.#app.use('/api', controller.routes());
        });
    }

    #initializeErrorHandling() {
        log.info('Initialize Error Handling');
        this.#app.use(notFound);
        this.#app.use(errorHandler);
    }

    #initializeDatabaseConnection() {
        const { MONGO_URL } = process.env;
        log.info('Initialize Database connection');
        mongoose.connect(MONGO_URL as string);
    }
}
