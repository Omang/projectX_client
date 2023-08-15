const expressAsyncHandler = require('express-async-handler');
const {PineconeClient} = require('@pinecone-database/pinecone');
const {DirectoryClient} = require('langchain/document_loaders/fs/directory');
const {TextLoader} = require('langchain/document_loaders/fs/text');
const {PDFLoader} = require('langchain/document_loaders/fs/pdf');
const {updatePinecone, queryPinecone} = require('../config/updatechain');
const {PromptTemplate} = require('langchain/prompts');

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
  //loading btc contacts, gabarone combi routes, companies docs
  const {userdata} = req.body;
  const prompt = PromptTemplate.fromTemplate(`You are a naming consultant for new companies.
  What is a good name for a company that makes {product}?`
  );
  
  const formattedPrompt = await prompt.format({
    product: `${userdata}`,
  });
  res.json(formattedPrompt);

});

const gptdaller = expressAsyncHandler(async(req, res)=>{
  //pictures from gpt daller api
})
const gptarticle = expressAsyncHandler(async(req, res)=>{
  //url from any web article using rapidapi to summerise
});

module.exports = {AiCall, gptschool, gptpublic, gptarticle, gptdaller};