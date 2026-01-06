/**
 * Property domain type definitions
 * @module domain/property/types/models
 */

export interface Property {
  property_id: string;
  codigo_propriedade: string;
  tipo_propriedade: 'Casa' | 'Apartamento' | 'Kitnet' | 'Loja' | 'Sala Comercial' | 'Galpão';
  endereco_completo: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  area_total: number;
  quartos: number | null;
  banheiros: number | null;
  vagas_garagem: number;
  valor_aluguel: number;
  valor_condominio: number | null;
  valor_iptu: number | null;
  descricao: string | null;
  status: 'Disponível' | 'Ocupada' | 'Manutenção' | 'Inativa';
  data_cadastro: string;
  usuario_cadastro: string;
}

export interface CepValidationResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  apiAvailable?: boolean | null;
}
