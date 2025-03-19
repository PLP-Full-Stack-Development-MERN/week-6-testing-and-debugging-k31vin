const errorHandler = (err, req, res, next) => {
const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

console.error(`ERROR: ${err.message}`);
console.error(`Request Path: ${req.path}`);
console.error(`Request Method: ${req.method}`);
console.error(`Stack Trace: ${err.stack}`);

if (process.env.NODE_ENV === 'development') {
    console.error('Request Body:', req.body);
    console.error('Request Query:', req.query);
    console.error('Request Params:', req.params);
}

res.status(statusCode);
res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
});
};