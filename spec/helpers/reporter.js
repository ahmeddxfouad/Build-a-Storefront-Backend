const { SpecReporter } = require('jasmine-spec-reporter');

jasmine.getEnv().clearReporters(); // remove default dot reporter
jasmine.getEnv().addReporter(
    new SpecReporter({
        spec: {
            displaySuccessful: true,   // show passed test names
            displayFailed: true,       // show failed test names
            displayPending: true
        },
        summary: {
            displaySuccessful: true,
            displayFailed: true,
            displayPending: true,
            displayDuration: true
        }
    })
);
