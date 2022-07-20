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

  // ---------------Broadcasting (for all connection)------------------//
  io.sockets.emit("myBroadCast", "Hello EveryOne")

  //============================Rooms===================================//
  socket.join("kitchen-room")
  let sizeOfKitchen = io.sockets.adapter.rooms.get("kitchen-room").size
  io.sockets
    .in("kitchen-room")
    .emit(
      "kitchen-event",
      "lets coock." + "acitve connection = " + sizeOfKitchen
    )

  socket.join("bed-room")
  let sizeOfBed = io.sockets.adapter.rooms.get("kitchen-room").size
  io.sockets
    .in("bed-room")
    .emit("bed-event", "lets sleep" + "acitve connection = " + sizeOfBed)
  io.sockets
    .in("bed-room")
    .emit(
      "sleep-event",
      "lets take some rest." + "acitve connection = " + sizeOfBed
    )

  socket.join("dining-room")
  let sizeOfDining = io.sockets.adapter.rooms.get("dining-room").size
  io.sockets
    .in("dining-room")
    .emit("dining-event", "lets eat" + "acitve connection = " + sizeOfDining)
})

// ---------------Broadcasting (for some connection using namespace)------------------//
let nsp1 = io.of("/buy")
let nsp2 = io.of("/sell")

nsp1.on("connection", (socket) => {
  nsp1.emit("MyEvent", "hello namespace 1")
})
nsp2.on("connection", (socket) => {
  nsp2.emit("MyEvent2", "hello namespace 2")
})

expressServer.listen(3000, () => {
  console.log("running")
})
