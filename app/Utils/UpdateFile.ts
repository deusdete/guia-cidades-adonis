import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  keyFile: path.resolve(Env.get('GOOGLE_APPLICATION_CREDENTIALS'))
});

const bucket = storage.bucket('guia_cidades');

interface Params {
  folder: string;
  subFolder: string | number | null;
  file: any
}

async function updadeFile({ folder, subFolder, file}: Params) {
  const fileName = `${uuidv4()}.${file.extname}`
  await file.move(Application.tmpPath('uploads'), {
    name: fileName,
  })

  const tmpPathFile = Application.tmpPath('uploads', fileName)

  const destination = `${folder}/${subFolder ? subFolder + '/' + fileName : fileName}`

  const options = {
    destination: destination,
    public: true,
  };

  await bucket.upload(tmpPathFile, options)

  try {
    fs.unlinkSync(tmpPathFile)
    console.log('Arquivo removido')
  } catch (err) {
    console.error('unlinkSync', err)
  }

  return {
    url: `https://storage.googleapis.com/guia_cidades/${options.destination}`,
    fileName
  }
}

export default updadeFile
