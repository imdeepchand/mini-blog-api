import { Router } from "express";
import UsersController from "../controllers/users.controller"
export const user_router = Router();

user_router.post("/signup",UsersController.signup)
user_router.post("/signin", UsersController.signin)