'use client'
import React, { useRef, useState } from 'react'
import Image from 'next/image'

interface ZoomImageProps {
    src?: string | null
    alt: string
    sizes?: string
    onLoad?: () => void
}

const ZoomImage: React.FC<ZoomImageProps> = ({ src, alt, sizes, onLoad }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [transformOrigin, setTransformOrigin] = useState('center center')

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setTransformOrigin(`${x}% ${y}%`)
    }

    const handleMouseLeave = () => {
        setTransformOrigin('center center')
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-64 overflow-hidden cursor-zoom-in border bg-white"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-300 ease-out hover:scale-150"
                    style={{ transformOrigin }}
                    sizes={sizes || '100vw'}
                    priority={true}
                    onLoad={onLoad}
                />
            ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                    Image not available
                </div>
            )}
        </div>
    )
}

export default ZoomImage
