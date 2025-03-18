"use server";

import Seller, { SellerType } from "../models/seller.model";
import { connectToDB } from "../mongoose";


export async function createSeller({ name, person, contactProductLink }: { name: string, person: string, contactProductLink?: string }): Promise<SellerType>;
export async function createSeller({ name, person, contactProductLink }: { name: string, person: string, contactProductLink?: string }, type: 'json'): Promise<string>;

export async function createSeller({ name, person, contactProductLink }: { name: string, person: string, contactProductLink?: string }, type?: 'json') {
   try {

    connectToDB();

    const seller = await Seller.create({
        name,
        status: "Запитали за товар",
        person,
        contactProductLink
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

export async function addChatUrl({ sellerId, chatUrl }: { sellerId: string, chatUrl: string }) {
  try {
    connectToDB();

    await Seller.findByIdAndUpdate(
        sellerId,
        {
            chatUrl
        }
    )
  } catch (error: any) {
    throw new Error(`Error adding chat url: ${error.message}`)
  }
}

export async function addContactProductLink({ sellerId, contactProductLink }: { sellerId: string, contactProductLink: string }) {
  try {
    connectToDB();

    await Seller.findByIdAndUpdate(
        sellerId,
        {
            contactProductLink
        }
    )
  } catch (error: any) {
    throw new Error(`Error adding contact product link: ${error.message}`)
  }
}

export async function addWebsiteUrl({ sellerId, websiteUrl }: { sellerId: string, websiteUrl: string }) {
  try {
    connectToDB();

    await Seller.findByIdAndUpdate(
        sellerId,
        {
            websiteUrl
        }
    )
  } catch (error: any) {
    throw new Error(`Error adding website url: ${error.message}`)
  }
}

export async function updateSeller(sellerId: string, updateData: Partial<SellerType>) {
  try {
    if (!sellerId) throw new Error("Seller ID is required for updating.");

    await connectToDB();

    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSeller) throw new Error("Seller not found.");

    // return updatedSeller;
  } catch (error: any) {
    throw new Error(`Failed to update seller: ${error.message}`);
  }
}

import fs from 'fs';
import path from 'path';

export async function createSellersJson() {
  try {
    connectToDB();

    const filePath = path.join("C:\\Users\\Користувач\\Desktop\\webdev\\rozetka_manager\\seller_messages.json");
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const sellers = JSON.parse(fileContent);

    // await Seller.create(sellers.map(s => ({...s, status: "Запитали за товар"})))

    await Seller.deleteMany({ person: "Vadim" });
  } catch (error: any) {
    throw new Error(`Error creating sellers from json: ${error.message}`)
  }
}
