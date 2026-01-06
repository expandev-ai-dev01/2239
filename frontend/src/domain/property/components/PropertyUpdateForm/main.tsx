import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { propertyUpdateSchema } from '../../validations/propertyUpdate';
import { usePropertyUpdate } from '../../hooks/usePropertyUpdate';
import { useCepValidation } from '../../hooks/useCepValidation';
import type { PropertyUpdateFormInput, PropertyUpdateFormOutput } from '../../types/forms';
import type { PropertyUpdateFormProps } from './types';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/core/components/alert-dialog';

function PropertyUpdateForm({ property, onSuccess, onCancel }: PropertyUpdateFormProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [cepApiAvailable, setCepApiAvailable] = useState(true);

  const form = useForm<PropertyUpdateFormInput, unknown, PropertyUpdateFormOutput>({
    resolver: zodResolver(propertyUpdateSchema),
    mode: 'onBlur',
    defaultValues: {
      tipo_propriedade: property.tipo_propriedade,
      endereco_completo: property.endereco_completo,
      cep: property.cep,
      bairro: property.bairro,
      cidade: property.cidade,
      estado: property.estado as PropertyUpdateFormInput['estado'],
      area_total: property.area_total,
      quartos: property.quartos,
      banheiros: property.banheiros,
      vagas_garagem: property.vagas_garagem,
      valor_aluguel: property.valor_aluguel,
      valor_condominio: property.valor_condominio,
      valor_iptu: property.valor_iptu,
      descricao: property.descricao,
      status: property.status,
    },
  });

  const { update, isLoading } = usePropertyUpdate({
    onSuccess: (updatedProperty) => {
      toast.success(
        `Propriedade atualizada com sucesso! Código: ${updatedProperty.codigo_propriedade}`,
        { duration: 5000 }
      );
      setIsFormDirty(false);
      onSuccess?.();
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar propriedade';
      toast.error(errorMessage);
    },
  });

  const { validateCep, isValidating } = useCepValidation();

  const tipoPropriedade = form.watch('tipo_propriedade');
  const cep = form.watch('cep');

  const isCommercialProperty = ['Loja', 'Sala Comercial', 'Galpão'].includes(tipoPropriedade || '');

  useEffect(() => {
    if (isCommercialProperty) {
      form.setValue('quartos', null);
    }
  }, [isCommercialProperty, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsFormDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const handleCepValidation = async () => {
      if (cep && /^\d{5}-\d{3}$/.test(cep) && cep !== property.cep) {
        const result = await validateCep(cep);

        if (result === null) {
          setCepApiAvailable(false);
          toast.warning(
            'Serviço de validação de CEP temporariamente indisponível. Verifique os dados de endereço manualmente.'
          );
        } else {
          setCepApiAvailable(true);
          form.setValue('bairro', result.bairro);
          form.setValue('cidade', result.localidade);
          form.setValue('estado', result.uf as PropertyUpdateFormInput['estado']);
        }
      }
    };

    handleCepValidation();
  }, [cep, validateCep, form, property.cep]);

  const onSubmit = async (data: PropertyUpdateFormOutput) => {
    const sanitizedData: PropertyUpdateFormOutput = {
      ...data,
      descricao: data.descricao ? DOMPurify.sanitize(data.descricao) : null,
    };

    await update({ id: property.property_id, data: sanitizedData });
  };

  const handleCancel = () => {
    if (isFormDirty) {
      setShowCancelDialog(true);
    } else {
      onCancel?.();
    }
  };

  const confirmCancel = () => {
    setIsFormDirty(false);
    setShowCancelDialog(false);
    onCancel?.();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tipo_propriedade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Propriedade *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Kitnet">Kitnet</SelectItem>
                      <SelectItem value="Loja">Loja</SelectItem>
                      <SelectItem value="Sala Comercial">Sala Comercial</SelectItem>
                      <SelectItem value="Galpão">Galpão</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Disponível">Disponível</SelectItem>
                      <SelectItem value="Ocupada">Ocupada</SelectItem>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Inativa">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="00000-000"
                      {...field}
                      maxLength={9}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 5) {
                          value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
                        }
                        field.onChange(value);
                      }}
                    />
                    {isValidating && (
                      <Loader2 className="text-muted-foreground absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                    )}
                  </div>
                </FormControl>
                {!cepApiAvailable && (
                  <FormDescription className="text-yellow-600">
                    API de CEP indisponível. Preencha manualmente os campos de endereço.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endereco_completo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua Exemplo, 123, Apto 45" {...field} />
                </FormControl>
                <FormDescription>
                  Informe logradouro, número e complemento (se aplicável)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade *</FormLabel>
                  <FormControl>
                    <Input placeholder="São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
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
                      ].map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <FormField
              control={form.control}
              name="area_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área Total (m²) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quartos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quartos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      disabled={isCommercialProperty}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  {isCommercialProperty && (
                    <FormDescription>Não aplicável para propriedades comerciais</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banheiros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banheiros</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vagas_garagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vagas Garagem</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="valor_aluguel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Aluguel (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor_condominio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Condomínio (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor_iptu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor IPTU Anual (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição detalhada da propriedade..."
                    className="min-h-[100px]"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>Máximo 1000 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja cancelar?</AlertDialogTitle>
            <AlertDialogDescription>
              Todas as alterações não salvas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Sim, cancelar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { PropertyUpdateForm };
