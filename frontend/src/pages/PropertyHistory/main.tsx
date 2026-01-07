import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '@/core/hooks/useNavigation';
import { PropertyHistoryViewer } from '@/domain/propertyHistory/components/PropertyHistoryViewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { ArrowLeft } from 'lucide-react';

function PropertyHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!id) {
      navigate('/properties');
    }
  }, [id, navigate]);

  if (!id) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Propriedades
        </Button>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Histórico da Propriedade
          </CardTitle>
          <CardDescription className="text-base">
            Visualize todas as alterações e eventos do ciclo de vida desta propriedade
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PropertyHistoryViewer propertyId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

export { PropertyHistoryPage };
