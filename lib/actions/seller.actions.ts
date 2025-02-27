"use server";

import Seller, { SellerType } from "../models/seller.model";
import { connectToDB } from "../mongoose";


export async function createSeller({ name, person }: { name: string, person: string }): Promise<SellerType>;
export async function createSeller({ name, person }: { name: string, person: string }, type: 'json'): Promise<string>;

export async function createSeller({ name, person }: { name: string, person: string }, type?: 'json') {
   try {

    connectToDB();

    const seller = await Seller.create({
        name,
        status: "Запитали за товар",
        person,
    })

    if(type === 'json'){
      return JSON.stringify(seller)
    } else {
      return seller
    }
   } catch (error: any) {
     throw new Error(`Error creating sellers: ${error.message}`)
   }
}

export async function fetchSellers(): Promise<SellerType[]>;
export async function fetchSellers(type: 'json'): Promise<string>;

export async function fetchSellers(type?: 'json') {
   try {
    connectToDB();

    const sellers = await Seller.find();


    if(type === 'json'){
      return JSON.stringify(sellers)
    } else {
      return sellers
    }
   } catch (error: any) {
     throw new Error(`Error fetching sellers: ${error.message}`)
   }
}

export async function changeSellerStatus({ sellerId, newStatus }: { sellerId: string, newStatus: string }): Promise<void> {
  try {
    connectToDB();

    await Seller.findByIdAndUpdate(
        sellerId,
        {
            status: newStatus
        }
    )
  } catch (error: any) {
    throw new Error(`Erorr updating seller status: ${error.message}`)
  }
}

export async function changeSellerPerson({ sellerId, newPerson }: { sellerId: string, newPerson: string }) {
  try {
    connectToDB();

    await Seller.findByIdAndUpdate(
        sellerId, 
        {
            person: newPerson
        }
    )

  } catch (error: any) {
    throw new Error(`Error changing seller person${error.message}`)
  }
}