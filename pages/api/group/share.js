import namor from "namor"

var store = {}

export default function handler(req, res) {
  let id = namor.generate({words: 3, saltLength: 0})
  store[id] = [res]
  res.status(200).json({ id })
}
