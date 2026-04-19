import Fuse from 'fuse.js'
import { readFileSync } from 'fs'

// Get JSON file path from command-line argument
const jsonFilePath = process.argv[2]

if (!jsonFilePath) {
  console.error('Please provide a JSON file path as an argument')
  console.error('Usage: node fuse-test-dynamic.js "<json-file-path>" "<search term>"')
  process.exit(1)
}

// Read and parse the provided JSON file
let docLinks
try {
  docLinks = JSON.parse(readFileSync(jsonFilePath, 'utf-8'))
} catch (error) {
  console.error(`Error reading or parsing JSON file: ${error.message}`)
  process.exit(1)
}

const fuse = new Fuse(docLinks, {
  keys: ['heading']
})

// Get search query from second argument
const searchQuery = process.argv[3]

if (!searchQuery) {
  console.error('Please provide a search query as an argument')
  console.error('Usage: node fuse-test-dynamic.js "<json-file-path>" "<search term>"')
  process.exit(1)
}

const results = fuse.search(searchQuery, { limit: 5 })
console.log(results);
