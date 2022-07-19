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
  // -----catchin data from client----- //
  socket.on("message", (name) => {
    console.log(name)
  })
  // -----catchin data from client (custom event)----- //
  socket.on("myEvent", (name) => {
    console.log(name)
  })
  //  ------------- disconnect message ----------//
  socket.on("disconnect", () => {
    console.log("User disconnect.")
  })

  // --------- server to client data transmition -----------//
  // setTimeout(() => {
  //   socket.send("Server to client")
  // }, 5000)

  // ---------- server to client data transmition continuously---------//

  setInterval(() => {
    let d = new Date()
    let t = d.getTime()
    socket.send(t)
  }, 0.000000001)

  // -----------creating custom event --------------//
  setInterval(() => {
    let d = new Date()
    let t = d.getTime()
    socket.emit("MyEvent", t)
  }, 1000)

  // ---------------Broadcasting-------------------//
  io.sockets.emit("myBroadCast", "Hello EveryOne")
})

expressServer.listen(3000, () => {
  console.log("running")
})
