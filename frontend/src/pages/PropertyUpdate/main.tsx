import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '@/core/hooks/useNavigation';
import { PropertyUpdateForm } from '@/domain/property/components/PropertyUpdateForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { AlertCircle } from 'lucide-react';
import { usePropertyGet } from '@/domain/property/hooks/usePropertyGet';

function PropertyUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const { navigate } = useNavigation();
  const { property, isLoading, error } = usePropertyGet(id!);

  useEffect(() => {
    if (!id) {
      navigate('/properties');
    }
  }, [id, navigate]);

  const handleSuccess = () => {
    navigate('/properties');
  };

  const handleCancel = () => {
    navigate('/properties');
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar propriedade</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Propriedade não encontrada ou não existe'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 border-b pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Atualizar Propriedade</CardTitle>
          <CardDescription className="text-base">
            Código: {property.codigo_propriedade} - {property.endereco_completo}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PropertyUpdateForm
            property={property}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export { PropertyUpdatePage };
