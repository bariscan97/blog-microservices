import express,{Response} from "express";
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { createProxyMiddleware } from "http-proxy-middleware"
import dotenv from "dotenv"
import * as path from "path"


dotenv.config({path: path.join(__dirname, '../.env')});

const app = express();


app.use(cors())
app.use(helmet())
app.use(morgan("combined"))
app.disable("x-powered-by")

const services = [
  {
    route: "/auth",
    target: process.env.AUTH_URL,
    
  },
  {
    route: "/users",
    target: process.env.USERS_URL,
  },
  {
    route: "/posts",
    target: process.env.POSTS_URL,
  }
];



services.forEach(({ route, target }) => {
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
  };

  app.use(route, createProxyMiddleware(proxyOptions));
});

app.use((err:any, res:Response) => {
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Route not found.",
    data: null,
  });
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});

