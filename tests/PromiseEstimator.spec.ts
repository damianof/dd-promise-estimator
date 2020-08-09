import { expect } from 'chai'
import { 
	IPromiseEstimator, 
	PromiseEstimator, 
	IEstimatorOptions 
} from '../src'

let promiseEstimator: IPromiseEstimator

describe('PromiseEstimator', () => {

	before(() => {
		promiseEstimator = new PromiseEstimator()
	})

	it('test', function (done) {
		this.timeout(20000)

		const promiseFactory = (): Promise<string> => {
			return new Promise<string>((resolve) => {
				const timeout = 3125
				setTimeout(() => {
					resolve(`myPromise is done in ${ timeout }`)
				}, timeout)
			})
		}

		const options: IEstimatorOptions = {
			id: 'myPromise',
			estimate: 5000, // initial guess, but will be adjusted by the estimator internal after the promise has competed with the actual execution time so next time will be more precise
			interval: 1000,
			intervalHandler: (current: number) => {
				console.info('intervalHandler', current, ' estimates', (promiseEstimator as any).estimates['myPromise'])
			}
		}

		promiseEstimator.work<string>(promiseFactory(), options)
			.then((response) => {
				console.info('estimator work 1st time response', response)
				
				promiseEstimator.work<string>(promiseFactory(), options)
					.then((response2) => {
						console.info('estimator work 2nd time response', response2)
						expect((promiseEstimator as any).estimates['myPromise']).to.be.below(3200)
						done()
					})
			})

	})

	// it('test2', function (done) {
	// 	this.timeout(6000)

	// 	const myPromise: Promise<string> = new Promise<string>((resolve) => {
	// 		const timeout = 3750
	// 		setTimeout(() => {
	// 			resolve(`myPromise is done in ${ timeout }`)
	// 		}, timeout)
	// 	})

	// 	const options: IEstimatorOptions = {
	// 		id: 'myPromise',
	// 		estimate: 5000,
	// 		interval: 1000,
	// 		intervalHandler: (current: number) => {
	// 			console.info('intervalHandler', current)
	// 		}
	// 	}

	// 	promiseEstimator.work(myPromise, options)
	// 		.then((response) => {
	// 			console.info('estimator work 2nd time response', response, options)
	// 			done()
	// 		})

	// })

})
