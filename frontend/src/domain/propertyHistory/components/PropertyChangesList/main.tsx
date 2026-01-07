import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PropertyChangesListProps } from './types';

import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { Separator } from '@/core/components/separator';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/core/components/empty';
import { FileText, User, Calendar, ArrowRight } from 'lucide-react';

function PropertyChangesList({ changes }: PropertyChangesListProps) {
  if (!changes || changes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Nenhuma alteração encontrada</EmptyTitle>
          <EmptyDescription>
            Não há registros de alterações para os filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const formatValue = (value: string | null): string => {
    if (value === null || value === '') return 'Não informado';

    if (!isNaN(Number(value)) && value.includes('.')) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(value));
    }

    return value;
  };

  return (
    <div className="space-y-4">
      {changes.map((change) => (
        <Card key={change.change_id} className="shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">{change.field_modified}</CardTitle>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(change.change_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>
              <Badge variant="outline">{change.property_status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-muted/50 flex items-center gap-3 rounded-md p-3">
              <div className="flex-1 space-y-1">
                <p className="text-muted-foreground text-xs font-medium">Valor Anterior</p>
                <p className="text-sm font-medium">{formatValue(change.previous_value)}</p>
              </div>
              <ArrowRight className="text-muted-foreground h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-muted-foreground text-xs font-medium">Novo Valor</p>
                <p className="text-primary text-sm font-semibold">
                  {formatValue(change.new_value)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="font-medium">Responsável:</span>
                <span className="text-muted-foreground">{change.user_responsible}</span>
              </div>
              <div className="bg-muted/30 rounded-md p-3">
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  Motivo da Alteração
                </p>
                <p className="text-sm leading-relaxed">{change.change_reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { PropertyChangesList };
