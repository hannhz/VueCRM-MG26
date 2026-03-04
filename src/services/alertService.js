export const alertService = {
    success(message, title = "Success") {
        alert(`${title}: ${message}`);
        return Promise.resolve();
    },
    error(message, title = "Error") {
        alert(`${title}: ${message}`);
        return Promise.resolve();
    },
    info(message, title = "Info") {
        alert(`${title}: ${message}`);
        return Promise.resolve();
    },
    confirm(message, title = "Confirm") {
        const result = confirm(`${title}: ${message}`);
        return Promise.resolve(result);
    },
};
