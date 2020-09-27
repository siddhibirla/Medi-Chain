"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const appRootPath = __importStar(require("app-root-path"));
const Winston = __importStar(require("winston"));
const { format } = Winston;
const options = {
    file: {
        level: 'info',
        filename: `${appRootPath}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: true,
        prettyPrint: true,
        format: format.combine(format.colorize({ all: true }), format.timestamp(), format.simple(), format.splat(), format.json()),
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        prettyPrint: true,
        format: format.combine(format.timestamp(), format.simple(), format.splat(), format.json(), format.colorize({ all: true })),
    },
};
const logger = Winston.createLogger({
    transports: [
        new Winston.transports.File(options.file),
        new Winston.transports.Console(options.console),
    ],
    exitOnError: false,
});
class LoggerStream {
    write(message) {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
}
exports.LoggerStream = LoggerStream;
exports.default = logger;
//# sourceMappingURL=winston.js.map