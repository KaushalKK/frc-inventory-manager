module.exports = function () {
    'use strict';

    switch (process.argv[2]) {
        case 'prod':
            return {
                dbConfig: ""
            }
        default:
            return {
                dbConfig: "mongodb://localhost/frc-inventory"
            }
    }
};
