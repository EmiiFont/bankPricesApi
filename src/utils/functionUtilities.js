function promiseForStream(file) {
    return new Promise((resolve, reject) => {
        file.on('error', reject);
        file.on('finish', resolve);
    });
}

module.exports.promiseForStream = promiseForStream;