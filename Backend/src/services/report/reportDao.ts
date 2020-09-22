import * as mongoose from 'mongoose';
import { IReport } from './report.schema';

interface IReportModel extends IReport, mongoose.Document {}

const reportSchema = new mongoose.Schema({
   
}, {
    // toJSON: true,
    timestamps: true,
    versionKey: false,
});

// define compound indexes in the schema
reportSchema.index({
    email: 1,
});

const ReportDao = mongoose.model<IReportModel>('Report', reportSchema);

export default ReportDao;