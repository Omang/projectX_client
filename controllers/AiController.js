const expressAsyncHandler = require('express-async-handler');
const {PineconeClient} = require('@pinecone-database/pinecone');
const {DirectoryClient} = require('langchain/document_loaders/fs/directory');
const {TextLoader} = require('langchain/document_loaders/fs/text');
const {PDFLoader} = require('langchain/document_loaders/fs/pdf');
const {updatePinecone, queryPinecone} = require('../config/updatechain');
const {PromptTemplate} = require('langchain/prompts');
const { Configuration, OpenAIApi } = require("openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { SerpAPI } = require("langchain/tools");
const { Calculator } = require("langchain/tools/calculator");




const runtest = async (req, res) => {
  const {xman} = req.body;
  process.env.LANGCHAIN_HANDLER = "langchain";
   const configuration = new Configuration({
    organization: process.env.ORGANISATION,
    apiKey: process.env.OPENAI_KEY,
   });

  //const openai = new OpenAIApi(configuration);
  const model = new ChatOpenAI({openAIApiKey:process.env.OPENAI_KEY, temperature: 0 });
  const tools = [
    new SerpAPI(process.env.SERPAPI, {
      location: "Austin,Texas,United States",
      hl: "en",
      gl: "bw",
    }),
    new Calculator(),
  ];

  // Passing "chat-conversational-react-description" as the agent type
  // automatically creates and uses BufferMemory with the executor.
  // If you would like to override this, you can pass in a custom
  // memory option, but the memoryKey set on it must be "chat_history".
  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "chat-conversational-react-description",
    verbose: true,
  });
  console.log("Loaded agent.");

  const input0 = "hi, i am bob";

  const result0 = await executor.call({ input: input0 });

  console.log(`Got output ${result0.output}`);

  const input1 = "whats my name?";

  const result1 = await executor.call({ input: input1 });

  console.log(`Got output ${result1.output}`);

  const input2 = "whats the weather in Gaborone?";

  const result2 = await executor.call({ input: input2 });

  console.log(`Got output ${result2.output}`);
  res.json(result2.output);
};

const AiCall = async(req, res)=>{
   res.json({message: 'reporting live from the controller'})
};
const gptschool = expressAsyncHandler(async(req, res)=>{
   //loading primary, secondary, senior schools revision materials
  // const loader = new DirectoryClient("/documents",{
  //  ".text": (path)=>new TextLoader(path),
  //  ".pdf": (path)=> PDFLoader(path)
 //  });
  // const docs = await loader.load();
   //set up variables for the filename, question and index
   const indexName = "langchainjsindex";
   //const vectorDimension = "1536";
   const {question} = req.body;
  
   //intialize Pinecone client with api key and enviroment
   const client = new PineconeClient();
   await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
   });
  try {
    
      const askResponse = await queryPinecone(client, indexName, question);
            console.log(askResponse);
            res.json(askResponse);
     
  } catch (error) {

    console.log(error);
    
  }
});

const gptpublic = expressAsyncHandler(async(req, res)=>{
  //loading public information gpt llm knowledge base
  const configuration = new Configuration({
    organization: process.env.ORGANISATION,
    apiKey: process.env.OPENAI_KEY,
   });

  const openai = new OpenAIApi(configuration);
     const {datax} = req.body;

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages:
             [{"role": "system",
             "content": "You are a Botswana helpful assistant. Answer questions with botswana information only. if answer is not available, just say im sorry i only have information about Botswana only. Don't answer explicity, violate, sexual, gender based, children abuse and racism questions. if someone ask explicity or violate or sexual or gender based or children abuse or racism questions, warn them by saying, please dont try this again or i will capture your face screenshot and share with the nearest Police"},
              {role: "user", content: `${datax}`}],
   });
  
     
     
 //console.log(datax);
res.json({
  message: completion.data.choices[0].message
});

});

const gptdaller = expressAsyncHandler(async(req, res)=>{
  //pictures from gpt daller api
})
const gptarticle = expressAsyncHandler(async(req, res)=>{
  //url from any web article using rapidapi to summerise
});
const gptcontacts = expressAsyncHandler(async(req, res)=>{
   //loading primary, secondary, senior schools revision materials
  // const loader = new DirectoryClient("/documents",{
  //  ".text": (path)=>new TextLoader(path),
  //  ".pdf": (path)=> PDFLoader(path)
 //  });
  // const docs = await loader.load();
   //set up variables for the filename, question and index
   const indexName = "langchainjsindex";
   //const vectorDimension = "1536";
   const {question} = req.body;
  
   //intialize Pinecone client with api key and enviroment
   const client = new PineconeClient();
   await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
   });
  try {
    
      const askResponse = await queryPinecone(client, indexName, question);
            console.log(askResponse);
            res.json(askResponse);
     
  } catch (error) {

    console.log(error);
    
  }
});

module.exports = {runtest, AiCall, gptschool, gptpublic, gptarticle, gptdaller, gptcontacts};