export class ONG {
  constructor({
    id,
    nome,
    missao,
    contatos = { telefone: '', email: '' },
    areaAtuacao = [],
    redesSociais = { site: '', facebook: '', instagram: '' }
  }) {
    this.id = id;
    this.nome = nome;
    this.missao = missao;
    this.contatos = contatos;
    this.areaAtuacao = Array.isArray(areaAtuacao) ? areaAtuacao : [areaAtuacao];
    this.redesSociais = redesSociais;
  }
}
