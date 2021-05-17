# Fatepark
Projeto do Laboratório de Engenharia de Software

## Instruções de setup
Esse projeto contém tanto o projeto de frontend o api para facilitar a manutenção, cada uma com sua respectiva pasta.

### API
A API está construída em cima do framework ```NestJS```.

As suas especificações se encontram na documentação do projeto

https://docs.nestjs.com/

Intruções de banco de dados:
1. Instalar postgres na sua máquina (de preferência com o pgAdmin para facilitar configuração)
2. Criar um server com um banco de dados "fatepark_database" (nesse database tem que ter um usuário com login "admin", senha "admin")

Instruções de uso:

1. instalar Node (versão 10 no mínimo)
2. instalar CLI do nest com ```npm i -g @nestjs/cli```
3. entrar na pasta da api
4. instalar as dependências com ```npm install```
5. rodar com ```npm run start:dev``` (esse é o comando para desenvolvimento que recompila aplicação quando você altera o código)