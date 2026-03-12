import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser, registerUser } from "./auth.api"

export function useLogin() {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: loginUser,

    onSuccess: (data) => {

      // important: keep react-query user cache fresh
      queryClient.invalidateQueries({ queryKey: ["me"] })

      return data
    }

  })
}


export function useRegister() {

  return useMutation({
    mutationFn: registerUser
  })

}