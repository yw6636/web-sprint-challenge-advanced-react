const server = require('./backend/server')

const PORT = process.env.PORT || 8500

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
