import express from "express";
import namor from "namor";
import { v4 as uuidv4 } from "uuid"
const PORT = process.env.PORT || 3680

const app = express()
app.use(express.json())

var store = {}

app.post("/api/group/create", (req, res) => {

  console.log("/api/group/create")
  let _gid = namor.generate({words: 3, saltLength: 0}).split("-")
  // NOTE: can probably simplify
  let group = _gid[0]
  for (let i=0; i<_gid.length; i++) {
    if (i>0) {
      group += _gid[i].replace(_gid[i][0], _gid[i][0].toUpperCase())
    }
  }

  store[group] = {
    owner: res,
    clients: {}
  }

  console.log(`[/api/group/create] New group created: ${group}`)
  res.status(200).json({ group })
  
})

app.post("/api/group/join", (req, res) => {

  const { group } = req.body
  if (!(group in store)) {
    console.log(`[/api/group/join] Group not found: ${group}`)
    return res.status(500).json({group: null})
  }

  let user = req.body.user || uuidv4()
  if (!([user] in store[group].clients)) {
    store[group].clients[user] = res
    console.log(`[/api/group/join] User added to group: ${group} (${Object.keys(store[group].clients).length} clients)`)
  } else {
    console.log(`[/api/group/join] User already in group: ${group} (${Object.keys(store[group].clients).length} clients)`)
  }

  res.status(200).json({ group, user })

})

app.get("*", (req, res) => {
  res.send("Backend");
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})