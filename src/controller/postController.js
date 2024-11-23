import fs  from "fs";  // Biblioteca que cuida da gestão do FileSystem
import Joi from "joi"; // Biblioteca de validação
import { updatePost, addNewPost, findAllPosts, findOnePostByID, filterPostsBySubstring } from "../model/postModel.js";
import gerarDescricaoComGemini from "../service/geminiService.js";

// Esquema de validação para novos posts
const postSchema = Joi.object({
    descricao: Joi.string().required(),
    imgUrl: Joi.string().uri(), // Verificar se é uma URL válida
    imgAlt: Joi.string()
  });

export async function listarPosts (req,res) {
    const posts = await findAllPosts();
    res.status(200).json(posts);
}

export async function listarPostPorID (req,res) {
    const post = await findOnePostByID(req.params.id);
    res.status(200).json(post);
}

export async function listarPostPorPalavra (req,res) {
    const posts = await filterPostsBySubstring(req.params.palavra);

    console.log("--- listarPostPorPalavra");
    //console.log(posts);
    console.log("---");

    res.status(200).json(posts);
}

/**
 * Cria um novo post.
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 * @returns {Promise<void>} Uma promessa que resolve quando a operação é concluída.
 */
export async function criarNovoPost (req,res) {
    console.log("--- criarNovoPost");
    console.log(req.body);
    console.log("---");
    console.log("--- 1/4");
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const novoPost = value; // conteúdo

    console.log("--- 2/4");

    try {
        console.log("--- 3/4");
        const postCriado = await addNewPost(novoPost);
        console.log("--- 4/4");
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha da requisição."});
    }
}

export async function uploadImagem(req, res) {
    // TODO:... validação do arquivo
    const novoPost = {
        descricao: "",
        imgOriginalFileName: req.file.originalname,
        imgAlt: ""
    };

    try {
        const postCriado = await addNewPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

/**
 * Atualiza um novo post.
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 * @returns {Promise<void>} Uma promessa que resolve quando a operação é concluída.
 */
export async function atualizarPost (req,res) {
    console.log("--- atualizarPost");
    const id = req.params.id;
    const urlImg = `http://localhost:3000/${id}.png`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricaoAI = await gerarDescricaoComGemini(imgBuffer);

        const updtPost = {
            imgUrl: urlImg,
            descricao: descricaoAI, // req.body.descricao,
            imgAlt: req.body.imgAlt
        }
        const { error, value } = postSchema.validate(updtPost);
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
        const novoPost = value; // conteúdo



        const postAtualizado = await updatePost( id, updtPost );
        res.status(200).json(postAtualizado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha da requisição."});
    }
}

/*
 * Considerações Adicionais:
 * Cache: Se você estiver trabalhando com um grande número de posts, considere implementar um cache para melhorar o desempenho das consultas.
 * Autenticação e Autorização: Implemente mecanismos de autenticação e autorização para garantir que apenas usuários autorizados possam criar, editar e excluir posts.
 * Tratamento de Erros de Banco de Dados: Capture erros específicos do banco de dados e forneça mensagens de erro mais detalhadas.
 * Testes: Escreva testes unitários para garantir a qualidade do código e detectar possíveis problemas.
 * Upload de Imagem: Verifique se o arquivo enviado é realmente uma imagem e se ele possui um tamanho e formato permitidos.
 * Mensagens de Erro Mais Informativas: Ao retornar um erro, forneça mensagens mais específicas para ajudar na depuração, como "Post não encontrado" ou "Erro ao salvar imagem".
 * Logs: Registre erros em um log para análise posterior. Utilize uma biblioteca de logging como o winston para personalizar os logs.
 * Segurança: 
 * Limitação de Tamanho de Arquivo: Limite o tamanho máximo dos arquivos enviados para evitar ataques de upload de arquivos grandes.
 * Validação de Nomes de Arquivos: Verifique se os nomes de arquivos não contêm caracteres especiais que possam ser usados para injeção de código.
 * Logs: Registre erros em um log para análise posterior. Utilize uma biblioteca de logging como o winston para personalizar os logs.
 */
