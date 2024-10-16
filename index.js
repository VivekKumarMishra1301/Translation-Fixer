const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const dbConnect=require('./config/db/dbConnect.js')
const blogFixerRoute=require('./routes/fixerRoute.js');
const blogMapperRoute=require('./routes/blogMapperRoute.js');



app.use(express.json());
app.use('/map',blogMapperRoute)
app.use('/fix-blog',blogFixerRoute);
async function startApp(){
    await dbConnect();
    app.listen(8000, () => {
            
        console.log(`Server is listening on port 8000`);
    })
}

startApp();