// import { ChatDeepSeek } from '@langchain/deepseek'
// import { appConfigs } from '../configs'

// const llm = new ChatDeepSeek({
//   model: 'deepseek-reasoner',
//   temperature: 0,
//   apiKey: appConfigs?.llm?.deepSeekAPiKey
// })

// const aiMsg = async () => {
//   await llm.invoke([
//     [
//       'system',
//       'You are a helpful assistant that translates English to French. Translate the user sentence.'
//     ],
//     ['human', 'I love programming.']
//   ])
// }

// console.log(aiMsg())

// import { ChatOpenAI } from '@langchain/openai'
// import { appConfigs } from '../configs'

// const llm = new ChatOpenAI({
//   model: 'gpt-4o',
//   temperature: 0,
//   apiKey: appConfigs?.llm?.openAIApiKey
// })

// const aiMsg = async () => {
//   const result = await llm.invoke([
//     {
//       role: 'system',
//       content:
//         'You are a helpful assistant that translates English to French. Translate the user sentence.'
//     },
//     {
//       role: 'user',
//       content: 'I love programming.'
//     }
//   ])

//   console.log(result.content)
// }

// aiMsg()

import { createAgent, tool } from 'langchain'
import { ChatOpenAI } from '@langchain/openai'

import * as z from 'zod'
import { appConfigs } from '../configs'

const aiAgentTest = async () => {
  const getWeather = tool((input) => `It's always sunny in ${input.city}!`, {
    name: 'get_weather',
    description: 'Get the weather for a given city',
    schema: z.object({
      city: z.string().describe('The city to get the weather for')
    })
  })

  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0.1,
    maxTokens: 1000,
    // timeout: 30,
    apiKey: appConfigs?.llm?.openAIApiKey
  })

  const agent = createAgent({
    model,
    tools: [getWeather]
  })

  console.log(
    await agent.invoke({
      messages: [{ role: 'user', content: "What's the weather in Jakarta?" }]
    })
  )
}

aiAgentTest()
