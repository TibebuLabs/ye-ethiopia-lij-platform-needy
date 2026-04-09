/**
 * Force-download a file from a URL by fetching it as a blob.
 * Works around the browser's cross-origin restriction on <a download>.
 */
export async function downloadFile(url: string, filename?: string): Promise<void> {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Download failed')
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename ?? url.split('/').pop() ?? 'download'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(objectUrl)
}
