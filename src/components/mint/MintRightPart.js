import Info from '../Info';

export default function MintRightPart() {
    return (
        <div className="radius-8 bg-trans p-4 min-h-455">
            <div className='font-18 bold-600 color-white py-2'>Informations</div>
            <div>
                <hr className='hr-3 border-dark-green'/>
            </div>
            <div className='radius-8 border-2 border-dark-green p-3 mt-4'>
                <div className='font-16 bold-700 color-white'>GDC Details</div>
                <div className='d-flex v-center space-between'>
                    <div>
                        <div className='font-16 bold-300 color-gray my-2'>
                            <span className='mr-10' >GDC Price</span>
                            <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                        </div>
                        <div className='font-16 bold-300 color-gray my-2'>
                            <span className='mr-10' >Minting Ratio</span>
                            <Info content="Lorem ipsum dolor sit amet consectetur lorem222"/>
                        </div>
                    </div>
                    <div>
                        <div className='font-16 bold-700 color-white my-2'>
                            $1.00
                        </div>
                        <div className='font-16 bold-700 color-white my-2'>
                            100%
                        </div>
                    </div>
                </div>
            </div>
            <div className='radius-8 border-2 border-dark-green p-3 mt-4'>
                <div className='font-16 bold-700 color-white'>IOU Stability Pool Details</div>
                <div className='d-flex v-center space-between'>
                    <div>
                        <div className='font-16 bold-300 color-gray my-2'>
                            <span className='mr-10' >Liquidation Bonus</span>
                            <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                        </div>
                        <div className='font-16 bold-300 color-gray my-2'>
                            <span className='mr-10' >Gloop APR</span>
                            <Info content="Lorem ipsum dolor sit amet consectetur lorem222"/>
                        </div>
                    </div>
                    <div>
                        <div className='font-16 bold-700 color-white my-2'>
                            X %
                        </div>
                        <div className='font-16 bold-700 color-white my-2'>
                            X %
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}