const express = require("express")
const urlRoute = require("./routes/url")
const {connectToMongoDB} = require('./connect')
const URL = require("./models/url")

const app = express()
const PORT = 8000;

app.use(express.json())

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log("mongo db connected"))

app.use("/url", urlRoute)
app.get("/:shortId", async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        "shortId": shortId
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