import express from "express"
import namor from "namor"
import { v4 as uuidv4 } from "uuid"
const PORT = process.env.PORT || 3680

const app = express()
app.use(express.json())

// TODO: Replace with DB
const store = {}

app.post("/api/group/create", (req, res) => {
	console.log("/api/group/create")

	// Convert "one-two-three" to "oneTwoThree"
	const _gid = namor.generate({ words: 3, saltLength: 0 }).split("-")
	const group = _gid.shift() + _gid.map((g) => g[0].toUpperCase() + g.slice(1)).join("")

	store[group] = {
		owner: res,
		clients: {}
	}

	console.log(`[/api/group/create] New group created: ${group}`)
	res.status(200).json({
		group,
		numberConnected: Object.keys(store[group].clients).length
	})
})

app.post("/api/group/join", (req, res) => {
	const { group } = req.body

	if (!(group in store)) {
		console.log(`[/api/group/join] Group not found: ${group}`)
		return res.status(500).json({ group: null })
	}

	const user = req.body.user || uuidv4()

	if (!([user] in store[group].clients)) {
		store[group].clients[user] = res
		console.log(`[/api/group/join] User added to group: ${group} (${Object.keys(store[group].clients).length} clients)`)
	} else {
		console.log(`[/api/group/join] User already in group: ${group} (${Object.keys(store[group].clients).length} clients)`)
	}

	res.status(200).json({ group, user })
})

app.get("*", (req, res) => {
	res.send("Backend")
})

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
