/**
 * Optional script to seed the Pinecone index for RAG.
 * Run: npx tsx src/script/ingestWeaviate.ts
 *
 * Set PINECONE_API_KEY, PINECONE_INDEX_NAME and OPENAI_API_KEY in .env.
 */
import { pineconeService } from '../services/PineconeService'

const sampleDocs = [
  {
    content:
      'Bitcoin is a decentralized digital currency that uses cryptography for security. It was created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto.',
    source: 'crypto-basics'
  },
  {
    content:
      'Ethereum is a blockchain platform that supports smart contracts and decentralized applications (dApps). Its native token is ETH.',
    source: 'crypto-basics'
  },
  {
    content:
      'Risk management in trading includes position sizing, stop-loss orders, and diversification. Never invest more than you can afford to lose.',
    source: 'trading-tips'
  }
]

async function main() {
  await pineconeService.addDocuments(sampleDocs)
  console.log('Ingestion complete. Added', sampleDocs.length, 'chunks to Pinecone.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Ingestion failed:', err)
  process.exit(1)
})
