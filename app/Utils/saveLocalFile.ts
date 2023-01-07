import Application from '@ioc:Adonis/Core/Application'

type LocalFile = {
  name: string
  file: any
}

async function saveLocalFile({ name, file }: LocalFile) {
  try {
    const fileName = `${name}.${file.extname}`
    await file.move(Application.tmpPath('uploads'), {
      name: fileName,
    })

    const filePath = Application.tmpPath('uploads', fileName)

    return { fileName, filePath }
  } catch (error) {
    console.log(error)
    return { fileName: '', filePath: '' }
  }
}

export default saveLocalFile
