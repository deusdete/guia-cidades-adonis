const sharp = require('sharp')

async function getMetadata(fileName: string) {
  try {
    const metadata = await sharp(`./tmp/uploads/${fileName}`).metadata()
    return metadata
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`)
  }
}

export default getMetadata
