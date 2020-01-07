const express = require('express')
const compression = require('compression')

const app = express()

app.use(compression())
app.use(express.static('./dist'))

app.listen(9090, () => {
	console.log('服务开始启动')
})