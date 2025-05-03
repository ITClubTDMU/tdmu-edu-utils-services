import { Router } from 'express';
import { dkmhRouter } from './dkmhRoute';
import { checkDkmhToken } from '~/middlewares/checkDkmhToken';
// import swaggerUi from "swagger-ui-express";
// import routes
// import { router as accountRouter } from "./accountRoute";

const router = Router();

// Swagger
// if (process.env.NODE_ENV === "development") {
//   router.use("/dev/api-docs", swaggerUi.serve);
// }

// Routes
// router.use("/accounts", accountRouter);
router.use('/dkmh', checkDkmhToken, dkmhRouter);

export { router as routerV1 };
