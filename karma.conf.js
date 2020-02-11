module.exports = function(config) {
    config.set({

        frameworks: ["mocha", "karma-typescript"],

        files: [
            { pattern: "src/**/*.ts" },
            { pattern: "tests/**/*.ts" },
            { pattern: "tests-helpers/**/*.ts" }
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

		karmaTypescriptConfig: {
			coverageOptions: {
        		instrumentation: false,
			},
			compilerOptions: {
				target: "es2015",
				module: "commonjs",
				esModuleInterop: true,
				noImplicitAny: true,
				outDir: "dist",
				sourceMap: true,
				types : [
					"mocha",
					"chai",
					"node"
				],
				baseUrl: ".",
				paths: {
					"@tests/*": [
						"tests-helpers/*",
						"tests/*"
					],
					"@/*": [
						"./src/*"
					]
				},
			}
		},

        reporters: [
			"spec", 
			"karma-typescript"
		],

        browsers: ["ChromeHeadless"],

        singleRun: true
    });
};
