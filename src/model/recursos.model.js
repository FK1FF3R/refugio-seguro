export class Recurso {
  constructor({ id, titulo, url, tipo, descricao, publicoAlvo, idioma, tags }) {
    this.id = id;
    this.titulo = titulo;
    this.url = url;
    this.tipo = tipo;
    this.descricao = descricao;
    this.publicoAlvo = publicoAlvo;
    this.idioma = idioma;
    this.tags = tags;
  }
}
