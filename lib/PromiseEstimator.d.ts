export interface IEstimatorOptions {
  id: string
  estimate: number
  interval: number
  intervalHandler: (current: number) => void
}
export interface IPromiseEstimator {
  work<T>(promise: Promise<T>, options: IEstimatorOptions): Promise<T>
}
export declare class PromiseEstimator implements IPromiseEstimator {
  private estimates
  private getEstimate
  private updateEstimate
  work<T>(promise: Promise<T>, options: IEstimatorOptions): Promise<T>
}
