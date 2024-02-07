// imports
import express from "express";
import { Express } from "express";
import cors from "cors";
import helmet from "helmet";

// the routers
import { handle404Error } from "./utils/404.errors";
import { welcomeAPI } from "./utils/shared-routes";
import rateLimit from "express-rate-limit";
import { limiterConfig } from "./utils/rate-limiter_config";
import userRoutes from "./modules/User/user.routes";
import productRoutes from "./modules/Product/product.routes";

// allow dependency injection
export const createExpressApp = (): Express => {
    const app = express();

    // the middlewares
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    const API_URL = process.env.API_URL || "/api/v1";

    app.use(rateLimit(limiterConfig));
    app.get("/", welcomeAPI);
    app.use(`${API_URL}/users`, userRoutes);
    app.use(`${API_URL}/products`, productRoutes);

    // the routes goes here
    app.use(handle404Error);
    return app;
};

export default createExpressApp;
