'use client'

import { Card } from '@/components/ui/card'
import { UploadCloud, FileText, X, Download } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const Page = () => {
    const [file, setFile] = useState<File | null>(null)
    const [headers, setHeaders] = useState<string[]>([])
    const [rows, setRows] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [availableArticleTypes, setAvailableArticleTypes] = useState<any[]>([])
    const [selectedArticleType, setSelectedArticleType] = useState<string>('')

    // ===== Fetch available article types once on page load =====
    useEffect(() => {
        const fetchArticleTypes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!res.ok) throw new Error('Failed to fetch article types')
                const data = await res.json()
                console.log("data", data)
                setAvailableArticleTypes(data.data || [])
            } catch (error) {
                console.error(error)
                toast.error('Error fetching article types')
            }
        }

        fetchArticleTypes()
    }, [])

    // ===== File Selection =====
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setHeaders([])
            setRows([])
            setMessage(null)
        }
    }

    // ===== Download Excel Template from Backend =====
    const handleDownloadTemplate = async (articleTypeParam?: string) => {
        const type = articleTypeParam || selectedArticleType
        if (!type) {
            toast.error('Please select an article type')
            return
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/template/download?articleType=${type}`

            const res = await fetch(url, { method: 'GET', credentials: 'include' })
            if (!res.ok) {
                toast.error('Failed to download template')
                return
            }

            const blob = await res.blob()
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.setAttribute('download', `product-template-${type}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success('Template downloaded successfully!')
        } catch (error) {
            console.error(error)
            toast.error('Error downloading template')
        }
    }

    // ===== Import & Front-end Validation =====
    const handleImport = async () => {
        if (!file) return

        const XLSX = await import('xlsx')
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as any[][]
        if (!data.length) return

        const [headerRow, ...bodyRows] = data
        setHeaders(headerRow as string[])

        const validatedRows = bodyRows.map((row) => {
            const rowObj: any = Object.fromEntries(
                headerRow.map((key, i) => [key, row[i]])
            )

            const errors: string[] = []
            if (!rowObj.Brand) errors.push('Brand')
            if (!rowObj.Season) errors.push('Season')
            if (!rowObj.Color) errors.push('Color')
            if (!rowObj.Category) errors.push('Category')
            if (!rowObj.Title) errors.push('Title')
            if (!rowObj.UPI_ID) errors.push('UPI ID')
            if (rowObj['Final Price'] > rowObj.Price) errors.push('Final Price')

            rowObj._errors = errors
            return rowObj
        })

        setRows(validatedRows)
    }

    // ===== Save imported file to backend using FormData =====
    const handleSaveData = async () => {
        if (!rows.length) return
        setLoading(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('file', file!)

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/import`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.data?.errors?.length) {
                    const errorsString = data.data.errors
                        .map((err: any) => `Row ${err.row}: ${err.message}`)
                        .join('\n')
                    setMessage(errorsString)
                    toast.error('Some rows have errors')
                } else if (data.data?.error) {
                    setMessage('Server Error: ' + data.data.error)
                    toast.error('Server Error')
                } else {
                    setMessage(data.message || 'Error saving products')
                    toast.error('Error saving products')
                }
                return
            }

            setMessage('Products saved successfully!')
            toast.success('Products saved successfully!')
            setFile(null)
            setRows([])
            setHeaders([])
        } catch (error) {
            console.error(error)
            setMessage('Network error while saving products')
            toast.error('Network error while saving products')
        } finally {
            setLoading(false)
        }
    }

    // ===== Cancel and go back to file selection =====
    const handleCancelImport = () => {
        setFile(null)
        setRows([])
        setHeaders([])
        setMessage(null)
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
            {/* ===== Header ===== */}
            <Card className="mb-6">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Import Products
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        Template
                    </button>
                </div>
            </Card>

            {/* ===== Template Modal ===== */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">Select Article Type</h2>

                        <select
                            value={selectedArticleType}
                            onChange={(e) => setSelectedArticleType(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        >
                            <option value="">Select Article Type</option>
                            {availableArticleTypes.map((type: any) => (
                                <option key={type._id} value={type.name}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={!selectedArticleType}
                                onClick={() => {
                                    handleDownloadTemplate(selectedArticleType)
                                    setIsModalOpen(false)
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== File Upload ===== */}
            {!rows.length && (
                <Card className="mb-6">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Upload File</h2>

                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                        >
                            <UploadCloud className="w-10 h-10 text-blue-600 mb-3" />
                            <p className="text-gray-700 font-medium">
                                Click to upload or drag & drop
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                CSV, XLS, XLSX (max 5MB)
                            </p>

                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv,.xls,.xlsx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>

                        {file && (
                            <div className="mt-4 flex items-center justify-between bg-gray-50 border rounded-lg p-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setFile(null)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={handleCancelImport}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!file}
                                onClick={handleImport}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                            >
                                Import File
                            </button>
                        </div>
                    </div>
                </Card>
            )}

            {/* ===== Data Preview ===== */}
            {rows.length > 0 && (
                <Card className="mb-6">
                    <div className="p-4 overflow-auto">
                        <h2 className="text-lg font-semibold mb-4">
                            Imported Data Preview
                        </h2>

                        <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    {headers.map((h, i) => (
                                        <th
                                            key={i}
                                            className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr
                                        key={i}
                                        className={
                                            row._errors?.length ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                                        }
                                    >
                                        {headers.map((key, j) => (
                                            <td
                                                key={j}
                                                className={`px-4 py-2 text-sm border-b ${row._errors?.includes(key)
                                                    ? 'text-red-600 font-semibold'
                                                    : ''
                                                    }`}
                                            >
                                                {row[key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ===== Buttons ===== */}
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={handleCancelImport}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleSaveData}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Data'}
                            </button>
                        </div>

                        {message && (
                            <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{message}</p>
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}

export default Page
