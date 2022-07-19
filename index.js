const express = require("express")
const app = express()
const http = require("http")

const expressServer = http.createServer(app)

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

//  require socket.io
const { Server } = require("socket.io")
const io = new Server(expressServer)

io.on("connection", (socket) => {
  console.log("New user connected")

  setTimeout(() => {
    socket.send("Server to client")
  }, 5000)

  // socket.on("disconnect", () => {
  //   console.log("User disconnect.")
  // })
})

expressServer.listen(3000, () => {
  console.log("running")
})
