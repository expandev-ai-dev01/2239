/**
 * Property update validation schemas using Zod 4.x
 * @module domain/property/validations/propertyUpdate
 */

import { z } from 'zod';

const propertyTypes = [
  'Casa',
  'Apartamento',
  'Kitnet',
  'Loja',
  'Sala Comercial',
  'Galpão',
] as const;

const propertyStatuses = ['Disponível', 'Ocupada', 'Manutenção', 'Inativa'] as const;

const brazilianStates = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

export const propertyUpdateSchema = z
  .object({
    tipo_propriedade: z.enum(propertyTypes, 'Selecione um tipo válido de propriedade'),
    endereco_completo: z
      .string('Endereço completo é obrigatório')
      .min(1, 'Endereço completo não pode estar vazio')
      .max(200, 'Endereço deve ter no máximo 200 caracteres')
      .refine(
        (val) => {
          const hasLetters = /[a-zA-Z]/.test(val);
          const hasNumbers = /\d/.test(val);
          return hasLetters && hasNumbers;
        },
        { message: 'Endereço deve conter logradouro e número' }
      ),
    cep: z
      .string('CEP é obrigatório')
      .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato XXXXX-XXX'),
    bairro: z
      .string('Bairro é obrigatório')
      .min(1, 'Bairro não pode estar vazio')
      .max(100, 'Bairro deve ter no máximo 100 caracteres'),
    cidade: z
      .string('Cidade é obrigatória')
      .min(1, 'Cidade não pode estar vazia')
      .max(100, 'Cidade deve ter no máximo 100 caracteres'),
    estado: z.enum(brazilianStates, 'Informe uma UF válida'),
    area_total: z
      .number('Área total é obrigatória')
      .min(0.01, 'Área deve ser maior que zero')
      .max(10000, 'Área deve ser menor que 10.000 m²'),
    quartos: z
      .number('Número de quartos inválido')
      .int('Número de quartos deve ser inteiro')
      .min(0, 'Número de quartos deve ser maior ou igual a 0')
      .max(20, 'Número de quartos deve estar entre 0 e 20')
      .nullable()
      .optional(),
    banheiros: z
      .number('Número de banheiros inválido')
      .int('Número de banheiros deve ser inteiro')
      .min(0, 'Número de banheiros deve ser maior ou igual a 0')
      .max(10, 'Número de banheiros deve estar entre 0 e 10')
      .nullable()
      .optional(),
    vagas_garagem: z
      .number('Número de vagas inválido')
      .int('Número de vagas deve ser inteiro')
      .min(0, 'Número de vagas deve ser maior ou igual a 0')
      .max(20, 'Número de vagas deve estar entre 0 e 20')
      .default(0),
    valor_aluguel: z
      .number('Valor do aluguel é obrigatório')
      .min(0.01, 'Valor do aluguel deve ser maior que zero'),
    valor_condominio: z
      .number('Valor do condomínio inválido')
      .min(0, 'Valor do condomínio deve ser maior ou igual a zero')
      .nullable()
      .optional(),
    valor_iptu: z
      .number('Valor do IPTU inválido')
      .min(0, 'Valor do IPTU deve ser maior ou igual a zero')
      .nullable()
      .optional(),
    descricao: z
      .string()
      .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
      .nullable()
      .optional(),
    status: z.enum(propertyStatuses, 'Selecione um status válido'),
  })
  .refine(
    (data) => {
      const commercialTypes = ['Loja', 'Sala Comercial', 'Galpão'];
      if (commercialTypes.includes(data.tipo_propriedade) && data.quartos !== null) {
        return false;
      }
      return true;
    },
    {
      message: 'Propriedades comerciais não devem ter número de quartos informado',
      path: ['quartos'],
    }
  );
