import { useQuery } from "@tanstack/react-query"
import { getMe } from "./auth.api"

export function useMe() {

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false
  })

}