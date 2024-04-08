export class CodeGenerator{
    private chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    generate(length:number){
        let result = "";
        for (let i = 0; i < length; i++) {
            result += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
        }
        return result;
    }
}