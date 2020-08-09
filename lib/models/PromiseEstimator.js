'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class PromiseEstimator {
  constructor() {
    this.estimates = {}
  }
  getEstimate(id, estimate) {
    if (!this.estimates[id]) {
      this.estimates[id] = estimate
    }
    estimate = this.estimates[id]
    return estimate
  }
  updateEstimate(id, estimate) {
    this.estimates[id] = estimate
  }
  work(promise, options) {
    return new Promise((resolve) => {
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
exports.PromiseEstimator = PromiseEstimator
