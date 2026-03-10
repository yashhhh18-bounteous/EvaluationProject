import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser, registerUser } from "./auth.api"

export function useLogin() {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: loginUser,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
    }

  })
}


export function useRegister() {

  return useMutation({
    mutationFn: registerUser
  })

}