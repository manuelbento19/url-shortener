import fastify from 'fastify';
import cors from '@fastify/cors';
import crypto from 'crypto';
import { URLValidator } from './util/url';
import { client } from './database/db';
import { CodeGenerator } from './util/code';
import { RequestDTO } from './types';

const urlValidator = new URLValidator();
const codeGen = new CodeGenerator()

const app = fastify()
app.register(cors)

app.get("/:code",async(request,response)=>{
    const {code} = request.params as RequestDTO;
    if(!code)
    return {
        error: "Code required"
    }

    try {
        const {rows} = await client.query(`select * from shortner where code='${code}'`);
        if(rows.length==0)
            throw Error("Code doesn't exists")
        return response.redirect(301,rows[0].url)
    } 
    catch {
        return response.send({
            error: "Code doesn't exists"
        })
    }
    
    
    return 
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

app.listen({port: 3000},(error)=> console.log("Listen on http://localhost:3000"))


  