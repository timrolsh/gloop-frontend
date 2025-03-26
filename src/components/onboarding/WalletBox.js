import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Button } from 'react-bootstrap'
import { useUser } from '~/hooks/user'
import useUserStore from '~/stores/client/user'

export default function WalletBox({ onDisconnect }) {

    const { logout } = useUser()
    const isAuthenticated = useUserStore((state) => state.isAuthenticated)

    const { openConnectModal } = useConnectModal()

    const handleButtonClicked = () => {

        if (isAuthenticated())
            logout(onDisconnect)

        else
            openConnectModal()
    }

    return (
        <div className='radius-8 border-green border-1 p-3 desktop-flex align-items-center space-between bg-dark1'>
            <div className='color-white d-flex align-items-center font-18 bold-500'>
                <div className='mr-10 px-3 py-2 bg-gray1 radius-8 color-green number_box'>1</div><div>Connect your Wallet</div>
            </div>
            <div className='my-2'>
                <Button className={`${isAuthenticated() ? 'connect_btn' : 'gloop-btn-primary bg-green border-green color-dark'} font-16 bold-700 radius-8 p-10 min-w-200`} onClick={handleButtonClicked}>{isAuthenticated() ? 'Disconnect' : 'Connect'}</Button>
            </div>
        </div>
    )
}