import TapReporter from '../src'

describe('Tap Reporter', () => {
    it('should write correct test line results', () => {
        const reporter = new TapReporter({ })
        reporter.write = jest.fn()

        reporter.onTestSkip()

        expect(reporter.write.mock.calls).toEqual([['SKIPPED OK']])
        reporter.write.mockClear()
    })
})