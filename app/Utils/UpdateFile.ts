import { v4 as uuidv4 } from 'uuid'
interface Params {
  folder: string;
  subFolder: string | number | null;
  file: any
}

async function updadeFile({ folder, subFolder, file}: Params) {
  const fileName = `${uuidv4()}.${file.extname}`

  const destination = `${folder}/${subFolder ? subFolder + '/' : ''}`

  await file.moveToDisk(destination, {
    name: fileName
  })

  return {
    url: `https://guiacidades.s3.amazonaws.com/guiacidades/${destination}${fileName}`,
    fileName
  }
}

export default updadeFile
