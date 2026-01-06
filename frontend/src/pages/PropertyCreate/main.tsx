import { useNavigation } from '@/core/hooks/useNavigation';
import { PropertyForm } from '@/domain/property/components/PropertyForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';

function PropertyCreatePage() {
  const { navigate } = useNavigation();

  const handleSuccess = () => {
    navigate('/properties');
  };

  const handleCancel = () => {
    navigate('/properties');
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 border-b pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Cadastrar Propriedade</CardTitle>
          <CardDescription className="text-base">
            Preencha os dados da propriedade para cadastro no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PropertyForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
}

export { PropertyCreatePage };
