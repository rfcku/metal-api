
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI || '';
const dbName = 'metal';
const collectionName = 'bands';

export async function GET(req: NextRequest) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const search = req.nextUrl.searchParams.get('search') || '';
    const startsWith = req.nextUrl.searchParams.get('startsWith');


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = {};
    if (startsWith) {
      query = { name: { $regex: `^${startsWith}`, $options: 'i' } };
    } else if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }

    const items = await collection.find(query).skip(skip).limit(limit).toArray();
    const total = await collection.countDocuments(query);
    await client.close();
    return NextResponse.json({ items, total });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
