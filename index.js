const express = require("express");


const cors= require("cors")
const app= express();
const WhatsappRoute = require("./routes/WhatsappRoute");
const { connection } = require("./db");
const { candidateRouter } = require("./routes/CandidateRoute");

app.use(express.json())
app.use(cors())

app.use("/api/whatsapp",WhatsappRoute)
app.use("/candidate", candidateRouter)

app.get("/",(req,res)=>{
    res.send("Welcome to Whatsapp API")
})

app.listen(process.env.PORT || 8010,async()=>{
    try {
        await connection
        console.log("Connected to DB")
        console.log(`WhatsApp Server is running on PORT ${process.env.PORT || 8010}`)
    } catch (error) {
        console.log(error)
    }
})