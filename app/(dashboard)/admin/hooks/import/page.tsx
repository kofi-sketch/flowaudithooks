'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { bulkCreateHooks, type BulkImportResult } from '@/lib/actions/hooks'
import Link from 'next/link'

interface ParsedHook {
  text: string
  status: 'valid' | 'duplicate' | 'invalid'
  reason?: string
  row: number
}

export default function ImportHooksPage() {
  const [parsedData, setParsedData] = useState<ParsedHook[]>([])
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<BulkImportResult | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setResults(null)

    Papa.parse(file, {
      complete: (results) => {
        const hooks: ParsedHook[] = []
        const data = results.data as any[]

        // Try to find the text column
        let textColumnIndex = 0
        const firstRow = data[0]

        if (Array.isArray(firstRow)) {
          // Check if first row might be headers
          const possibleHeaders = ['text', 'hook', 'hook_text', 'hooks']
          const headerIndex = firstRow.findIndex((cell: any) =>
            possibleHeaders.includes(String(cell).toLowerCase().trim())
          )

          if (headerIndex !== -1) {
            textColumnIndex = headerIndex
            data.shift() // Remove header row
          }
        } else if (typeof firstRow === 'object') {
          // Object format (with headers)
          const possibleKeys = ['text', 'hook', 'hook_text', 'hooks']
          const textKey = Object.keys(firstRow).find(key =>
            possibleKeys.includes(key.toLowerCase().trim())
          ) || Object.keys(firstRow)[0]

          data.forEach((row, index) => {
            const text = String(row[textKey] || '').trim()

            if (!text) {
              hooks.push({
                text: '',
                status: 'invalid',
                reason: 'Empty text',
                row: index + 1
              })
              return
            }

            if (text.length > 1000) {
              hooks.push({
                text,
                status: 'invalid',
                reason: 'Text too long (max 1000 chars)',
                row: index + 1
              })
              return
            }

            hooks.push({
              text,
              status: 'valid',
              row: index + 1
            })
          })

          setParsedData(hooks)
          return
        }

        // Array format
        data.forEach((row, index) => {
          if (!Array.isArray(row)) return

          const text = String(row[textColumnIndex] || '').trim()

          if (!text) {
            hooks.push({
              text: '',
              status: 'invalid',
              reason: 'Empty text',
              row: index + 1
            })
            return
          }

          if (text.length > 1000) {
            hooks.push({
              text,
              status: 'invalid',
              reason: 'Text too long (max 1000 chars)',
              row: index + 1
            })
            return
          }

          hooks.push({
            text,
            status: 'valid',
            row: index + 1
          })
        })

        setParsedData(hooks)
      },
      header: false,
      skipEmptyLines: true,
      error: (error) => {
        console.error('Parse error:', error)
        alert('Error parsing file: ' + error.message)
      }
    })
  }

  const handleImport = async () => {
    setImporting(true)

    const validHooks = parsedData
      .filter(h => h.status === 'valid')
      .map(h => ({ text: h.text }))

    const result = await bulkCreateHooks(validHooks)
    setResults(result)
    setImporting(false)

    if (result.success) {
      // Clear the parsed data after successful import
      setParsedData([])
      setFileName('')
    }
  }

  const validCount = parsedData.filter(h => h.status === 'valid').length
  const invalidCount = parsedData.filter(h => h.status === 'invalid').length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bulk Import Hooks</h1>
            <p className="mt-2 text-gray-600">
              Upload a CSV file to import multiple hooks at once
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Back to All Hooks
          </Link>
        </div>

        {/* CSV Format Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">CSV Format</h3>
          <p className="text-sm text-blue-800 mb-2">
            Your CSV file should have one hook per row. You can use either format:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono text-blue-900 mb-1">Simple (single column):</p>
              <pre className="text-xs bg-white p-2 rounded border border-blue-200 overflow-x-auto">
text
Hook text here
Another hook here
              </pre>
            </div>
            <div>
              <p className="text-xs font-mono text-blue-900 mb-1">With headers:</p>
              <pre className="text-xs bg-white p-2 rounded border border-blue-200 overflow-x-auto">
text,notes
Hook text here,Optional note
Another hook here,Another note
              </pre>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Choose CSV File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {fileName || 'CSV files only'}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      {parsedData.length > 0 && !results && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {validCount} valid · {invalidCount} invalid
                  {parsedData.length > 100 && ` (showing first 100 of ${parsedData.length})`}
                </p>
              </div>
              <button
                onClick={handleImport}
                disabled={importing || validCount === 0}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {importing ? 'Importing...' : `Import ${validCount} Hooks`}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Row
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hook Text
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedData.slice(0, 100).map((hook, index) => (
                  <tr
                    key={index}
                    className={
                      hook.status === 'valid'
                        ? 'bg-green-50'
                        : hook.status === 'invalid'
                        ? 'bg-red-50'
                        : 'bg-yellow-50'
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {hook.row}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hook.status === 'valid' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Valid
                        </span>
                      )}
                      {hook.status === 'invalid' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          ✗ {hook.reason}
                        </span>
                      )}
                      {hook.status === 'duplicate' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⚠ Duplicate
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hook.text || '(empty)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {results && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Results</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-3xl font-bold text-green-700">{results.created}</div>
              <div className="text-sm text-green-600">Hooks Created</div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-700">{results.skipped}</div>
              <div className="text-sm text-yellow-600">Duplicates Skipped</div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-3xl font-bold text-red-700">{results.errors.length}</div>
              <div className="text-sm text-red-600">Errors</div>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Errors:</h3>
              <div className="space-y-2">
                {results.errors.map((error, index) => (
                  <div key={index} className="text-sm bg-red-50 p-3 rounded border border-red-200">
                    <span className="font-medium text-red-900">Row {error.row}:</span>{' '}
                    <span className="text-red-700">{error.reason}</span>
                    {error.text && (
                      <div className="text-xs text-red-600 mt-1 truncate">{error.text}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Link
              href="/admin"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              View All Hooks
            </Link>
            <button
              onClick={() => {
                setResults(null)
                setParsedData([])
                setFileName('')
              }}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Import Another File
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
