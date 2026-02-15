import { signUp } from '@/api/auth/sign-up'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Target, Eye, EyeOff } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.').max(120),
    email: z.email('Digite um e-mail valido.'),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/,
        'A senha deve ter 8+ caracteres, maiúscula, minúscula, número e símbolo.'
      ),
    confirmPassword: z.string().min(1, 'Confirmação de senha obrigatória.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { mutate: signUpMutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success('Conta criada com sucesso!')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao criar conta.'
      toast.error(message)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = useCallback((data: RegisterForm) => {
    signUpMutate(data)
  }, [])

  return (
    <div className="flex w-full flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'oklch(0.17 0.03 270)' }}
          >
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">CRM</span>
        </div>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre-se para começar a usar o CRM.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              className="h-12 rounded-xl"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-12 rounded-xl"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Crie uma senha forte"
                className="h-12 rounded-xl pr-12"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                className="h-12 rounded-xl pr-12"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Cadastrar'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já possui conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/sign-in')}
            className="font-semibold text-primary"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}
