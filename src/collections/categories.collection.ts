import z from "zod";
import {Collection} from "mongodb";
import { App } from "../app";

export const CategoriesEntitySchema = z.object({
    name: z.string()
})

export type CategoriesEntitySchema = z.infer<typeof CategoriesEntitySchema>;
let collection:Collection<CategoriesEntitySchema>|undefined
export const CategoriesCollection = () => {
    if(!collection) {
        collection = App.mongodb?.collection<CategoriesEntitySchema>("Categories")
        return collection
    } else {
        return collection
    }
}