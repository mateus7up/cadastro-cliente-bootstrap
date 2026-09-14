import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ClienteCadastrar } from './cliente-cadastrar';

describe('ClienteCadastrar', () => {
  let component: ClienteCadastrar;
  let fixture: ComponentFixture<ClienteCadastrar>;

  const clienteExemplo = {
    nome: 'Cliente de Teste',
    tipoPessoa: 'PF',
    cpfCnpj: '123.456.789-00',
    telefone: '(11) 99999-0000',
    email: 'cliente@example.com',
    cidade: 'Cidade de Teste',
    logradouro: 'Rua de Teste',
    numero: '100',
    bairro: 'Centro',
    cep: '12345-678',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCadastrar],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteCadastrar);
    component = fixture.componentInstance;
    await fixture.whenStable();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  function digitar(campo: string, valor: string): void {
    const entrada = fixture.nativeElement.querySelector('#' + campo) as HTMLInputElement;
    entrada.value = valor;
    entrada.dispatchEvent(new Event('input', { bubbles: true }));
  }

  it('não envia o formulário vazio e exibe os dez campos inválidos', async () => {
    fixture.nativeElement.querySelector('button[type="submit"]').click();
    await fixture.whenStable();

    expect(console.log).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.is-invalid').length).toBe(10);
    expect(component.mensagemSucesso).toBe('');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Preencha corretamente',
    );
  });

  it('envia os dados válidos incluindo a cidade e confirma na tela', async () => {
    component.formularioCliente.setValue(clienteExemplo);
    fixture.nativeElement.querySelector('button[type="submit"]').click();
    await fixture.whenStable();

    expect(console.log).toHaveBeenCalledWith('Cliente:', clienteExemplo);
    expect(console.log).toHaveBeenCalledWith('Cliente em JSON:', JSON.stringify(clienteExemplo));
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'validados com sucesso',
    );
  });

  it('rejeita email inválido, cidade em branco e documento incompleto', () => {
    component.formularioCliente.setValue({
      ...clienteExemplo,
      email: 'email-invalido',
      cidade: '   ',
      cpfCnpj: '123',
    });
    component.salvarCliente();

    expect(console.log).not.toHaveBeenCalled();
    expect(component.campoInvalido('email')).toBe(true);
    expect(component.campoInvalido('cidade')).toBe(true);
    expect(component.campoInvalido('cpfCnpj')).toBe(true);
  });

  it('aplica as máscaras aos valores digitados nos campos', () => {
    digitar('cpfCnpj', '12345678900');
    digitar('telefone', '11999990000');
    digitar('cep', '12345678');

    expect(component.formularioCliente.get('cpfCnpj')?.value).toBe('123.456.789-00');
    expect(component.formularioCliente.get('telefone')?.value).toBe('(11) 99999-0000');
    expect(component.formularioCliente.get('cep')?.value).toBe('12345-678');

    digitar('telefone', '1133330000');
    expect(component.formularioCliente.get('telefone')?.value).toBe('(11) 3333-0000');
    expect(component.formularioCliente.get('telefone')?.valid).toBe(true);
  });

  it('troca CPF por CNPJ, limpa o documento anterior e aceita pessoa jurídica', async () => {
    component.formularioCliente.setValue(clienteExemplo);
    const seletor = fixture.nativeElement.querySelector('#tipoPessoa') as HTMLSelectElement;
    seletor.value = 'PJ';
    seletor.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();

    expect(component.formularioCliente.get('cpfCnpj')?.value).toBe('');
    expect(fixture.nativeElement.querySelector('label[for="cpfCnpj"]').textContent).toContain(
      'CNPJ',
    );
    digitar('cpfCnpj', '12345678000190');
    component.salvarCliente();

    expect(component.formularioCliente.get('cpfCnpj')?.value).toBe('12.345.678/0001-90');
    expect(component.formularioCliente.valid).toBe(true);
    expect(console.log).toHaveBeenCalledWith('Cliente:', {
      ...clienteExemplo,
      tipoPessoa: 'PJ',
      cpfCnpj: '12.345.678/0001-90',
    });
  });

  it('cancelar limpa os campos, os erros e a confirmação, inclusive após usar CNPJ', async () => {
    component.formularioCliente.setValue({ ...clienteExemplo, tipoPessoa: 'PJ' });
    component.alterarTipoPessoa();
    component.formularioCliente.get('cpfCnpj')?.setValue('12.345.678/0001-90');
    component.salvarCliente();
    fixture.nativeElement.querySelector('button[type="button"]').click();
    await fixture.whenStable();

    expect(Object.values(component.formularioCliente.value).every((valor) => valor === '')).toBe(
      true,
    );
    expect(component.formularioCliente.untouched).toBe(true);
    expect(component.mensagemErro).toBe('');
    expect(component.mensagemSucesso).toBe('');
    expect(fixture.nativeElement.querySelectorAll('.is-invalid').length).toBe(0);

    component.formularioCliente.setValue(clienteExemplo);
    expect(component.formularioCliente.valid).toBe(true);
  });
});
