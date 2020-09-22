import { ReportService } from "./report/ReportService";
import { UserService } from "./user/UserService";


export interface ServiceContainer {
    
    // services
    reportService: ReportService,
    userService: UserService,
}

export const allServices: ServiceContainer = {
    reportService: new ReportService(),
    userService: new UserService()
};