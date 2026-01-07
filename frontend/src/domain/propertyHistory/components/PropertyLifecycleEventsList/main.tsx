import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PropertyLifecycleEventsListProps } from './types';

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
import { History, Calendar, FileText, AlertCircle } from 'lucide-react';

const eventTypeLabels: Record<string, string> = {
  criacao_propriedade_sistema: 'Criação da Propriedade',
  vinculacao_contrato: 'Vinculação de Contrato',
  desvinculacao_contrato: 'Desvinculação de Contrato',
  entrada_inquilino: 'Entrada de Inquilino',
  saida_inquilino: 'Saída de Inquilino',
  exclusao_propriedade: 'Exclusão da Propriedade',
};

const eventTypeVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  criacao_propriedade_sistema: 'default',
  vinculacao_contrato: 'default',
  desvinculacao_contrato: 'secondary',
  entrada_inquilino: 'default',
  saida_inquilino: 'secondary',
  exclusao_propriedade: 'destructive',
};

function PropertyLifecycleEventsList({ events }: PropertyLifecycleEventsListProps) {
  if (!events || events.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <History className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Nenhum evento encontrado</EmptyTitle>
          <EmptyDescription>
            Não há eventos do ciclo de vida registrados para os filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.event_id} className="shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">
                  {eventTypeLabels[event.event_type] || event.event_type}
                </CardTitle>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(event.event_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>
              <Badge variant={eventTypeVariants[event.event_type] || 'outline'}>
                {eventTypeLabels[event.event_type] || event.event_type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-muted/30 rounded-md p-3">
              <div className="flex items-start gap-2">
                <FileText className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="flex-1 space-y-1">
                  <p className="text-muted-foreground text-xs font-medium">Descrição do Evento</p>
                  <p className="text-sm leading-relaxed">{event.event_description}</p>
                </div>
              </div>
            </div>

            {(event.related_contract_id || event.related_tenant_id) && (
              <>
                <Separator />
                <div className="space-y-2 text-sm">
                  {event.related_contract_id && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Contrato Relacionado:</span>
                      <span className="text-muted-foreground font-mono text-xs">
                        {event.related_contract_id}
                      </span>
                    </div>
                  )}
                  {event.related_tenant_id && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Inquilino Relacionado:</span>
                      <span className="text-muted-foreground font-mono text-xs">
                        {event.related_tenant_id}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Impacto na Propriedade
                  </p>
                  <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-100">
                    {event.event_impact}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { PropertyLifecycleEventsList };
