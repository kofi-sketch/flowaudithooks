'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { bulkCreateHooks, type BulkImportResult } from '@/lib/actions/hooks'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { ArrowLeft, FileText, Upload } from 'lucide-react'

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
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="animate-[slide-up_0.4s_ease-out]">
            <h1 className="text-[32px] font-semibold text-white mb-2">Bulk Import Hooks</h1>
            <p className="text-base text-[#a0a0a0]">
              Upload a CSV file to import multiple hooks at once
            </p>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
        </div>

        {/* CSV Format Info */}
        <div className="crm-card bg-[#2a2a2a] mb-6 animate-[slide-up_0.5s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}>
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            CSV Format
          </h3>
          <p className="text-sm text-[#a0a0a0] mb-4">
            Your CSV file should have one hook per row. You can use either format:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono font-medium text-white mb-2">Simple (single column):</p>
              <pre className="text-xs bg-[#2d2d2d] border border-[#353535] p-3 rounded-lg overflow-x-auto text-[#a0a0a0]">
text
Hook text here
Another hook here
              </pre>
            </div>
            <div>
              <p className="text-xs font-mono font-medium text-white mb-2">With headers:</p>
              <pre className="text-xs bg-[#2d2d2d] border border-[#353535] p-3 rounded-lg overflow-x-auto text-[#a0a0a0]">
text,notes
Hook text here,Optional note
Another hook here,Another note
              </pre>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="crm-card border-2 border-dashed border-[#404040] hover:border-[#505050] transition-colors animate-[slide-up_0.5s_ease-out_0.2s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}>
          <div className="text-center py-8">
            <Upload className="w-16 h-16 text-[#a0a0a0] mx-auto mb-6" />
            <div className="mt-4">
              <label htmlFor="file-upload">
                <Button variant="primary" size="lg" className="cursor-pointer">
                  Choose CSV File
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="mt-4 text-sm font-medium text-[#a0a0a0]">
              {fileName || 'CSV files only'}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      {parsedData.length > 0 && !results && (
        <div className="crm-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Preview</h2>
              <p className="text-sm text-[#a0a0a0] mt-1">
                {validCount} valid · {invalidCount} invalid
                {parsedData.length > 100 && ` (showing first 100 of ${parsedData.length})`}
              </p>
            </div>
            <Button
              onClick={handleImport}
              disabled={importing || validCount === 0}
              variant="primary"
              size="md"
            >
              {importing ? 'Importing...' : `Import ${validCount} Hooks`}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#353535]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                    Row
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                    Hook Text
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#353535]">
                {parsedData.slice(0, 100).map((hook, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-[#2d2d2d]' : 'bg-[#2a2a2a]'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {hook.row}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hook.status === 'valid' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#353535] border border-[#404040] text-white">
                          ✓ Valid
                        </span>
                      )}
                      {hook.status === 'invalid' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#353535] border border-[#404040] text-[#a0a0a0]">
                          ✗ {hook.reason}
                        </span>
                      )}
                      {hook.status === 'duplicate' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#353535] border border-[#404040] text-[#a0a0a0]">
                          ⚠ Duplicate
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
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
        <div className="crm-card">
          <h2 className="text-lg font-semibold text-white mb-4">Import Results</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2a2a2a] border border-[#353535] rounded-lg p-4">
              <div className="text-3xl font-bold text-white">{results.created}</div>
              <div className="text-sm text-[#a0a0a0]">Hooks Created</div>
            </div>

            <div className="bg-[#2a2a2a] border border-[#353535] rounded-lg p-4">
              <div className="text-3xl font-bold text-white">{results.skipped}</div>
              <div className="text-sm text-[#a0a0a0]">Duplicates Skipped</div>
            </div>

            <div className="bg-[#2a2a2a] border border-[#353535] rounded-lg p-4">
              <div className="text-3xl font-bold text-white">{results.errors.length}</div>
              <div className="text-sm text-[#a0a0a0]">Errors</div>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div className="border-t border-[#353535] pt-4">
              <h3 className="font-medium text-white mb-2">Errors:</h3>
              <div className="space-y-2">
                {results.errors.map((error, index) => (
                  <div key={index} className="text-sm bg-[#2a2a2a] border border-[#353535] p-3 rounded-lg">
                    <span className="font-medium text-white">Row {error.row}:</span>{' '}
                    <span className="text-[#a0a0a0]">{error.reason}</span>
                    {error.text && (
                      <div className="text-xs text-[#6b6b6b] mt-1 truncate">{error.text}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Link href="/admin">
              <Button variant="primary" size="md">
                View All Hooks
              </Button>
            </Link>
            <Button
              onClick={() => {
                setResults(null)
                setParsedData([])
                setFileName('')
              }}
              variant="ghost"
              size="md"
            >
              Import Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
