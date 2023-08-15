const {OpenAIEmbeddings} = require('langchain/embeddings/openai');
const {RecursiveCharacterTextSplitter} = require('langchain/text_splitter');
const expressAsyncHandler = require('express-async-handler');
const {OpenAI} = require('langchain/llms/openai');
const {loadQAStuffChain} = require('langchain/chains');
const {Document} = require('langchain/document');


const updatePinecone = expressAsyncHandler(async(client, indexName, docs)=>{
    console.log("Retriving Pinecone index");
    //retrieve Pinecone index
    const index = client.Index(indexName);
    console.log(`Pinecone index is: ${index}`);
    //process each doc in array with for loop
    for(const doc of docs){
    //out the document metadata data
    console.log(`Processing document: ${doc.metadata.source}`);
    const textPath = doc.metadata.source;
    const text = doc.pageContent;
    //create recrusiveCharacterTextSplitter instance
     const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
     });
     console.log('Splitting text into chunks...')
     //split text into chunks
     const chunks = await textSplitter.createDocuments([text]);
     console.log(`Text split into ${chunks.length} chunks`);
     //Call openai embedding to embedde chunk into vectors
     const embeddingsArrays = await new OpenAIEmbeddings({}).embedDocuments(
        chunks.map((chunk)=>chunk.pageContent.replace(/\n/g, ""))
     );
     console.log("Finished embedding documents");
     //create and upsert vectors in batches of 100
     const batchSize = 100;
      let batch=[];
      for(let idx = 0; idx < chunks.length; idx++){
          const chunk = chunks[idx];
          const vector ={
            id: `${textPath}_${idx}`,
            values: embeddingsArrays[idx],
            metadata:{
                ...chunk.metadata,
                loc: JSON.stringify(chunk.metadata.loc),
                pageContent: chunk.pageContent,
                textPath: txtPath
            }
          }
          batch.push(vector);
          //when batch is full or it's the last item, upsert the vector
          if(batch.length === batchSize || idx === chunks.length-1){
            await index.upsert({
                upsertRequest:{
                    vectors: batch 
                }
            });
            batch=[];

          }
      }
      console.log(`Pinecone index update with ${chunks.length} vectors`);
       return true;
    }
    
});

const queryPinecone = expressAsyncHandler(async(client, indexName, question)=>{
    //start query process
    console.log('Querying Pinecone vector store...');
    const index = client.Index(indexName);
    //create the query embedding
    const queryEmbedding = await new OpenAIEmbeddings({openAIApiKey:process.env.OPENAI_KEY}).embedQuery(question);
    //query Pinecone index and return top best 10 matches
    let queryResponse = await index.query({
        queryRequest:{
            topK: 10,
            vector: queryEmbedding,
            includeMetadata:true,
            includeValues: true
        }
    });
    //log the number of matches 
    console.log(`Found: ${queryResponse.matches.length}`);
    //get the return reponses and pass them to openai llm
    if(queryResponse.matches.length){
     //create an openAI instance and load the QAStuffchain
      const llm = new OpenAI({openAIApiKey:process.env.OPENAI_KEY});
      const chain = loadQAStuffChain(llm);
      //Extract and concatenate page content from matched documents
      const concatenatePageContent = queryResponse.matches.map(
        (match)=>match.metadata.pageContent
      ).join(" ");
      //execute the chain with input documents and question
      const result = await chain.call({
        input_documents:[new Document({pageContent: concatenatePageContent})],
        question: question
      })
      console.log(`Answer: ${result.text}`)
      return {message: result.text};
    }else{
        console.log("No Answer");
        return {nothing: 'No answer'};
    }
})



module.exports = {updatePinecone, queryPinecone};