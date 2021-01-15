module.exports = {
    "roots": [
        "<rootDir>/tests"
    ],
    "preset": "jest-puppeteer",
    "globals": {
        "URL": "http://localhost:8080"
    },
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
}