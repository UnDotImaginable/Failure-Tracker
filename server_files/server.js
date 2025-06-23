const express = require("express") // JS recognizes express.js installation. ✅

const app = express() // This is an express.js server
const port = 8000

app.get("/", (req, res) => {
    res.send("Hello World");
})
// Configured one possible path for the webpage to take

app.listen(port, () => {
    console.log("App listening on port ${port}!");
})



