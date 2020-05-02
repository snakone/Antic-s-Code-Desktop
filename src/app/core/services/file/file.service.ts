import { Injectable } from '@angular/core';
const FileSaver = require('file-saver');

@Injectable({providedIn: 'root'})

export class FileService {

  constructor() { }

  public saveFile(file: string, title: string, author: string): void {
    const blob = new Blob(
      [this.makeIntro(file, author)],
      {type: "text/plain;charset=utf-8"}
    );
    FileSaver.saveAs(blob, title);
  }

  private makeIntro(file: string, author: string): string {
    return `Archivo creado desde Antic\'s Code Desktop

${new Date()}

Creado por ${author}

${file}
    `;
  }
}
