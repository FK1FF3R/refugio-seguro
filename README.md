# Refúgio Seguro - API RESTful

## 📌 Problema

Pessoas em situação de vulnerabilidade — como mulheres, pessoas LGBTQIAPN+, refugiados, imigrantes, crianças, idosos e outros grupos marginalizados — frequentemente enfrentam barreiras para acessar direitos básicos, como abrigo, apoio jurídico, capacitação profissional e informações seguras. Em muitos casos, essas pessoas não sabem onde buscar ajuda ou como encontrar organizações confiáveis que possam acolhê-las.

---

## 💡 Solução

A API **Refúgio Seguro** surge como uma ponte entre essas pessoas e os recursos de acolhimento e apoio disponíveis. O sistema visa facilitar o acesso a:

- Abrigos temporários e permanentes
- Apoio jurídico e psicológico
- ONGs e redes de proteção
- Cursos de capacitação profissional
- Informações confiáveis sobre seus direitos

A API oferece um ponto centralizado de informações, acessível para todos.

---

## ⚙️ Processo de elaboração da solução

1. **Levantamento do problema**: Compreensão das dificuldades enfrentadas por pessoas vulneráveis ao buscar ajuda.
2. **Definição do escopo**: Desenvolvimento de uma API modular, extensível e clara.
3. **Modelagem de dados**: Representação de abrigos, instituições de apoio, serviços oferecidos e perfis de usuários.
4. **Arquitetura e estrutura**: Implementação baseada em MVC, com foco em organização e manutenção.
5. **Implementação técnica**: Uso de `Node.js` e `Express.js` para construir uma API RESTful com rotas seguras, filtros úteis e middlewares personalizados.

---

## 🛠️ Utilidade do Sistema

O sistema pode ser utilizado por:

- Pessoas em situação de vulnerabilidade, através de apps e plataformas que consumam esta API.
- ONGs e redes de apoio que desejam compartilhar seus serviços.

---

## 📁 Organização de Pastas

A estrutura do projeto segue o padrão MVC e está assim organizada:

```
src/
├── controller/     
├── data/           
├── logs/           
├── middleware/     
├── model/          
├── routes/         
└── server.js       
```

---

## 🔁 Rotas e Filtros

### 📌 `GET /abrigos`

Este endpoint retorna uma lista de abrigos com suporte a diversos filtros para facilitar buscas personalizadas. A listagem é lida a partir de um arquivo JSON, e os dados são mapeados para objetos.

#### ✅ Filtros disponíveis:

| Parâmetro       | Descrição                                                                 |
|----------------|---------------------------------------------------------------------------|
| `estado`        | Filtra abrigos por estado (ex: `SP`, `RJ`)                               |
| `cidade`        | Filtra por cidade, mesmo com acentuação diferente (ex: `São Paulo`)      |
| `publico`       | Filtra por público atendido (ex: `mulheres`, `LGBTQIA+`, `refugiados`)       |
| `tipo`          | Tipo de abrigo (ex: `temporário`, `social`, `infantil`)         |
| `capacidade`    | Exibe apenas abrigos com **capacidade igual ou superior** ao informado   |

---

### 📌 `POST /abrigos`

Este endpoint cadastra um novo abrigo. O abrigo é validado, recebe um ID, e é salvo.

#### 🔐 Campos obrigatórios no `body` da requisição:

| Campo       | Descrição                                            |
|-------------|------------------------------------------------------|
| `nome`      | Nome do abrigo                                       |
| `publico`   | Público-alvo (ex: mulheres, refugiados, LGBTQIAPN+)  |
| `estado`    | Estado onde o abrigo está localizado                 |
| `tipo`      | Tipo de abrigo (temporário, institucional, etc.)     |
| `capacidade`| Quantidade máxima de pessoas                         |

---

### 📌 `GET /apoiojuridico`

Este endpoint retorna uma lista de serviços de apoio jurídico com diversos filtros de busca. Os dados são lidos de um arquivo JSON e mapeados para objetos.

