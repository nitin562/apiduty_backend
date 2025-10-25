import { model } from "mongoose"

export function generateClientId(prefix){
    const timestamp = Date.now().toString()

    let randomNumber = Math.random()*100000
    randomNumber = randomNumber.toFixed(0)

    const clientId = `${prefix}-${timestamp}-${randomNumber}`
    return clientId
}


export function createModel(name, schema){
    schema.add({
        clientId: {
            type: String,
            required: true,
            default: ()=>generateClientId(name),
            unique: true
        }
    })

    const modelCreated = model(name, schema)
    return modelCreated
}
