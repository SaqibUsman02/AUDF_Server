const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const UserImage = require("./models/ImageSchema");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./router/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");

app.use(express.json({limit: "30mb",extended:true}));

//--------- yeh dotenv ek hi dafa app.js mein likh do fir kahin bhi kisi bhi file mein agar env access krna hua to simple process.env se access kr skte------------

dotenv.config({ path: "./config.env" });

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
    origin: "https://audf.vercel.app",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,

	})
);

app.use("/auth", authRoute);

app.use(cookieParser());


require("./db/conn");

app.use(express.json());

//const User = require('./models/userSchema');
app.use(require("./router/auth"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`boooooooooooom Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    try{
        UserImage.find({}).then(data => {
            res.json(data)
        }).catch(error => {
            res.status(408).json({ error })
        })
    }catch(error){
        res.json({error})
    }
  })

app.get("/about", (req, res) => {
  res.send("a about gye g ham maidan mein.");
});
// app.get('/contact', (req,res) => {
//     res.send("a asdasd gye g ham maidan mein.")
// })

app.get("/home", (req, res) => {
  res.send("a home gye g ham maidan mein.");
});
