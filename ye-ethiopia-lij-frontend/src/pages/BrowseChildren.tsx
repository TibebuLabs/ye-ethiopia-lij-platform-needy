import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { listChildren } from '../api/children'
import { mediaUrl } from '../api/axios'
import { Search, MapPin, User } from 'lucide-react'
import type { ChildProfile } from '../types'

export default function BrowseChildren() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchChildren = (overrides?: { search?: string; gender?: string }) => {
    setLoading(true)
    const params: Record<string, string> = {}
    const s = overrides?.search !== undefined ? overrides.search : search
    const g = overrides?.gender !== undefined ? overrides.gender : gender
    if (s) params.search = s
    if (g) params.gender = g
    listChildren(params)
      .then((r) => {
        const data = r.data
        const list: ChildProfile[] = Array.isArray(data) ? data : data.results
        list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
        setChildren(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchChildren({ search: value }), 300)
  }

  const handleGenderChange = (value: string) => {
    setGender(value)
    fetchChildren({ gender: value })
  }

  useEffect(() => { fetchChildren() }, [])

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Children</h1>
          <p className="text-gray-500 text-sm">Find a child to sponsor and change their life</p>
        </div>
      </div>

      <div className="card mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Search by name, location..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <select className="input-field sm:w-40" value={gender} onChange={(e) => handleGenderChange(e.target.value)}>
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : children.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No children found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {children.map((child) => (
            <div
              key={child.id}
              onClick={() => navigate(`/children/${child.id}`)}
              className="card cursor-pointer hover:shadow-md hover:border-green-200 transition-all duration-200 p-0 overflow-hidden"
            >
              {mediaUrl(child.photo) ? (
                <img src={mediaUrl(child.photo)!} alt={child.full_name} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-green-50 flex items-center justify-center">
                  <User size={48} className="text-green-300" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">{child.full_name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{child.age} years · {child.gender}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <MapPin size={12} />
                  <span className="truncate">{child.location}</span>
                </div>
                <div className="mt-3">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    {child.vulnerability_status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
