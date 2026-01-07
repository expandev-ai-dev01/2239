import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PropertyHistoryFiltersProps } from './types';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { DatePicker } from '@/core/components/date-picker';
import { Filter, X } from 'lucide-react';

const changeTypes = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'mudancas_valor_aluguel', label: 'Mudanças de Valor de Aluguel' },
  { value: 'alteracoes_status_propriedade', label: 'Alterações de Status' },
  { value: 'modificacoes_descricao_propriedade', label: 'Modificações de Descrição' },
  { value: 'atualizacoes_caracteristicas', label: 'Atualizações de Características' },
  { value: 'mudancas_dados_contato_proprietario', label: 'Mudanças de Dados do Proprietário' },
];

function PropertyHistoryFilters({ filters, onFiltersChange }: PropertyHistoryFiltersProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.start_date ? new Date(filters.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.end_date ? new Date(filters.end_date) : undefined
  );
  const [changeType, setChangeType] = useState<string>(filters.change_type || 'todos');
  const [responsibleUser, setResponsibleUser] = useState<string>(filters.responsible_user || '');

  const handleApplyFilters = () => {
    onFiltersChange({
      start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      change_type: changeType !== 'todos' ? changeType : undefined,
      responsible_user: responsibleUser || undefined,
    });
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setChangeType('todos');
    setResponsibleUser('');
    onFiltersChange({
      start_date: undefined,
      end_date: undefined,
      change_type: undefined,
      responsible_user: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Data Inicial</Label>
          <DatePicker
            date={startDate}
            onDateChange={setStartDate}
            placeholder="Selecione a data inicial"
            formatStr="dd/MM/yyyy"
            locale={ptBR}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Data Final</Label>
          <DatePicker
            date={endDate}
            onDateChange={setEndDate}
            placeholder="Selecione a data final"
            formatStr="dd/MM/yyyy"
            locale={ptBR}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Alteração</Label>
          <Select value={changeType} onValueChange={setChangeType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {changeTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Usuário Responsável</Label>
          <Input
            placeholder="Nome do usuário"
            value={responsibleUser}
            onChange={(e) => setResponsibleUser(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClearFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
        <Button onClick={handleApplyFilters}>
          <Filter className="mr-2 h-4 w-4" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}

export { PropertyHistoryFilters };
