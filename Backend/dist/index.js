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
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./src/app"));
const winston_1 = __importDefault(require("./src/utils/winston"));
dotenv_1.default.config();
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const envPort = process.env.PORT;
const port = normalizePort(envPort ? envPort : "4001");
app_1.default.set('port', port);
const server = http_1.default.createServer(app_1.default);
const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    switch (error.code) {
        case 'EACCES':
            winston_1.default.debug(`${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            winston_1.default.debug(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
};
const onListening = () => __awaiter(void 0, void 0, void 0, function* () {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    winston_1.default.info(`Listening on ${bind}`);
});
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
exports.default = server;
//# sourceMappingURL=index.js.map