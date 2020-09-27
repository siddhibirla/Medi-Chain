"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const reportSchema = new mongoose.Schema({}, {
    timestamps: true,
    versionKey: false,
});
reportSchema.index({
    email: 1,
});
const ReportDao = mongoose.model('Report', reportSchema);
exports.default = ReportDao;
//# sourceMappingURL=reportDao.js.map