import fastify from 'fastify';
import cors from '@fastify/cors';
import { URLValidator } from './util/url';
import { client } from './database/db';

const app = fastify()
app.register(cors)

const urlValidator = new URLValidator();

app.get("/:code",async(request,response)=>{
    const {code} = request.params;
    if(!code)
    return {
        error: "Code doesn't exists"
    }

    const urlExist = await client.query(`select * from Shortner where code=='${code}'`);
    console.log(urlExist);

    const url = "https://www.google.com"
    return response.redirect(301,url)
})

app.post("/",async(request,response)=>{
    const {url} = request.body
    if(!urlValidator.valid(url))
    return {
        error: "Invalid url"
    }

    try{
        const urlExist = await client.query(`select * from Shortner where url=='${url}'`);
        console.log(urlExist);
        //await urlValidator.checkNetwork(url)
        return response.send({message:"Good"})
    }
    catch{
        return {
            error: "Unactive host"
        }
    }
})

app.listen({port: 3000},(error)=> console.log("Listen on http://localhost:3000"))