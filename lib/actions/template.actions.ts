"use server";

import Template, { TemplateType } from "../models/template.model";
import { connectToDB } from "../mongoose";

export async function createTemplate({ name, author, gitHubUrl, exampleUrl, uploads }: { name: string; author: string; gitHubUrl: string; exampleUrl: string; uploads: string[]; }): Promise<TemplateType>;

export async function createTemplate({ name, author, gitHubUrl, exampleUrl, uploads }: { name: string; author: string; gitHubUrl: string; exampleUrl: string; uploads: string[]; }, type: "json" ): Promise<string>;

export async function createTemplate({ name, author, gitHubUrl, exampleUrl, uploads }: { name: string; author: string; gitHubUrl: string; exampleUrl: string; uploads: string[]; }, type?: "json") {
    try {
        connectToDB();

        const template = await Template.create({
            name,
            author,
            gitHubUrl,
            exampleUrl,
            uploads
        });

        if (type === "json") {
            return JSON.stringify(template);
        } else {
            return template;
        }
    } catch (error: any) {
        throw new Error(`Error creating template: ${error.message}`);
    }
}

export async function fetchTemplates(): Promise<TemplateType[]>;
export async function fetchTemplates(type: 'json'): Promise<string>;

export async function fetchTemplates(type?: 'json') {
   try {

    const templates = await Template.find();


    if(type === 'json'){
      return JSON.stringify(templates)
    } else {
      return templates
    }
   } catch (error: any) {
     throw new Error(`Error fetching templates: ${error.message}`)
   }
}