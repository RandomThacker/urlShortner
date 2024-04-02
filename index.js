const express = require("express")
const {connectToMongoDB} = require('./connect')
const URL = require("./models/url");
const path = require("path")
  // Initialize Express app
const app = express()
const PORT = 8000;

const userRoute = require("./routes/user")
const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRouter")

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log("mongo db connected"))

app.use("/url", urlRoute)
app.use("/urer", userRoute)
app.use("/",staticRoute)

app.get("/:shortId", async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory: {
                timestamp: Date.now()
            }
        }
    })
    res.redirect(entry.redirectURL)
})


app.listen(PORT, ()=>{
    console.log("APP IS LISTENING");
})