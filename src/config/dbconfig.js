import { MongoClient } from 'mongodb';

/**
 * Conecta-se ao banco de dados MongoDB e retorna um cliente para interação.
 *
 * @param {string} stringConexao A string de conexão com o banco de dados MongoDB.
 * @returns {MongoClient} Um cliente MongoDB conectado.
 */
export default async function conectarAoBanco(stringConexao) {
  let mongoClient;

  try {
    // Cria um novo cliente MongoDB
    mongoClient = new MongoClient(stringConexao);
    // Tenta estabelecer a conexão com o banco de dados
    console.log('Conectando ao cluster do banco de dados...');
    await mongoClient.connect();
    console.log('Conectado ao MongoDB Atlas com sucesso!');
    return mongoClient;
  } catch (error) {
    // Fecha a conexão com o banco de dados, mesmo em caso de erro
    if (mongoClient) {
        await mongoClient.close();
        console.log('Conexão com o MongoDB encerrada.');
    }
    // Caso ocorra um erro, imprime detalhes do erro e encerra o processo
    console.error(`Falha na conexão com o banco! Erro: ${error.message}`);
    console.error('Código do erro:', error.code);
    process.exit(1);
  } // finally {}
}

/*
    Considerações Adicionais:
    Configurações Ambientais: Em um ambiente de produção, é recomendado usar variáveis de ambiente para armazenar a string de conexão, evitando hardcoding.
    Pool de Conexões: Para aplicações com alto tráfego, considere utilizar um pool de conexões para otimizar o uso de recursos.
    Mongoose: Se você precisar de uma interface mais orientada a objetos para interagir com o MongoDB, pode utilizar o Mongoose.
    Com essas melhorias, o código fica mais robusto, fácil de entender e manter. Lembre-se: a qualidade do código não se limita apenas a funcionalidade, mas também à sua legibilidade e manutenibilidade.
'*/