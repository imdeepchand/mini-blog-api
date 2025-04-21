import { App } from "./app";
import { user_router } from "./routes/users.routes";
import { upload_router } from "./routes/upload.routes";
import { blog_router } from "./routes/blog.routes";
const app = new App({
    apis: [
        {
            version: "v1",
            routers: [user_router, upload_router, blog_router]
        }
    ]
})

app.start();