"use server";

import Template, { TemplateType } from "../models/template.model";
import { connectToDB } from "../mongoose";

export async function createTemplate({ name, author, gitHubUrl, exampleUrl }: { name: string; author: string; gitHubUrl: string; exampleUrl?: string; }): Promise<TemplateType>;

export async function createTemplate({ name, author, gitHubUrl, exampleUrl }: { name: string; author: string; gitHubUrl: string; exampleUrl?: string; }, type: "json" ): Promise<string>;

export async function createTemplate({ name, author, gitHubUrl, exampleUrl}: { name: string; author: string; gitHubUrl: string; exampleUrl?: string; }, type?: "json") {
    try {
        connectToDB();

        const template = await Template.create({
        name,
        author,
        gitHubUrl,
        exampleUrl
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
