
const handleNotFound = (next, message = 'הרשומה לא נמצאה') => {
    const error = new Error(message);
    error.statusCode = 404;
    return next(error);
};
const handleBadRequest = (next, message = 'בקשה לא תקינה') => {
    const error = new Error(message);
    error.statusCode = 400;
    return next(error);
};

module.exports = {
    handleNotFound,
    handleBadRequest
};