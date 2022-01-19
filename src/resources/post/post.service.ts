import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';

export default class PostService {
    /**
     * Create a new post
     */
    public create = async (title: string, body: string): Promise<Post> => {
        try {
            return await PostModel.create({ title, body });
        } catch (error) {
            throw new Error('Unable to create post');
        }
    };

    /**
     * Create a new post
     */
    public findAll = async (): Promise<Post[]> => {
        try {
            return await PostModel.find().exec();
        } catch (error) {
            throw new Error('Unable to find posts');
        }
    };
}
