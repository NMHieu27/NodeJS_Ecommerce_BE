const authRouter = require('./authRoute');
function route(app) {
    app.use('/api/user', authRouter);
}
module.exports = route;