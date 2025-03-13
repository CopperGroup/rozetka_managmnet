import mongoose, { InferSchemaType } from "mongoose";

const tokenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required for the Token"]
    },
    key: {
        type: String,
        required: [true, "Key is required for the Token"]
    },
    usage: {
        type: Number
    }
}, { timestamps: true });

type TokenType = InferSchemaType<typeof tokenSchema> & { _id: string };

const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

export default Token;

export type { TokenType };
