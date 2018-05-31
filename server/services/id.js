const id = parseInt(process.argv[2])
        || process.env.SERVER_ID
        || Math.random().toString().slice(2)

module.exports = id
