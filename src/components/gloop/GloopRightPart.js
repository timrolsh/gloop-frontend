import Info from '../Info';
import { Button } from 'react-bootstrap';

export default function GloopRightPart() {
    return (
        <div className="radius-8 bg-trans p-4 min-h-500">
            <div className='font-18 bold-600 color-white'>Informations</div>
            <div>
                <hr className='hr-3 border-dark-green'/>
            </div>
            <div className='d-flex v-center space-between'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Gloop Price</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Total Raised</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem222"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Hard Cap</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem3333"/>
                    </div>
                </div>
                <div className='text-end'>
                    <div className='font-16 bold-700 color-white my-3'>
                        $0.012
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        $0
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        $1,800,000
                    </div>
                </div>
            </div>
            <div>
                <hr className='hr-1 border-dark-green'/>
            </div>
            <div className='d-flex v-center space-between'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Circ. marketcap</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem44"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3 d-flex'>
                        <span className='mr-10' >FDV</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem55"/>
                    </div>
                </div>
                <div>
                    <div className='font-16 bold-700 color-white my-3'>
                        $5,400,000
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        $12,000,000
                    </div>
                </div>
            </div>
            <div className='mt-3'>
                <Button className='gloop-btn-second font-16 bold-700 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 w-100 '>Private Sale Start in 7d 02h 12m 50s</Button>
            </div>
        </div>
    )
}