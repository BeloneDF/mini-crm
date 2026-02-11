import NotFoundError from './not-found-error-svg'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 p-2">
      <NotFoundError className="lg:size-[50%] sm:size-[80%] md:size-[60%] xl:size-[50%]" />
      <h1 className="text-2xl sm:text-md font-bold text-center">
        Ops! Não encontramos nada por aqui.
      </h1>
    </div>
  )
}
