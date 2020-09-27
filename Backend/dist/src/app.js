"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const morgan_1 = __importDefault(require("morgan"));
const resource_1 = require("./user/resource");
require("./utils/database");
const winston_1 = __importDefault(require("./utils/winston"));
dotenv.config();
const cookieParser = require('cookie-parser')();
const cors = require('cors')();
exports.app = express_1.default();
exports.app.use(helmet_1.default({
    frameguard: {
        action: "SAMEORIGIN"
    }
}));
exports.app.use(cors);
exports.app.use(cookieParser);
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(compression_1.default());
exports.app.use(morgan_1.default("combined"));
exports.app.get('/', (_req, res) => {
    res.status(http_status_codes_1.default.OK).json({ "status": `up` });
});
exports.vScoped = express_1.default.Router();
exports.vScoped.get('/', (req, res) => { res.status(200).json({ "status": `up` }); });
resource_1.configure(exports.vScoped);
exports.app.use("/v1", exports.vScoped);
process.on('SIGINT', () => {
    winston_1.default.debug('\nGracefully shutting down from SIGINT (Ctrl-C)');
    process.exit(1);
});
exports.default = exports.app;
//# sourceMappingURL=app.js.map