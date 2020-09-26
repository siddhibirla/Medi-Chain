import compression from 'compression';
import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import httpCodes from 'http-status-codes';
import morgan from "morgan";
//import { configure as authApis } from './auth/resource';
import { configure as userApis } from './user/resource';
import './utils/database';
import logger from './utils/winston';

dotenv.config();

const cookieParser = require('cookie-parser')();
// const cors = require('cors')({origin: true});
const cors = require('cors')();

export const app = express();

app.use(helmet({
  frameguard: {
    action: "SAMEORIGIN"
  }
}));
app.use(cors);
app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan("combined"));

app.get('/', (_req: express.Request, res: express.Response) => {
    res.status(httpCodes.OK).json({ "status": `up`});
});
// app.use((req, res, next) => {
//   const errorObj = {
//       statusCode: httpCodes.NOT_FOUND,
//       status: messages.ERROR,
//       message: messages.ROUTE_NOT_FOUND,
//   };
//   res.status(errorObj.statusCode).json(errorObj);
// });

export const vScoped = express.Router();
vScoped.get('/', (req, res) => { res.status(200).json({ "status": `up`}); });

//authApis(vScoped);
userApis(vScoped);

app.use("/v1", vScoped);


process.on('SIGINT', () => {
  logger.debug('\nGracefully shutting down from SIGINT (Ctrl-C)');
  process.exit(1);
});

export default app;