#### ✅ Filtros disponíveis:

| Parâmetro       | Descrição                                                                 |
|----------------|---------------------------------------------------------------------------|
| `estado`       | Filtra por estado (ex: `SP`, `RJ`)                    |
| `cidade`       | Filtra por cidade, mesmo com acentuação diferente (ex: `Niterói`)        |
| `tipoServico`  | Filtra por área jurídica                                                 |
| `disponivel`   | Filtra por disponibilidade (`true` ou `false`)                           |
| `nome`         | Busca parcial por nome do serviço/escritório                             |

---

### 📌 `POST /apoiojuridico`

Este endpoint cadastra um novo serviço de apoio jurídico. O serviço é validado, recebe um ID único gerado via `uuidv4`, e é salvo no arquivo `apoioJuridico.json`.

#### 🔐 Campos obrigatórios no `body` da requisição:

| Campo         | Descrição                                |
|--------------|------------------------------------------|
| `nome`       | Nome do serviço/escritório              |
| `estado`     | Estado de atuação                       |
| `cidade`     | Cidade de atuação                       |
| `tipoServico`| Área de atuação jurídica                |

---

### 📌 `GET /faq`

Este endpoint retorna a lista completa de FAQs (Perguntas Frequentes) cadastradas no sistema. Os dados são lidos diretamente do arquivo JSON e retornados no formato original.

#### ⚠️ Possíveis respostas:
| Status Code | Descrição                     |
|-------------|-------------------------------|
| 200         | Lista de FAQs retornada com sucesso |
| 500         | Erro interno ao ler o arquivo |

---

### 📌 `GET /ongs`

Este endpoint retorna uma lista de ONGs com suporte a filtros avançados. Os dados são lidos e convertidos para objetos.

### 🔍 Filtros disponíveis:

| Parâmetro       | Descrição                                                                 |
|----------------|---------------------------------------------------------------------------|
| `nome`         | Busca parcial por nome da ONG (ignora acentos e maiúsculas)               |
| `areaAtuacao`  | Filtra por área de atuação (ex: `educação`, `meio ambiente`)              |
| `missao`       | Busca por termos na missão da ONG (busca parcial)                         |

---

### 📌 `POST /ongs`

Cadastra uma nova ONG no sistema. Gera automaticamente um ID único e valida os campos obrigatórios.

#### 📋 Campos obrigatórios:

| Campo         | Descrição                                      |
|--------------|-----------------------------------------------|
| `nome`       | Nome oficial da ONG                           |
| `missao`     | Descrição da missão institucional             |
| `areaAtuacao`| Área(s) de atuação (ex: `["educação", "cultura"]`) |


---

### 📌 `GET /recursos`

Retorna uma lista de recursos com diversos filtros de busca. Os dados são lidos e convertidos para objetos do tipo.

#### 🔍 Filtros disponíveis:

| Parâmetro     | Descrição                                                                 |
|--------------|---------------------------------------------------------------------------|
| `tipo`       | Filtra por tipo exato de recurso (ignora acentos e maiúsculas)            |
| `publicoAlvo`| Busca parcial por público-alvo (ex: `pais`, `refugiados`)        |
| `idioma`     | Filtra por idioma do recurso (busca parcial)                              |
| `tag`        | Busca por tags associadas aos recursos                                    |

---

### 📌 `POST /recursos`

Cadastra um novo recurso no sistema. Gera automaticamente um ID único via UUIDv4.

#### 📋 Campos obrigatórios:

| Campo       | Descrição                                      |
|------------|-----------------------------------------------|
| `titulo`   | Título/nome do recurso                        |
| `url`      | Link para acesso ao recurso                   |
| `tipo`     | Categoria/classificação do recurso            |

---

## 🚀 Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/FK1FF3R/refugio-seguro.git

# Instale as dependências
npm install

# Inicie o servidor utilizando o nodemon
npm run dev
```