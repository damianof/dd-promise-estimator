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
  private estimates: { [key: string]: number }
  private getEstimate(id: string, estimate: number): number
  private updateEstimate(id: string, estimate: number)
  work<T>(promise: Promise<T>, options: IEstimatorOptions): Promise<T>
}
