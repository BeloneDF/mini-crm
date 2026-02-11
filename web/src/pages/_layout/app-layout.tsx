/* eslint-disable indent */
import { type GetProfileResponse, getProfile } from '@/api/get-profile'
import { signOut } from '@/api/sign-out'
import { MajorFallbackSkeleton } from '@/components/fallback/major-fallback-skeleton'
import { SideBar } from '@/components/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CurrentUserContext } from '@/contexts/user'
import { api } from '@/lib/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function AppLayout() {
  const navigate = useNavigate()

  const { mutateAsync: signOutFn } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate('/sign-in', { replace: true })
    },
  })

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      response => response,
      error => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          const code = error.response?.data?.error
          const message = error.response?.data?.message
          let request
          try {
            request = JSON.parse(error.response?.request.response)
          } catch {
            request = error.response?.request.response
          }

          if (status === 401 && message === 'Unauthorized') {
            navigate('/sign-in', { replace: true })
          }
          if (status === 403 && code === 'Forbidden') {
            console.error('Forbidden error', request.message)
            navigate('/errors/forbidden', {
              replace: true,
              state: { message: request.message },
            })
          }
          if (status === 406) {
            signOutFn()
          } else {
            const errorMessage =
              error.response?.data?.message || 'An unknown error occurred'
            return Promise.reject(new Error(errorMessage))
          }
        }
      }
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  const { data: profile, isLoading: isLoadingProfile } =
    useQuery<GetProfileResponse>({
      queryKey: ['profile'],
      queryFn: async () => {
        return await getProfile()
      },
    })

  return (
    <div className="flex min-h-screen antialiased">
      {isLoadingProfile || profile === undefined ? (
        <></>
      ) : (
        <Suspense fallback={<MajorFallbackSkeleton />}>
          <CurrentUserContext.Provider value={{ userContext: profile }}>
            <TooltipProvider>
              <SideBar />
              <Outlet />
            </TooltipProvider>
          </CurrentUserContext.Provider>
        </Suspense>
      )}
    </div>
  )
}
