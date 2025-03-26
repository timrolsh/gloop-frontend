import { queries } from '~/consts/queries'

import { useQuery } from '@tanstack/react-query'
import { useAxios } from '~/plugins/api'
import Endpoint from '~/plugins/endpoint'
import useUserStore from '~/stores/client/user'

const useGetUserDetails = () => {

  const userTokens = useUserStore((state) => state.userTokens)

  const axios = useAxios()

  const getData = async () => {

    const endpoint = Endpoint.getUrl('me')
    const reponse = await axios.get(endpoint)
    return reponse.data.data
  }

  return useQuery({
    queryKey: [queries.GET_USER_DETAILS, userTokens],
    queryFn: getData,
    enabled: userTokens && userTokens.accessToken.length > 0
  })

}

export default useGetUserDetails