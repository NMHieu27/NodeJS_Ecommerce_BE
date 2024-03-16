const authRouter = require('./authRoute');
const productRouter = require('./productRoute');
function route(app) {
    app.use('/api/user', authRouter);
    app.use('/api/product', productRouter);
}
module.exports = route;