import { useState } from 'react';
import { usePropertyHistory } from '../../hooks/usePropertyHistory';
import { PropertyHistoryFilters } from '../PropertyHistoryFilters';
import { PropertyChangesList } from '../PropertyChangesList';
import { PropertyLifecycleEventsList } from '../PropertyLifecycleEventsList';
import type { PropertyHistoryViewerProps } from './types';
import type { PropertyHistoryFilters as FiltersType } from '../../types/models';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/tabs';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { AlertCircle, History, Calendar } from 'lucide-react';

function PropertyHistoryViewer({ propertyId }: PropertyHistoryViewerProps) {
  const [filters, setFilters] = useState<FiltersType>({
    property_id: propertyId,
  });

  const { history, isLoading, error } = usePropertyHistory(filters);

  const handleFiltersChange = (newFilters: Partial<FiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar histórico</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Erro desconhecido ao carregar histórico'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!history) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Nenhum histórico encontrado</AlertTitle>
        <AlertDescription>Não há registros de histórico para esta propriedade.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <History className="text-primary h-5 w-5" />
            <CardTitle className="text-xl">Histórico da Propriedade</CardTitle>
          </div>
          <CardDescription>
            Total de alterações: {history.summary.total_changes} | Eventos do ciclo de vida:{' '}
            {history.summary.total_events}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PropertyHistoryFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </CardContent>
      </Card>

      <Tabs defaultValue="changes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="changes" className="gap-2">
            <Calendar className="h-4 w-4" />
            Alterações ({history.changes.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <History className="h-4 w-4" />
            Eventos do Ciclo de Vida ({history.lifecycle_events.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="changes" className="mt-6">
          <PropertyChangesList changes={history.changes} />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <PropertyLifecycleEventsList events={history.lifecycle_events} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { PropertyHistoryViewer };
