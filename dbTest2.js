const express = require("express");
const app = express();

app.get("/api/hello", (req, res) => {
    res.send("hello world 3");
});

const port = process.env.myPort || 3000;
app.listen(port, err => {
    if (err) console.log(err)
    else console.log(`app listen to port ${port}`);
})