"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const path_1 = __importDefault(require("path"));
const ejs_mate_1 = __importDefault(require("ejs-mate"));
const mongoose_1 = __importDefault(require("mongoose"));
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
app.get('/', (req, res) => {
    res.render('store/home');
});
app.listen(4000, () => console.log('server 4000 is running'));
