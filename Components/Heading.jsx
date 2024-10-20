import React from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'

// Custom Font from Google.
const plusJakartaSansBold = Plus_Jakarta_Sans({
    subsets : ['latin'],
});

export default function Heading() {
  return (
    <div className={`${plusJakartaSansBold.className} w-full flex flex-col items-center gap-8 pb-24 pt-8`}>
        
        <div className='text-[22px] sm:text-[55px] font-semibold flex flex-col items-center leading-[1.3] text-[#ffe8c7]'>
            {/* <p>Unlock a New Era of File Sharing</p> */}
            {/* <p>with Cutting-Edge Decentralization</p> */}
            <p>Discover a New Era of File Sharing</p>
            <p>with Our Decentralized Storage</p>
        </div>


        <div>
            {/* <p className='text[12px] sm:text-[20px] font-medium text-gray-400 text-center'>Harness the Power of Decentralized Storage with IPFS</p> */}
            <p className='text[10px] sm:text-[20px] font-medium text-[#8B80F9] text-center'>Leveraging IPFS for Faster and Safer Data Transfers</p>
        </div>

    </div>
  )
}
