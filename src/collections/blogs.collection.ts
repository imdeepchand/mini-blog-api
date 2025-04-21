import z from "zod";
import {Collection, ObjectId} from "mongodb";
import { App } from "../app";

export const BlogEntitySchema = z.object({
    title: z.string(),
    blog_image_url: z.string(),
    category_id: z.custom<ObjectId>(),
    content: z.string(),
    author_id: z.custom<ObjectId>(),
    createdAt: z.date()
})

export type BlogEntitySchema = z.infer<typeof BlogEntitySchema>;
let collection:Collection<BlogEntitySchema>|undefined
export const BlogCollection = () => {
    if(!collection) {
        collection = App.mongodb?.collection<BlogEntitySchema>("Blogs")
        return collection
    } else {
        return collection
    }
}