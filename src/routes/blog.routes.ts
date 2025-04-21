import { jwtMiddleware } from "../middlewares/jwt.middleware";
import BlogController from "../controllers/blog.controller";
import { Router } from "express";

export const blog_router = Router();

blog_router.post("/create",jwtMiddleware, BlogController.createBlog);
blog_router.post("/blog-list", BlogController.getBlogList);
blog_router.post("/my-blog-list",jwtMiddleware, BlogController.authorBlogList);
blog_router.post("/category", BlogController.getCategoryList);
