const express = require("express")

// MOCK DB
const db = require("./db.json")
const counters = {
  users: Math.max(...Object.keys(db.users)),
  devices: Math.max(...Object.keys(db.devices)),
}

const app = express()

app.use(express.json())

// CREATE
app.post("/users", (req, res) => {
  const {
    body: { username, email },
  } = req

  counters.users += 1
  const id = counters.users

  db.users[id] = {
    id,
    username,
    email,
  }

  res.send(db.users[id])
})

// READ collection
app.get("/users", (req, res) => {
  res.send(db.users)
})

// READ single
app.get("/users/:userId", (req, res) => {
  const {
    params: { userId },
  } = req

  const user = db.users[userId]

  if (!user) {
    res.status(404).send({ error: "Not found" })

    return
  }

  res.send(user)
})

// UPDATE
app.put("/users/:userId", (req, res) => {
  const {
    params: { userId },
    body: { username, email },
  } = req

  const user = db.users[userId]

  if (!user) {
    res.status(404).send({ error: "Not found" })

    return
  }

  user.username = username ?? user.username
  user.email = email ?? user.email

  res.send(user)
})

// DELETE
app.delete("/users/:userId", (req, res) => {
  const {
    params: { userId },
  } = req

  const {
    users: { [userId]: user, ...otherUsers },
  } = db

  if (!user) {
    res.status(404).send({ error: "Not found" })
  }

  db.users = otherUsers

  res.send(otherUsers)
})

app.listen(3000, () => console.log("Listening on :3000"))
