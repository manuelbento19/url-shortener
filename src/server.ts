import fastify from 'fastify';
import cors from '@fastify/cors';
import crypto from 'crypto';
import { URLValidator } from './util/url';
import { client } from './database/db';
import { CodeGenerator } from './util/code';
import { RequestDTO } from './types';
import { AppError } from './util/appError';

const urlValidator = new URLValidator();
const codeGen = new CodeGenerator()

const app = fastify()
app.register(cors)

app.get("/:code",async(request,response)=>{
    try {
        const {code} = request.params as RequestDTO;
        if(!code) throw new AppError("Code required")

        const {rows} = await client.query(`select * from shortner where code='${code}'`);
        if(rows.length==0)
        throw new AppError("Code doesn't exists")
        
        return response.redirect(301,rows[0].url)
    } 
    catch(error) {
        if(error instanceof AppError)
        return response.send(error.message)

        console.error("Api",error)
        return response.send({
            error: "Error while running the api"
        })
    }
})

app.post("/",async(request,response)=>{
    const {url} = request.body as RequestDTO
    if(!urlValidator.valid(url))
    return {
        error: "Invalid url"
    }

    try{
        const {rows} = await client.query("select * from shortner where url=$1",[url]);
        if(rows.length>0)
        return response.send({code: rows[0].code})
        
        await urlValidator.checkNetwork(url)
        
        const code = codeGen.generate(10);
        await client.query("INSERT INTO shortner(url,code) VALUES($1,$2)",[url,code])
        return response.send({code})
    }
    catch(error){
        console.error("Database",error)
        return response.send({
            error: "Unactive host"
        })
    }
})

app.listen({port: 3000},()=> console.log("Listen on http://localhost:3000"))


  