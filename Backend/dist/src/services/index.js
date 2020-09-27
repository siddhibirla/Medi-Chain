"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportService_1 = require("./report/ReportService");
const UserService_1 = require("./user/UserService");
exports.allServices = {
    reportService: new ReportService_1.ReportService(),
    userService: new UserService_1.UserService()
};
//# sourceMappingURL=index.js.map