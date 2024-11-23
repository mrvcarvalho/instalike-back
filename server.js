import express from "express";
import routes from "./src/route/postRoute.js";

const app = express();
app.use(express.static("uploads"));
routes(app);

app.listen(3000,()=> {
    console.log("Servidor escutando...");
});

/*
const posts = [
    {
      id: 1,
      descricao: "Uma foto de gato teste",
      imagem: "https://placecats.com/millie/300/150"
    },
    {
      id: 2,
      descricao: "Paisagem de gato deslumbrante",
      imagem: "https://placecats.com/millie/300/150"
    },
    {
      id: 3,
      descricao: "Cachorro fofo",
      imagem: "https://placecats.com/millie/300/150"
    },
    {
      id: 4,
      descricao: "Cachorro Receita deliciosa",
      imagem: "https://placecats.com/millie/300/150"
    },
    {
      id: 5,
      descricao: "Cachorro Gráfico de vendas",
      imagem: "https://placecats.com/millie/300/150"
    },
    {
      id: 6,
      descricao: "Foto divertida gato",
      imagem: "https://placecats.com/millie/300/151"
    }
  ];
*/