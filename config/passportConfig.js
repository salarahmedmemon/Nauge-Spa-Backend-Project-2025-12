import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { userByAdmin } from "../model/blog/userByAdminModel.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "confirmedPassword",
    },
    async function (email, confirmedPassword, done) {
      try {
        console.log("Trying to log in with", email, confirmedPassword);
        const normalizedEmail = email.trim().toLowerCase();
        const user = await userByAdmin.findOne({ email:normalizedEmail });
        if (!user) {
          console.log("No user found");
          return done(null, false, { message: "Invalid username" });
        }
        const isValid = await bcrypt.compare(
          confirmedPassword,
          user.confirmedPassword
        );
        console.log("Password valid?", isValid);
        if (!isValid) {
          return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("We are inside the serialized user");
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    console.log("We are inside the deserialized user");
    const user = await userByAdmin.findById(_id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
