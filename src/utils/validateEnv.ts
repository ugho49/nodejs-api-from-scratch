import { cleanEnv, str, port } from 'envalid';
import log from '@/utils/logger';

function validateEnv(): void {
    log.info('Validate environment');

    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_URL: str(),
        PORT: port({ default: 3000 }),
    });
}

export default validateEnv;
