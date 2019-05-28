
class JohnnyFiveMonitor {
    constructor() {

    }

    initializeMonitor( initializedCallback ) {
        setTimeout(initializedCallback,
            1000);
    }
}

module.exports = JohnnyFiveMonitor;

