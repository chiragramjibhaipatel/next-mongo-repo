import clientPromise from "../../lib/mongodb";

export default async function properties(req, res) {

    const client = await clientPromise;
    const collection = await client.db().collection("listingsAndReviews")
    let data = await collection.find({}).limit(1).toArray()
    res.json(data)
};