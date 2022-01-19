import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

export default class UserService {
    /**
     * Register a new user
     */
    public register = async (name: string, email: string, password: string, role: string): Promise<string | Error> => {
        try {
            const user = await UserModel.create({
                name,
                email,
                password,
                role,
            });

            return token.createToken(user);
        } catch (error) {
            const { message } = error as Error;
            throw new Error(message);
        }
    };

    /**
     * Attempt to login a user
     */
    public login = async (email: string, password: string): Promise<string | Error> => {
        try {
            const user = await UserModel.findOne({ email });

            if (!user) {
                throw new Error('Unable to find user with that email address');
            }

            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error) {
            const { message } = error as Error;
            throw new Error(message || 'Unable to create user');
        }
    };
}
