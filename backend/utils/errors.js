
const handleNotFound = (next, message = 'הרשומה לא נמצאה') => {
    const error = new Error(message);
    error.statusCode = 404;
    return next(error);
};


module.exports = {
    handleNotFound
};