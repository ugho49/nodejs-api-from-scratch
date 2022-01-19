import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import PostController from '@/resources/post/post.controller';
import UserController from '@/resources/user/user.controller';

validateEnv();

const app = new App();
app.init([new PostController(), new UserController()]);
app.listen(Number(process.env.PORT));
