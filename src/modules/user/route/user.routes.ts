import * as express from "express";
import { authentification } from "../../../services/middleware/authentification";
import { UserController } from "../controller/user.controllers";
import { AuthController } from "../controller/auth.controller";
const Router = express.Router();

Router.get("/profile", authentification, AuthController.getProfile);
Router.post("/account", UserController.signup);
Router.post("/login", AuthController.login);
Router.put("/update/:id", authentification, UserController.updateUser);
Router.delete("/delete/:id", authentification, UserController.deleteUser);
export { Router as userRouter };
