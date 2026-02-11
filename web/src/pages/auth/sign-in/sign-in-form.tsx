import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Target } from 'lucide-react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'

const passwordFormSchema = z.object({
  email: z.email('Digite um e-mail válido.'),
  password: z.string().max(128, 'Senha muito longa.'),
})

type LoginForm = z.infer<typeof passwordFormSchema>

export default function SignInForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { email: '' },
  })

  const { mutateAsync: authenticate, isPending: isLoading } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      toast.success('Bem-vindo!')
      navigate('/')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Erro ao fazer login.')
    },
  })

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      await authenticate(data)
    },
    [authenticate]
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/10 p-6">
      <div className="w-full max-w-md bg-background border rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <Target
          role="img"
          aria-label="Logo"
          className="h-30 mx-auto"
          style={{
            backgroundPosition: 'center',

            width: '100%',
            maxWidth: '200px',
          }}
        />

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Acessar CRM</h1>
          <p className="text-muted-foreground text-sm">
            Entre para acessar o sistema de CRM.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input {...register('email')} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Senha</Label>
            <Input type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
          <div>
            Nao possui uma conta?{' '}
            <Button variant="link" onClick={() => navigate('/sign-up')}>
              Cadastre-se aqui
            </Button>
          </div>
        </form>

        <div className="flex gap-2 place-items-center justify-center w-full">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} - Belone Zorzetto Fraga
          </p>
          <div
            className="w-5 h-5 bg-cover"
            style={{ backgroundImage: 'url(logo_andromeda.png)' }}
          />
        </div>
      </div>
    </div>
  )
}
