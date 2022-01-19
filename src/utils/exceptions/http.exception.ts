export default class HttpException extends Error {
    public status: number;
    public message: string;
    public timestamp: number;
    public cause?: Error;

    constructor(status: number, message: string, cause?: unknown) {
        super(message);
        this.status = status;
        this.message = message;
        this.timestamp = new Date().getTime();
        this.cause = cause as Error;
    }
}
