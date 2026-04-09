import { useState } from 'react'
import { FileText, ExternalLink, Download } from 'lucide-react'
import { downloadFile } from '../utils/download'
import toast from 'react-hot-toast'

interface DocLinkProps {
  url: string | null | undefined
  label: string
}

/**
 * Shared document link component with open + download buttons.
 * Uses blob-fetch download to work around cross-origin <a download> restrictions.
 */
export default function DocLink({ url, label }: DocLinkProps) {
  const [downloading, setDownloading] = useState(false)

  if (!url) return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
      <FileText size={14} /> <span>{label} — not uploaded</span>
    </div>
  )

  const filename = url.split('/').pop() ?? label
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
  const isPdf = filename.toLowerCase().endsWith('.pdf')

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadFile(url, filename)
    } catch {
      toast.error('Download failed — try opening the file directly')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="border border-green-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-green-50">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="text-green-600 flex-shrink-0" />
          <span className="text-xs font-medium text-green-800 truncate">{label}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
            title="Open"
          >
            <ExternalLink size={13} />
          </a>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="p-1 rounded-lg hover:bg-green-100 text-green-600 transition-colors disabled:opacity-50"
            title="Download"
          >
            <Download size={13} />
          </button>
        </div>
      </div>
      {isImage && <img src={url} alt={label} className="w-full max-h-40 object-contain bg-gray-50 p-2" />}
      {isPdf && (
        <div className="px-3 py-2 text-xs text-gray-500 bg-white">
          PDF ·{' '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
            Click to view
          </a>
        </div>
      )}
    </div>
  )
}
