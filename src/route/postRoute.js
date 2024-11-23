import express from "express";
import multer from "multer";
import cors from "cors";
import { atualizarPost, uploadImagem, listarPostPorPalavra, listarPostPorID, listarPosts, criarNovoPost } from "../controller/postController.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ dest: "./uploads" , storage})

const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOptions));
    // diz qual é a função que tem que ser chamada quando a rota for solicitada
    app.get ("/posts", listarPosts);
    app.get ("/postid/:id", listarPostPorID);
    app.get ("/postsfinder/:palavra", listarPostPorPalavra);
    app.post("/posts", criarNovoPost);
    app.post("/upload", upload.single("imagem"), uploadImagem);
    app.put("/upload/:id", atualizarPost);
}

export default routes;
