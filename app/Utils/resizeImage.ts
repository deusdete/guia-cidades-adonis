const sharp = require('sharp')

type RequestResize = {
  name: string
  filePath: any
  format: 'png' | 'jpeg'
  width: number
  height: number
}

async function resizeImage({
  name,
  filePath,
  format,
  width,
  height,
}: RequestResize) {
  try {
    const fileName = `${name}-resized.${format}`
    await sharp(filePath)
      .resize({
        width,
        height,
      })
      .toFile(`./tmp/uploads/${fileName}`)

    return fileName
  } catch (error) {
    console.log(error)
  }
}

export default resizeImage
