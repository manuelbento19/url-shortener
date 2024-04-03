
import dns from 'dns';
import util from 'util'

const lookup = util.promisify(dns.lookup)

export class URLValidator {
    constructor(){}

    valid(url:string){
        return URL.canParse(url)
    }
    async checkNetwork(url:string){
        const {hostname} = new URL(url)
        const result = await lookup(hostname)
        return result
    }
}