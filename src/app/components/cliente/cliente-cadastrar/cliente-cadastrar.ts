import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cliente-cadastrar',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-cadastrar.html',
  styleUrl: './cliente-cadastrar.css',
})
export class ClienteCadastrar implements OnInit {
  formularioCliente!: FormGroup;
  mensagemSucesso = '';
  mensagemErro = '';

  tipoPessoaOptions = [
    { descricao: 'Pessoa Física', valor: 'PF' },
    { descricao: 'Pessoa Jurídica', valor: 'PJ' },
  ];

  constructor(private readonly criadorFormulario: FormBuilder) {}

  ngOnInit(): void {
    this.criarFormularioCliente();
  }

  criarFormularioCliente(): void {
    this.formularioCliente = this.criadorFormulario.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      tipoPessoa: ['', Validators.required],
      cpfCnpj: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      cidade: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
    });
  }

  get pessoaJuridica(): boolean {
    return this.formularioCliente.get('tipoPessoa')?.value === 'PJ';
  }

  campoInvalido(campo: string): boolean {
    const controle = this.formularioCliente.get(campo);
    return !!(controle?.touched && controle.invalid);
  }

  alterarTipoPessoa(): void {
    const documento = this.formularioCliente.get('cpfCnpj');
    const formato = this.pessoaJuridica
      ? /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
      : /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    documento?.setValidators([Validators.required, Validators.pattern(formato)]);
    documento?.reset('');
    documento?.updateValueAndValidity();
    this.mensagemSucesso = '';
  }

  aplicarMascara(campo: string, evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    let valor = entrada.value.replace(/\D/g, '');

    if (campo === 'cpfCnpj') {
      valor = this.pessoaJuridica
        ? valor
            .slice(0, 14)
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
        : valor
            .slice(0, 11)
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/\.(\d{3})(\d)/, '.$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (campo === 'telefone') {
      valor = valor
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    } else if (campo === 'cep') {
      valor = valor.slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
    }

    entrada.value = valor;
    this.formularioCliente.get(campo)?.setValue(valor);
  }

  salvarCliente(): void {
    // Impede que campos obrigatórios sejam preenchidos apenas com espaços.
    for (const controle of Object.values(this.formularioCliente.controls)) {
      if (typeof controle.value === 'string') {
        controle.setValue(controle.value.trim());
      }
    }

    this.formularioCliente.markAllAsTouched();
    this.mensagemSucesso = '';

    if (this.formularioCliente.invalid) {
      this.mensagemErro = 'Preencha corretamente os campos obrigatórios.';
      return;
    }

    // Mantém o funcionamento do exemplo da aula, sem banco de dados.
    console.log('Cliente:', this.formularioCliente.value);
    console.log('Cliente em JSON:', JSON.stringify(this.formularioCliente.value));
    this.mensagemErro = '';
    this.mensagemSucesso = 'Dados do cliente validados com sucesso!';
  }

  cancelar(): void {
    this.criarFormularioCliente();
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }
}
