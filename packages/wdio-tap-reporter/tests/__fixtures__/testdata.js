export const RUNNER = {
    cid: '0-0',
    _duration: 5032,
    config: { hostname: 'localhost' },
    capabilities: {
        browserName: 'loremipsum',
    },
    specs: ['/foo/bar/baz.js'],
}

export const TESTS = [{
    cid: '0-0',
    uid: 'test1',
    title: 'first test',
    state: 'skipped',
}, {
    cid: '0-0',
    uid: 'test2',
    title: 'second test',
    state: 'passed',
    parentUid: 'test2'
}, {
    cid: '0-0',
    uid: 'test3',
    title: 'third test',
    state: 'failed',
}]

export const INVALID_TEST = {
    cid: '0-0',
    uid: 'test3',
    title: 'third test',
    state: 'invalid_state',
}

export const SUITES = [{
    cid: '0-0',
    uid: 'test_suite_1',
    title: 'test suite 1',
    hooks: [],
    tests: TESTS
}, {
    cid: '0-1',
    uid: 'test_suite_2',
    title: 'no tests suite',
    hooks: [],
    tests: []
}, {
    cid: '0-2',
    uid: 'test_suite_3',
    title: 'all pass suite',
    hooks: [],
    tests: [TESTS[1]]
}, {
    cid: '0-3',
    uid: 'test_suite_4',
    title: 'all pass/skip suite',
    hooks: [],
    tests: [TESTS[0], TESTS[1]]
}, {
    cid: '0-4',
    uid: 'test_suite_5',
    title: 'invalid suite',
    hooks: [],
    tests: [INVALID_TEST]
}]

export const PARENT_SUITE = {
    cid: '0-5',
    uid: 'test_suite_6',
    title: 'parent suite',
    hooks: [],
    tests: [{
        cid: '0-5',
        uid: 'test2',
        title: 'parent test',
        state: 'passed'
    }]
}
export const CHILD_SUITE = {
    cid: '0-6',
    uid: 'test_suite_7',
    title: 'child suite',
    hooks: [],
    tests: [{
        cid: '0-6',
        uid: 'test2',
        title: 'child test',
        state: 'passed',
        parentUid: '0-5'
    }]
}