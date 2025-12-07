import express from "express";
import connectDB from "./db/connectDB.js";
import blogRoute from "./router/blog/blogRoute.js";
import categoryRoute from "./router/blog/categoryRoute.js";
import userByAdminRoute from "./router/blog/userByAdminRoute.js";
import notificationRouter from "./router/blog/notificationRouter.js";
import newsLetterRoute from "./router/newsLetterRoute.js";
import settingRoute from "./router/blog/settingRoute.js";
import cors from "cors";
import passport from "./config/passportConfig.js";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 7000;
app.use("/images", express.static(path.join(process.cwd(), "images")));

// ✅ Enable CORS FIRST — before routes
const corsOptions = {
  origin: ["https://naugespafrontend.netlify.app"],

  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

connectDB();

// Session and Passport setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60, // 1 hour
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes should come AFTER middleware

app.use(["/admin/blog", "/moderator/blog", "/user/blog"], blogRoute);
app.use(
  ["/admin/categories", "/moderator/categories", "/user/categories"],
  categoryRoute
);
//app.use(["/admin/user", "/moderator/user", "/user/user","/api/user"], userByAdminRoute);
app.use("/api/user", userByAdminRoute);
app.use("/admin/user", userByAdminRoute);
app.use("/moderator/user", userByAdminRoute);
app.use("/user/user", userByAdminRoute);
app.use(
  ["/admin/notification", "/moderator/notification", "/user/notification"],
  notificationRouter
);

app.use(
  ["/admin/setting", "/moderator/setting", "/user/setting",'/setting'],
  settingRoute
);
app.use(
  ["/admin/newsletter", "/moderator/newsletter", "/user/newsletter"],
  newsLetterRoute
);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
