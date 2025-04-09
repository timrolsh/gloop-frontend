
import { Button } from 'react-bootstrap'
import { partializeWalletAddress } from '~/utils/ui'
import useUserStore from '~/stores/client/user'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useUser } from '~/hooks/user'

export default function ConnectWalletButton({ isMobile = false }) {

  const { openConnectModal } = useConnectModal()
  const { logout } = useUser()

  const walletAddress = useUserStore((state) => state.walletAddress)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  const handleButtonClicked = () => {

    if (isAuthenticated())
      logout()

    else
      openConnectModal()
  }

  return (
    <>
      <Button className={`${isAuthenticated() ? 'connect_btn' : 'loop-btn-second text-black font-14 bold-500'} ${isMobile ? 'connect_btn_mobile mobile-show' : 'desktop-show'}`} onClick={handleButtonClicked}>{isAuthenticated() ? partializeWalletAddress(walletAddress) : 'Connect'}</Button>
    </>
  )
}