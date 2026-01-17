'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ZoomImageProps {
    src: string
    alt: string
}

const ZoomImage: React.FC<ZoomImageProps> = ({ src, alt }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Thumbnail */}
            <div
                className="relative w-full h-64 cursor-zoom-in"
                onClick={() => setIsOpen(true)}
            >
                <Image src={src} alt={alt} fill className="object-cover" />
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-2xl"
                        onClick={() => setIsOpen(false)}
                    >
                        <X />
                    </button>
                    <div className="relative w-[80vw] h-[80vh]">
                        <Image src={src} alt={alt} fill className="object-contain" />
                    </div>
                </div>
            )}
        </>
    )
}

export default ZoomImage
