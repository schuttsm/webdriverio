import WDIOReporter from '@wdio/reporter'

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
    }

    onRunnerStart () {
        this.write('TAP version 13')
    }

    onTestStart () {
        this.results.tests++
    }

    /**
    * pending tests
    */
    onTestSkip () {
        this.results.done++
        this.results.skip++

        // var testTitle = this.getTestPath(test)
        // console.log(JSON.stringify(arguments))

        this.write(`ok - ${JSON.stringify(arguments)} # SKIP Test skipped`)
    }

    /**
    * passing tests
    */
    onTestPass () {
        this.results.done++
        this.results.pass++
        this.write('OK ')
    }

    /**
    * failing tests
    */
    onTestFail () {
        this.results.done++
        this.results.fail++
        this.write('NOT OK')
    }

    onSuiteStart () {
        /*
        if (this.results.tests === 0) {
          this.write("1..0 # SKIP No tests present")
        }
        */
    }

    onSuiteEnd () {

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