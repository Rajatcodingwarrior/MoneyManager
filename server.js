const express = require('express')
const dbConnect = require('./backend/config/dbConnect.js')
const app = express()
app.use(express.json())
const path = require('path')
const userRoute = require('./backend/routes/userRoutes.js')
const transactionsRoute = require('./backend/routes/transactionRoutes.js')
app.use('/api/users/' , userRoute)
app.use('/api/transactions/' , transactionsRoute)

const port =process.env.PORT || 5000

if(process.env.NODE_ENV === 'production')
{
     app.use('/' , express.static('client/build'))

     app.get('*' , (req, res)=>{
         res.sendFile(path.resolve(__dirname, 'client/build/index.html'))
     })
}



app.listen(port, () => console.log(`Node JS Server started at port ${port}!`))