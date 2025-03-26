import { useState } from 'react';
import MintGdc from './MintGdc';
import RedeemGdc from './RedeemGdc';

export default function MintLeftPart() {
    const [activeTab, setActiveTab] = useState('Mint GDC')
    return (
        <div className="radius-8 bg-trans p-4">
            <div className='d-flex v-center space-between'>
                <div className='w-100'>
                    <div className="font-18 bold-600 color-white text-center cursur-pointer py-2" onClick={() => setActiveTab('Mint GDC')}>Mint GDC</div>
                    <hr className={`hr-3 border-dark-green ${activeTab == "Mint GDC" ? "active_gmi_tab" : ""}`}/>
                </div>
                <div className='w-100'>
                    <div className="font-18 bold-600 color-white text-center cursur-pointer py-2" onClick={() => setActiveTab('Redeem GDC')}>Redeem GDC</div>
                    <hr className={`hr-3 border-dark-green ${activeTab == "Redeem GDC" ? "active_gmi_tab" : ""}`} />
                </div>
            </div>
            {
                activeTab == "Mint GDC" ? (
                    <MintGdc />
                ) : (
                    <RedeemGdc />
                )
            }
        </div>
    )
}