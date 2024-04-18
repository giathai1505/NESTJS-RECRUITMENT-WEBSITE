import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';

const PUBLIC_FOLDER_URL = 'public/images/';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath() {
    return process.cwd();
  }

  ensureFolderExist = (targetDirectory: string) => {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log(`Create ${targetDirectory} folder successfully!`);
        return;
      }
      //TO-DO: handle when create image error
      console.log('=======');
      console.log('Create folder error: ', error);
    });
  };
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
          const folder = req?.headers?.store_folder ?? 'default';
          this.ensureFolderExist(`${PUBLIC_FOLDER_URL + folder}`);
          cb(null, join(this.getRootPath(), `${PUBLIC_FOLDER_URL + folder}`));
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
          let extension = path.extname(file.originalname);
          let baseName = path.basename(file.originalname, extension);
          let finalName = `${baseName}-${Date.now().toString()}${extension}`;
          cb(null, finalName);
        },
      }),
    };
  }
}
