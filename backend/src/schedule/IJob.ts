export default interface IJob<T> {
  get schedule(): Date | string;
  execute(): Promise<T>;
}