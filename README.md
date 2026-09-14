# Cadastro de Cliente

Atividade de reprodução do formulário desenvolvido em sala de aula, usando Angular e Bootstrap.

A estrutura do formulário e o uso de `FormBuilder`, `FormGroup`, `ReactiveFormsModule` e `Validators` foram mantidos a partir do exemplo do professor. Os componentes do PrimeNG foram substituídos por campos HTML estilizados com Bootstrap 5.3.8. O Bootstrap está instalado no projeto, sem depender de uma CDN para carregar os estilos.

## Como executar

Requisitos: Node.js 24.15 ou superior da linha 24 LTS e npm. O projeto foi testado com Node.js 24.19.0 e npm 11.17.0.

No terminal, dentro da pasta que contém `package.json`:

```bash
npm ci
npm start
```

Abra http://localhost:4200 no navegador. Para encerrar, pressione Ctrl+C no terminal.

Não é necessário instalar o Angular CLI globalmente. No PowerShell, caso `npm` seja bloqueado pela política de scripts, use `npm.cmd ci` e `npm.cmd start`.

## Funcionamento

O formulário contém Nome, Tipo de Pessoa, CPF/CNPJ, Telefone, CEP, Cidade, Endereço, Bairro, Número e Email.

- Todos os campos são obrigatórios. O nome deve ter de 3 a 50 caracteres.
- CPF/CNPJ, telefone e CEP recebem máscaras durante a digitação.
- Ao mudar entre Pessoa Física e Pessoa Jurídica, o documento é limpo e a máscara é alterada.
- O email e a quantidade de dígitos dos campos com máscara são verificados.
- **Salvar** marca os campos para validação. Se estiverem corretos, mostra uma confirmação e imprime os dados como objeto e JSON no console do navegador, assim como no exemplo da aula.
- **Cancelar** limpa os campos e as mensagens.

Para ver os dados enviados, abra as ferramentas do navegador (F12) e a aba Console.

Este exercício não usa banco de dados nem API. Os cadastros não persistem ao atualizar a página. A validação de CPF/CNPJ verifica o formato, sem calcular dígitos verificadores.

## Verificações

```bash
npm run build
npm test -- --watch=false
```

Para conferir manualmente:

1. Clique em Salvar com os campos vazios: os erros devem aparecer.
2. Preencha os campos e selecione Pessoa Física: o CPF deve receber a máscara.
3. Salve e confira a confirmação e os dados no console.
4. Troque para Pessoa Jurídica: o documento deve ser limpo e aceitar o formato de CNPJ.
5. Clique em Cancelar: os campos e as mensagens devem ser limpos.

Use somente dados fictícios durante a demonstração.

## Onde está o código

- `src/app/components/cliente/cliente-cadastrar/cliente-cadastrar.ts`: criação, validação, máscaras e ações do formulário.
- `src/app/components/cliente/cliente-cadastrar/cliente-cadastrar.html`: campos e organização com Bootstrap.
- `src/styles.css`: importação do Bootstrap e cor de fundo.

Base: projeto `app-concessionaria-main` disponibilizado pelo professor.

Referências: [formulários reativos do Angular](https://angular.dev/guide/forms/reactive-forms) e [formulários do Bootstrap](https://getbootstrap.com/docs/5.3/forms/overview/).
