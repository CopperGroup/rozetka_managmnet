"use server"

import Token, { TokenType } from "../models/token.model"


export async function createToken({ name, key }: { name: string, key: string }): Promise<TokenType>;
export async function createToken({ name, key }: { name: string, key: string }, type: 'json'): Promise<string>;

export async function createToken({ name, key }: { name: string, key: string }, type?: 'json') {
   try {

    const token = await Token.create({
        name,
        key,
        usage: 1
    })

    if(type === 'json'){
      return JSON.stringify(token)
    } else {
      return token
    }
   } catch (error: any) {
     throw new Error(`Erorr creating token: ${error.message}`)
   }
}