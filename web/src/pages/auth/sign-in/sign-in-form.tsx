import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Target, Eye, EyeOff } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const passwordFormSchema = z.object({
  email: z.email('Digite um e-mail valido.'),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/,
      'A senha deve ter 8+ caracteres, maiúscula, minúscula, número e símbolo.'
    )
    .min(1, 'Senha obrigatoria.')
    .max(128, 'Senha muito longa.'),
})

type LoginForm = z.infer<typeof passwordFormSchema>

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: signInMutate, isPending: isSigningIn } = useMutation({
    mutationFn: signIn,
    onMutate: () => {
      toast.loading('Entrando...')
    },
    onSuccess: () => {
      toast.success('Login bem-sucedido!')
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Ocorreu um erro ao entrar.'
      toast.error(message)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = useCallback(async (data: LoginForm) => {
    signInMutate(data)
  }, [])

  return (
    <div className="flex w-full flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
      <div
        className="mx-auto w-full max-w-sm"
        style={{ animation: 'fade-up 0.6s ease-out' }}
      >
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'oklch(0.17 0.03 270)' }}
          >
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <span
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            CRM
          </span>
        </div>

        <div className="mb-8 space-y-2">
          <h1
            className="text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Bem-vindo de volta
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Entre com suas credenciais para acessar o CRM.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-12 rounded-xl border-border bg-card px-4 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register('email')}
            />
            {errors.email && (
              <p
                className="text-xs text-destructive"
                style={{ animation: 'fade-up 0.3s ease-out' }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Senha
              </Label>
              <button
                type="button"
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                className="h-12 rounded-xl border-border bg-card pr-12 px-4 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                className="text-xs text-destructive"
                style={{ animation: 'fade-up 0.3s ease-out' }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSigningIn}
            className="mt-2 h-12 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {'Nao possui uma conta? '}
          <button
            type="button"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Cadastre-se aqui
          </button>
        </p>

        <div className="mt-12 flex items-center justify-center gap-2">
          <p className="text-xs text-muted-foreground/60">
            {'© '}
            {new Date().getFullYear()}
            {' Belone Zorzetto Fraga'}
          </p>
        </div>
      </div>
    </div>
  )
}
