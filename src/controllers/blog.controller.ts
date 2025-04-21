import { z } from "zod";
import { ObjectId } from "mongodb";
import { Request, Response } from "express"
import { BlogCollection } from "../collections/blogs.collection";
import { HandleAllErrors } from "../helpers/error.helper";
import { ServerErrorsCodes, SuccessCodes } from "../types/httpcodes";
import { AppError } from "../types/type";
import { CategoriesCollection } from "../collections/categories.collection";

class BlogController {
    static async createBlog(req: Request, res: Response) {
        try {
            const {_id} = (req as any).auth;
            const body = z.object({
                title: z.string(),
                blog_image_url: z.string(),
                category_id: z.string(),
                content: z.string(),
                createdAt: z.date().default(new Date())
            }).parse(req.body);
            const newBlog = {
                ...body,
                category_id: new ObjectId(body.category_id),
                author_id: new ObjectId(_id),
                createdAt: new Date()
            };
            const result = await BlogCollection()?.insertOne(newBlog);
            if (!result) throw new AppError('Insert data failed!', ServerErrorsCodes.InternalServerError);
            res.status(SuccessCodes.Created).json({
                data: result,
                message: 'Successfully created blog!'
            });
        } catch (error) {
            HandleAllErrors(error, { res });
        }
    }
    static async getBlogList(req: Request, res: Response) {
        try {
            const result = await BlogCollection()?.aggregate([
                // {
                //     $match: {
                //         title: {$regex:req.query.search, $options:"i"}
                //     }
                // }, 
                {
                    $lookup: {
                        from: "Users",
                        localField: "author_id",
                        foreignField: "_id",
                        as: "author"
                    }
                }, {
                    $lookup: {
                        from: "Categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "category"
                    }
                }, {
                    $addFields: {
                        author: {
                            $arrayElemAt: ["$author.name", 0]
                        },
                        category: {
                            $arrayElemAt: ["$category.name", 0]
                        }
                    }
                }
            ]).toArray()
            if (!result) throw new AppError('Get data failed!', ServerErrorsCodes.InternalServerError);
            res.status(SuccessCodes.Ok).json({
                data: result,
                message: 'Successfully fetched blog list!'
            });
        } catch (error) {
            HandleAllErrors(error, { res });
        }
    }

    static async authorBlogList(req: Request<any>, res: Response) {
        try {
            const {_id} = (req as any).auth
        
            const result = await BlogCollection()?.aggregate([
                {
                    $match: {
                        author_id: new ObjectId(_id)
                    }
                }, 
                {
                    $lookup: {
                        from: "Users",
                        localField: "author_id",
                        foreignField: "_id",
                        as: "author"
                    }
                }, {
                    $lookup: {
                        from: "Categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "category"
                    }
                }, {
                    $addFields: {
                        author: {
                            $arrayElemAt: ["$author.name", 0]
                        },
                        category: {
                            $arrayElemAt: ["$category.name", 0]
                        }
                    }
                }
            ]).toArray()
            if (!result) throw new AppError('Get data failed!', ServerErrorsCodes.InternalServerError);
            res.status(SuccessCodes.Ok).json({
                data: result,
                message: 'Successfully fetched blog list!'
            });
        } catch (error) {
            HandleAllErrors(error, { res });
        }
    }
    static async getCategoryList(req: Request, res: Response) {
        try {
            const result = await CategoriesCollection()?.find({}).toArray();
            if (!result) throw new AppError('Get data failed!', ServerErrorsCodes.InternalServerError);
            res.status(SuccessCodes.Ok).json({
                data: result,
                message: 'Successfully fetched category list!'
            });
        } catch (error) {
            HandleAllErrors(error, { res });
        }
    }
}
export default BlogController;
