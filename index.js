"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const path_1 = __importDefault(require("path"));
const ejs_mate_1 = __importDefault(require("ejs-mate"));
const mongoose_1 = __importDefault(require("mongoose"));
const method_override_1 = __importDefault(require("method-override"));
const productRoute_js_1 = __importDefault(require("./routes/productRoute.js"));
const promotionRoute_js_1 = __importDefault(require("./routes/promotionRoute.js"));
const reviewRoute_1 = __importDefault(require("./routes/reviewRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const appError_js_1 = require("./utilities/appError.js");
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const user_js_1 = __importDefault(require("./models/user.js"));
const uts_js_1 = require("./utilities/uts.js");
const dbUrl = 'mongodb://localhost:27017/a-shop';
mongoose_1.default
    .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
    console.log('Mongo server Running');
})
    .catch((e) => {
    console.log('Error with the Mongo Server');
    console.log(e);
});
app.engine('ejs', ejs_mate_1.default);
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '/views'));
app.use(express_1.default.json()); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(method_override_1.default('_method'));
const secret = process.env.secret || '@#%%@#EDSsdfsdkfdkdk_s';
const store = new connect_mongo_1.default({
    mongoUrl: dbUrl,
    crypto: {
        secret
    },
    touchAfter: 24 * 60 * 60
});
store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e);
});
const sessionConfig = {
    store,
    name: 'which-session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(express_session_1.default(sessionConfig));
app.use(connect_flash_1.default());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_local_1.default(user_js_1.default.authenticate()));
passport_1.default.serializeUser(user_js_1.default.serializeUser());
passport_1.default.deserializeUser(user_js_1.default.deserializeUser());
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.currentUser = req.user;
    if (res.locals.currentUser) {
        res.locals.userInfo = yield user_js_1.default.findOne({
            username: req.user.username
        }).populate('cart');
    }
    res.locals.afterDiscount = uts_js_1.afterDiscount;
    res.locals.isAdmin = req.session.admin;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    next();
}));
app.use('/', userRoute_1.default);
app.use('/promotion', promotionRoute_js_1.default);
app.use('/products', productRoute_js_1.default);
app.use('/products/:id/reviews', reviewRoute_1.default);
app.use('/', (req, res) => {
    res.redirect('/products');
});
app.all('*', (req, res, next) => {
    next(new appError_js_1.appError('Page Not Found', 404));
});
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message)
        err.message = 'Oh Boy, something went wrong';
    res.status(status).render('error/error', { err });
});
app.listen(4000, () => console.log('server 4000 is running'));
