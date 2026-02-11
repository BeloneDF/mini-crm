import LoginDecoration from '@/components/login-decorator'
import SignInForm from './sign-in-form'

export default function SignIn() {
  return (
    <main className="flex min-h-screen border border-zinc-800 w-full">
      <div className="hidden lg:block lg:w-1/2">
        <LoginDecoration />
      </div>
      <div className="flex w-full items-center lg:w-1/2">
        <SignInForm />
      </div>
    </main>
  )
}
