export default interface ControllerResponse<T> {
    data?: T;
    error: boolean;
    message?: string;
}