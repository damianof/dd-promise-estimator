export interface IEstimatorOptions {
  id: string
  estimate: number
  interval: number
  intervalHandler: (current: number) => void
}

export interface IPromiseEstimator {
  work<T>(promise: Promise<T>, options: IEstimatorOptions): Promise<T>
}

export class PromiseEstimator implements IPromiseEstimator {
  private estimates: { [key: string]: number } = {}

  private getEstimate(id: string, estimate: number): number {
    if (!this.estimates[id]) {
      this.estimates[id] = estimate
    }
    estimate = this.estimates[id]
    return estimate
  }

  private updateEstimate(id: string, estimate: number) {
    this.estimates[id] = estimate
  }

  work<T>(promise: Promise<T>, options: IEstimatorOptions): Promise<T> {
    return new Promise<T>((resolve) => {
      // get initial guess estimate passed with the option
      let { estimate, id } = options
      const { interval, intervalHandler } = options
      // get existing estimate, if any or insert the one assed by the user with the options
      estimate = this.getEstimate(id, estimate)

      const startTime = Date.now()

      let intervalId = setInterval(() => {
        if (estimate > 0) {
          const elapsedTime = Date.now() - startTime
          const remainingTime = estimate - elapsedTime
          if (remainingTime > 0) {
            intervalHandler(Number((elapsedTime / estimate).toFixed(2)))
          } else {
            clearInterval(intervalId)
            intervalHandler(0.99)
          }
        }
      }, interval)

      promise.then((promiseReturnValue) => {
        clearInterval(intervalId)
        intervalHandler(1)
        const actualDuration = Date.now() - startTime
        // update the estimate with the actual duration so next time we have a better idea of
        // how long a Promise with the same key should tak
        this.updateEstimate(id, actualDuration)
        resolve(promiseReturnValue)
      })
    })
  }
}
