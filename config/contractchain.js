const {BufferMemory} = require('langchain/memory');
const fs = require('fs')
const dotenv = require('dotenv');
const {SimpleSequentialChain, LLMChain} = require('langchain/chains');
const {OpenAI} = require('langchain/llms/openai');
const {PromptTemplate} = require('langchain/prompts');
const expressAsyncHandler = require('express-async-handler');

dotenv.config();

const querydata = expressAsyncHandler(async(question)=>{

	try{

		// This is an LLMChain to write a synopsis given a title of a play.
const llm = new OpenAI({openAIApiKey:process.env.OPENAI_KEY, temperature: 0 });
const template = `You are an agreement writting helper. You help when ask to draft agreement or contracts.
 Never answer questions like who is,
 locations questions, academic questions, people, voilant.
 Just say i dont. 
 Given the title of what is required, it is your job to draft an agreement.
  you have to refer to labor laws or contract regulations and laws you know when drafting the agreement.
   if you have Botswana or South africa contracts regulations and laws please refer to them first.
 
  Title: {title}
  helper: This is an agreement draft from the above title:`;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title"],
});
const synopsisChain = new LLMChain({ llm, prompt: promptTemplate });

// This is an LLMChain to write a review of a play given a synopsis.
const reviewLLM = new OpenAI({openAIApiKey:process.env.OPENAI_KEY, temperature: 0 });
const reviewTemplate = `You are an contract ellaborator, it is your job to write a more detail including subtitles for that agreement draft. 
   If the draft is not provided or the draft say something is,  I'm sorry, I don't understand the question. Please provide more information about what type of agreement you need help drafting.
   ,Just say I dont know.
 
  Agreement draft:
  {draft}
  Agreement draft from the above subtitle:`;
const reviewPromptTemplate = new PromptTemplate({
  template: reviewTemplate,
  inputVariables: ["draft"],
});
const reviewChain = new LLMChain({
  llm: reviewLLM,
  prompt: reviewPromptTemplate,
});

const overallChain = new SimpleSequentialChain({
  chains: [synopsisChain, reviewChain],
  verbose: true,
});
const review = await overallChain.run(question);
//console.log(review);

   return review;

	}catch(e){
		throw new Error(e);
	}

})

module.exports ={querydata};