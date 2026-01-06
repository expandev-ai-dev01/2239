import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { propertySchema } from '../../validations/property';
import { usePropertyCreate } from '../../hooks/usePropertyCreate';
import { useCepValidation } from '../../hooks/useCepValidation';
import type { PropertyFormInput, PropertyFormOutput } from '../../types/forms';
import type { PropertyFormProps } from './types';

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

function PropertyForm({ onSuccess, onCancel }: PropertyFormProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [cepApiAvailable, setCepApiAvailable] = useState(true);

  const form = useForm<PropertyFormInput, unknown, PropertyFormOutput>({
    resolver: zodResolver(propertySchema),
    mode: 'onBlur',
    defaultValues: {
      tipo_propriedade: undefined,
      endereco_completo: '',
      cep: '',
      bairro: '',
      cidade: '',
      estado: undefined,
      area_total: 0,
      quartos: null,
      banheiros: null,
      vagas_garagem: 0,
      valor_aluguel: 0,
      valor_condominio: null,
      valor_iptu: null,
      descricao: null,
      usuario_cadastro: 'current_user',
    },
  });

  const { create, isLoading } = usePropertyCreate({
    onSuccess: (property) => {
      toast.success(
        `Propriedade cadastrada com sucesso! Código: ${property.codigo_propriedade} - Endereço: ${property.endereco_completo}, ${property.bairro}, ${property.cidade}/${property.estado}`,
        { duration: 5000 }
      );
      form.reset();
      setIsFormDirty(false);
      onSuccess?.();
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar propriedade';
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
      if (cep && /^\d{5}-\d{3}$/.test(cep)) {
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
          form.setValue('estado', result.uf as PropertyFormInput['estado']);
        }
      }
    };

    handleCepValidation();
  }, [cep, validateCep, form]);

  const onSubmit = async (data: PropertyFormOutput) => {
    const sanitizedData: PropertyFormOutput = {
      ...data,
      descricao: data.descricao ? DOMPurify.sanitize(data.descricao) : null,
    };

    await create(sanitizedData);
  };

  const handleCancel = () => {
    if (isFormDirty) {
      setShowCancelDialog(true);
    } else {
      onCancel?.();
    }
  };

  const confirmCancel = () => {
    form.reset();
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
          </div>

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
              Salvar Propriedade
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja cancelar?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os dados preenchidos serão perdidos.
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

export { PropertyForm };
