import mongoose, { InferSchemaType } from "mongoose";

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required for the Template"]
    },
    author: {
        type: String,
        required: [true, "Author is required for the Template"]
    },
    gitHubUrl: {
        type: String,
        required: [true, "GitHub url pesron name is required"]
    },
    exampleUrl: {
        type: String
    }
}, { timestamps: true });

type TemplateType = InferSchemaType<typeof templateSchema> & { _id: string };

const Template = mongoose.models.Template || mongoose.model("Template", templateSchema);

export default Template;

export type { TemplateType };
