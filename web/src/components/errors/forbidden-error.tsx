import { ForbiddenError } from './forbidden-error-svg'

export default function Forbidden() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <ForbiddenError className="lg:size-[50%] sm:size-[80%] md:size-[60%] xl:size-[50%]" />
      <h1 className="text-4xl font-bold">
        Sem permissão para acessar este recurso.
      </h1>
    </div>
  )
}
