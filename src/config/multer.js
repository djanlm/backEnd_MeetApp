// yarn add multer was used to install multer that is used to upload files
import multer from 'multer';
import crypto from 'crypto'; // usada para gerar números aleatóreos
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // os uploads ficarão salvos na pasta tmp
    filename: (req, file, cb) => {
      // file contém todos os dados sobre o arquivo, nome, tamanho, etc
      // cb é a função de callback que deve ser chamada no final
      // cada arquivo de upload terá nome único
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err); // caso ocorrar erro, retorna erro
        // ex: jndjlsfksf445j.png
        return cb(null, res.toString('hex') + extname(file.originalname)); // concatena o nome único aleatório com a extensão original
      });
    },
  }),
};
