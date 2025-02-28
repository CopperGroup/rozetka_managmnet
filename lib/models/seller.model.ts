import mongoose, { InferSchemaType } from "mongoose";

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required for the seller"]
    },
    status: {
        type: String,
        required: [true, "Status is required for the seller"]
    },
    person: {
        type: String,
        required: [true, "Conatcint pesron name is required"]
    },
    chatUrl: {
        type: String
    }
}, { timestamps: true });

type SellerType = InferSchemaType<typeof sellerSchema> & { _id: string };

const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;

export type { SellerType };
