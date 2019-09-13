import TapReporter from '../src'
import {
    RUNNER,
    TESTS,
    INVALID_TEST,
    SUITES,
    PARENT_SUITE,
    CHILD_SUITE
} from './__fixtures__/testdata'

import { EOL } from 'os'

describe('Tap Reporter', () => {
	var reporter;
	beforeEach(() => {
		reporter = new TapReporter({ })
        reporter.write = jest.fn()
	})

	afterEach(() => {
		reporter.write.mockClear()
	})

	it('should write correct results for a suite with no tests', () => {
		expect(reporter.results.done).toEqual(0)
        expect(reporter.results.skip).toEqual(0)
        expect(reporter.results.pass).toEqual(0)
        expect(reporter.results.tests).toEqual(0)
		reporter.onRunnerStart()
        reporter.onSuiteStart(SUITES[1])
        reporter.onRunnerEnd(RUNNER)
        expect(reporter.results.done).toEqual(0)
        expect(reporter.results.skip).toEqual(0)
        expect(reporter.results.pass).toEqual(0)
        expect(reporter.results.tests).toEqual(0)
        expect(reporter.write.mock.calls.length).toEqual(4)
        expect(reporter.write.mock.calls[0][0]).toEqual(`TAP version 13`)
        expect(reporter.write.mock.calls[1][0]).toEqual(`# [Runner: 0-1] no tests suite`)
        expect(reporter.write.mock.calls[2][0]).toEqual(`1..0 # SKIP No tests present`)
        expect(reporter.write.mock.calls[3][0]).toEqual([
			`1..0`,
		    `# tests 0`,
		    `# pass 0`,
		    `# skip 0`,
		    `# fail 0`,
		    `# Finished in 5032ms`
        ].join(EOL))
	})

    it('should output correct results for a suite with all test types', () => {
		expect(reporter.results.done).toEqual(0)
        expect(reporter.results.skip).toEqual(0)
        expect(reporter.results.pass).toEqual(0)
        // todo: set tests before any run: expect(reporter.results.tests).toEqual(3)
        
        reporter.onRunnerStart()
        reporter.onSuiteStart(SUITES[0])
        reporter.onTestSkip(TESTS[0])
        reporter.onTestPass(TESTS[1])
        reporter.onTestFail(TESTS[2])

        expect(reporter.results.done).toEqual(3)
        expect(reporter.results.skip).toEqual(1)
        expect(reporter.results.pass).toEqual(1)
        expect(reporter.results.tests).toEqual(3)

        reporter.onRunnerEnd(RUNNER)
        expect(reporter.write.mock.calls.length).toEqual(6)
        expect(reporter.write.mock.calls[0][0]).toEqual(`TAP version 13`)
        expect(reporter.write.mock.calls[1][0]).toEqual(`# [Runner: 0-0] test suite 1`)
        expect(reporter.write.mock.calls[2][0]).toEqual(`ok 1 - first test # SKIP Test skipped`)
        expect(reporter.write.mock.calls[3][0]).toEqual(`ok 2 - second test`)
        expect(reporter.write.mock.calls[4][0]).toEqual([
        	`not ok 3 - third test`,
    		`# Diagnostics`,
    		`  ---`,
    		`  message: Test failed without message`,
    		`  severity: fail`,
    		`  data:`,
    		`    file: undefined`,
    		`  ...`].join(EOL))
        expect(reporter.write.mock.calls[5][0]).toEqual([
			`1..3`,
    		`# tests 3`,
    		`# pass 1`,
    		`# skip 1`,
    		`# fail 1`,
    		`# Finished in 5032ms`
    	].join(EOL))        
    })

    it('should output correct results for a passing test suite', () => {
		reporter.onRunnerStart()
        reporter.onSuiteStart(SUITES[2])
        reporter.onTestStart()
        reporter.onTestPass(SUITES[2].tests[0])
        reporter.onSuiteEnd()
        reporter.onRunnerEnd(RUNNER)
        expect(reporter.write.mock.calls.length).toEqual(4)
        expect(reporter.write.mock.calls[0][0]).toEqual(`TAP version 13`)
        expect(reporter.write.mock.calls[1][0]).toEqual(`# [Runner: 0-2] all pass suite`)
        expect(reporter.write.mock.calls[2][0]).toEqual(`ok 1 - second test`)
        expect(reporter.write.mock.calls[3][0]).toEqual([
        	`1..1`,
    		`# tests 1`,
    		`# pass 1`,
    		`# skip 0`,
    		`# fail 0`,
    		`# Finished in 5032ms`
        ].join(EOL))
    })

    it('should output correct results for a passing test suite with skipped tests', () => {
		reporter.onRunnerStart()
        reporter.onSuiteStart(SUITES[3])
        reporter.onTestSkip(SUITES[3].tests[0])
        reporter.onTestPass(SUITES[3].tests[1])
        reporter.onRunnerEnd(RUNNER)
        expect(reporter.write.mock.calls.length).toEqual(5)
        expect(reporter.write.mock.calls[0][0]).toEqual(`TAP version 13`)
        expect(reporter.write.mock.calls[1][0]).toEqual(`# [Runner: 0-3] all pass/skip suite`)
        expect(reporter.write.mock.calls[2][0]).toEqual(`ok 1 - first test # SKIP Test skipped`)
        expect(reporter.write.mock.calls[3][0]).toEqual(`ok 2 - second test`)
        expect(reporter.write.mock.calls[4][0]).toEqual([
        	`1..2`,
    		`# tests 2`,
    		`# pass 1`,
    		`# skip 1`,
    		`# fail 0`,
    		`# Finished in 5032ms`
        ].join(EOL))
    })

    it('should write correct results for a suite with nested suites', () => {
		reporter.onRunnerStart()
        reporter.onSuiteStart(PARENT_SUITE)
        reporter.onTestPass(PARENT_SUITE.tests[0])
        reporter.onSuiteEnd()
        reporter.onSuiteStart(CHILD_SUITE)
        reporter.onTestPass(CHILD_SUITE.tests[0])
        reporter.onSuiteEnd()
        reporter.onRunnerEnd(RUNNER)
        expect(reporter.write.mock.calls.length).toEqual(6)
        expect(reporter.write.mock.calls[0][0]).toEqual(`TAP version 13`)
        expect(reporter.write.mock.calls[1][0]).toEqual(`# [Runner: 0-5] parent suite`)
        expect(reporter.write.mock.calls[2][0]).toEqual(`ok 1 - parent test`)
        expect(reporter.write.mock.calls[3][0]).toEqual(`# [Runner: 0-6] child suite`)
        expect(reporter.write.mock.calls[4][0]).toEqual(`ok 2 - child test`)
        expect(reporter.write.mock.calls[5][0]).toEqual([
        	`1..2`,
    		`# tests 2`,
    		`# pass 2`,
    		`# skip 0`,
    		`# fail 0`,
    		`# Finished in 5032ms`
        ].join(EOL))
    })

    it('should fail when a test has an invalid state', () => {
		reporter.onRunnerStart()
        reporter.onSuiteStart(SUITES[4])
        reporter.onTestFail(INVALID_TEST)
        reporter.onRunnerEnd(RUNNER)
        expect(reporter.write.mock.calls.length).toEqual(4)
        expect(reporter.write.mock.calls[0][0]).toEqual(`TAP version 13`)
        expect(reporter.write.mock.calls[1][0]).toEqual(`# [Runner: 0-4] invalid suite`)
        expect(reporter.write.mock.calls[2][0]).toEqual(`Bail out! Test 1 has incorrect state and could not be processed`)
        expect(reporter.write.mock.calls[3][0]).toEqual([
        	`1..1`,
    		`# tests 1`,
    		`# pass 0`,
    		`# skip 0`,
    		`# fail 1`,
    		`# Finished in 5032ms`
        ].join(EOL))
    })
})