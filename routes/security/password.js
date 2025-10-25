import bcrypt from "bcryptjs";

export class PasswordByBcrypt{
    static async #getSalt(){
        const salt = await bcrypt.genSalt()
        return salt
    }

    static async hashify(password){
        const salt = await this.#getSalt()
        return await bcrypt.hash(password, salt)
    }

    static async matchify(password, hashPassowrd){
        return await bcrypt.compare(password, hashPassowrd)
    }
}
