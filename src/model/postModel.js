import 'dotenv/config';
import { ObjectId } from 'mongodb';
import conectarAoBanco from "../config/dbconfig.js";

const conexao = await conectarAoBanco (process.env.STRING_CONEXAO);

/**
 * Finds all posts in the 'posts' collection.
 * @returns {Promise<Array>} An array of posts.
 */
export async function findAllPosts() {
    const db = conexao.db("imersao-instabytes");
    const collection = db.collection("posts");

    try {
        const posts = await collection.find().toArray();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; // Re-throw the error to be handled by the calling function
    }
}

export async function findOnePostByID(paramID) {
    //const db = conexao.db("imersao-instabytes");
    //const result = db.collection("posts").findOne( new ObjectId(paramID) );
    //return result;

    const db = conexao.db("imersao-instabytes");
    const collection = db.collection("posts");
    
    try {
        const result = await collection.findOne( new ObjectId(paramID) );
        return result;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
}

export async function filterPostsBySubstring(paramPalavra) {
    //const db = conexao.db("imersao-instabytes");
    //const collection = db.collection("posts");
    //const filter = { descricao: { $regex: paramPalavra, $options: 'i' } };  // { descricao: paramPalavra };
    //const result = await collection.find(filter).toArray();
    //return result;

    console.log("--- filterPostsBySubstring");
    const db = conexao.db("imersao-instabytes");
    const collection = db.collection("posts");

    try {
        const filter = { descricao: { $regex: paramPalavra, $options: 'i' } };  // { descricao: paramPalavra };
        const result = await collection.find(filter).toArray();
        return result;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export async function addNewPost(paramNovoPost) {
    const db = conexao.db("imersao-instabytes");
    const collection = db.collection("posts");
    try {
        const result = await collection.insertOne(paramNovoPost);
        return result;
    } catch (error) {
        console.error('Error adding new post:', error);
        throw error;
    }
}

export async function updatePost(paramIdPost, paramConteudo) {
    console.log("--- updatePost");

    const db = conexao.db("imersao-instabytes");
    const collection = db.collection("posts");
    const objID = ObjectId.createFromHexString(paramIdPost);
    try {
        const result = await collection.updateOne({_id: new ObjectId (objID)}, {$set:paramConteudo});
        return result;
    } catch (error) {
        console.error('Error updating a post:', error);
        throw error;
    }
}
