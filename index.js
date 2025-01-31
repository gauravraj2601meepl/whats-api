const express = require("express");


const cors= require("cors")
const app= express();
const WhatsappRoute = require("./routes/WhatsappBusiness/WhatsappBusinessRoute");
const WebhookRoute = require("./routes/WhatsappBusiness/WebhookRoute")
const { connection } = require("./db");
const { candidateRouter } = require("./routes/CandidateRoute");

app.use(express.json())
app.use(cors())

app.use("/api/whatsapp",WhatsappRoute, WebhookRoute)
app.use("/candidate", candidateRouter)

app.get("/",(req,res)=>{
    res.send("Welcome to Whatsapp API")
})

app.listen(process.env.PORT || 8010,async()=>{
    try {
        await connection
        console.log("Connected to DataBase")
        console.log(`WhatsApp Server is running on PORT ${process.env.PORT || 8010}`)
    } catch (error) {
        console.log(error)
    }
})