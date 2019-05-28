
class OnOffMonitor {
    constructor() {

    }

    initializeMonitor( initializedCallback ) {
        setTimeout(initializedCallback,
            1000);
    }
}
module.exports = OnOffMonitor;

