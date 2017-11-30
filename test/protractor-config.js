exports.config = {
    seleniumAddress: 'http://localhost:9515',
    specs: ['T01-LoadData.js', 'T02-AddResearcher.js', 'T03-DeleteResearcher.js'],
    capabilities: {
        'browserName' : 'phantomjs'
    }
}