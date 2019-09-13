import WDIOReporter from '@wdio/reporter'
import { EOL } from 'os'

class TapReporter extends WDIOReporter {
    constructor (options) {
        /**
        * make spec reporter to write to output stream by default
        */
        options = Object.assign({ stdout: true }, options)
        super(options)

        this.results = {
            pass: 0,
            skip: 0,
            fail: 0,
            tests: 0,
            done: 0
        }
        this.suites = []
    }

    onRunnerStart () {
        this.write('TAP version 13')
    }

    onTestStart () {
    }

    /**
    * pending tests
    */
    onTestSkip (test) {
        this.onTestResult(test)
    }

    /**
    * passing tests
    */
    onTestPass (test) {
        this.onTestResult(test)
    }

    /**
    * failing tests
    */
    onTestFail (test) {
        this.onTestResult(test)
    }

    onSuiteStart (suite) {
        this.results.tests += suite.tests.length
        this.suites.push(suite)
        this.write(`# [Runner: ${suite.cid}] ${suite.title}`)

    }

    onSuiteEnd () {
    }

    onRunnerEnd(runner) {
        if (this.results.tests === 0) {
            this.write('1..0 # SKIP No tests present')
        }
        const {
            fail,
            pass,
            skip,
            tests
        } = this.results
        const duration = runner._duration
        const lines = [
            `1..${tests}`,
            `# tests ${tests}`,
            `# pass ${pass}`,
            `# skip ${skip}`,
            `# fail ${fail}`,
            `# Finished in ${duration}ms`
        ]
        this.write(lines.join(EOL))
    }

    onTestResult(test) {
        this.results.done++

        var testTitle = this.getTestPath(test)
        var lines = []
        const { done } = this.results

        switch (test.state) {
        case 'passed':
            this.results.pass++
            lines.push(`ok ${done} - ${testTitle}`)
            break
        case 'skipped':
            this.results.skip++
            lines.push(`ok ${done} - ${testTitle} # SKIP Test skipped`)
            break
        case 'failed':
            this.results.fail++
            var error = test.err || {}
            lines.push(`not ok ${done} - ${testTitle}`)
            lines.push('# Diagnostics')
            lines.push('  ---')
            lines.push(`  message: ${error.message || 'Test failed without message'}`)
            lines.push('  severity: fail')
            lines.push('  data:')
            lines.push(`    file: ${test.file}`)
            if (error.type) {
                lines.push(`    type: ${error.type}`)
            }
            if (error.stack) {
                lines.push(`    stack: ${error.stack}`)
            }
            lines.push('  ...')
            break

        default:
            lines.push(`Bail out! Test ${done} has incorrect state and could not be processed`)
            this.results.fail++
        }
        this.write(lines.join(EOL))
    }

    getTestPath(test) {
        if (test.uid === test.parentUid) {
            return test.title
        }

        var parents = []
        var path = [test.title]

        var suites = this.suites.filter((suite) => suite.cid === test.cid)

        let parent = suites.find((suite) => suite.uid === test.parentUid)

        if (parent) {
            path.push(parent.title)

            while (parent.title !== parent.parent) {
                parent = suites.find((suite) => suite.title === parent.parent)

                if (parent) {
                    parents.push(parent.uid)
                    path.push(parent.title)
                }
            }
        }

        return path.slice().reverse().join(' \u203A ')
    }
}

export default TapReporter