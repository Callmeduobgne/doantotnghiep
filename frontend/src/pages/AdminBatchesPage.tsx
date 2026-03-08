import { useEffect, useState } from 'react'
import {
  Package, RefreshCw, Scale, Sprout, Clock, CheckCircle2,
  TrendingUp, Users, Leaf, BarChart3,
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { adminApi, type AdminBatch, type Agent } from '../api/client'

function StatCard({ icon, label, value, sub, bg, text }: {
  icon: React.ReactNode; label: string; value: string | number
  sub?: string; bg: string; text: string
}) {
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className={`text-2xl font-extrabold ${text}`}>{value}</div>
      <div className="text-sm font-medium text-gray-600 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<AdminBatch[]>([])
  const [users, setUsers] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([adminApi.listBatches(), adminApi.listUsers()])
      .then(([b, u]) => { setBatches(b.data); setUsers(u.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const packaged   = batches.filter((b) => b.status === 'packaged').length
  const processing = batches.filter((b) => b.status === 'processing').length
  const growing    = batches.filter((b) => b.status === 'growing').length
  const totalWeight = batches.reduce((s, b) => s + b.weightGram, 0)
  const agents     = users.filter((u) => u.role !== 'admin').length

  // Tổng hợp số lô theo từng đại lý
  const farmMap: Record<string, { farm: string; agent: string; count: number; weight: number }> = {}
  for (const b of batches) {
    const key = b.agentFarm || b.agentName || 'Không xác định'
    if (!farmMap[key]) farmMap[key] = { farm: b.agentFarm, agent: b.agentName, count: 0, weight: 0 }
    farmMap[key].count++
    farmMap[key].weight += b.weightGram
  }
  const topFarms = Object.values(farmMap).sort((a, b) => b.count - a.count).slice(0, 5)

  // Phân bổ loại chè
  const teaMap: Record<string, number> = {}
  for (const b of batches) {
    const t = b.teaType || 'Khác'
    teaMap[t] = (teaMap[t] || 0) + 1
  }
  const teaTypes = Object.entries(teaMap).sort((a, b) => b[1] - a[1]).slice(0, 6)

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-violet-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Tổng quan hệ thống</h1>
          </div>
          <p className="text-sm text-gray-500">Thống kê toàn bộ hoạt động trên nền tảng</p>
        </div>
        <button onClick={load} disabled={loading} className="btn-ghost">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3" />
              <div className="h-6 w-16 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={<Package className="w-5 h-5 text-blue-500" />}
              label="Tổng lô chè" value={batches.length}
              sub="Toàn hệ thống"
              bg="bg-blue-50" text="text-blue-700"
            />
            <StatCard
              icon={<Users className="w-5 h-5 text-violet-500" />}
              label="Số đại lý" value={agents}
              sub="Tài khoản đang hoạt động"
              bg="bg-violet-50" text="text-violet-700"
            />
            <StatCard
              icon={<Scale className="w-5 h-5 text-teal-500" />}
              label="Tổng sản lượng" value={`${(totalWeight / 1000).toFixed(1)} kg`}
              sub={`${totalWeight.toLocaleString()} gram`}
              bg="bg-teal-50" text="text-teal-700"
            />
            <StatCard
              icon={<Sprout className="w-5 h-5 text-emerald-500" />}
              label="Đang trồng" value={growing}
              bg="bg-emerald-50" text="text-emerald-700"
            />
            <StatCard
              icon={<Clock className="w-5 h-5 text-amber-500" />}
              label="Đang chế biến" value={processing}
              bg="bg-amber-50" text="text-amber-700"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5 text-teal-500" />}
              label="Đã đóng gói" value={packaged}
              sub={batches.length > 0 ? `${((packaged / batches.length) * 100).toFixed(0)}% hoàn thành` : undefined}
              bg="bg-teal-50" text="text-teal-700"
            />
          </div>

          {/* Progress bar trạng thái */}
          {batches.length > 0 && (
            <div className="card p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phân bổ trạng thái</h2>
              </div>
              <div className="flex rounded-full overflow-hidden h-4 mb-3 gap-px">
                {growing > 0 && (
                  <div
                    className="bg-emerald-400 transition-all"
                    style={{ width: `${(growing / batches.length) * 100}%` }}
                  />
                )}
                {processing > 0 && (
                  <div
                    className="bg-amber-400 transition-all"
                    style={{ width: `${(processing / batches.length) * 100}%` }}
                  />
                )}
                {packaged > 0 && (
                  <div
                    className="bg-teal-400 transition-all"
                    style={{ width: `${(packaged / batches.length) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />Đang trồng ({growing})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Chế biến ({processing})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />Đóng gói ({packaged})</span>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top đại lý */}
            {topFarms.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Đại lý có nhiều lô nhất</h2>
                </div>
                <div className="space-y-3">
                  {topFarms.map((f, i) => (
                    <div key={f.farm} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate">{f.farm || f.agent || 'Không xác định'}</div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-emerald-400 h-1.5 rounded-full transition-all"
                            style={{ width: `${(f.count / (topFarms[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-700 shrink-0">{f.count} lô</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phân bổ loại chè */}
            {teaTypes.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-teal-500" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phân bổ loại chè</h2>
                </div>
                <div className="space-y-3">
                  {teaTypes.map(([name, count]) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700 font-medium truncate">{name}</span>
                          <span className="text-sm font-bold text-gray-600 shrink-0 ml-2">{count} lô</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-teal-400 h-1.5 rounded-full transition-all"
                            style={{ width: `${(count / (teaTypes[0]?.[1] || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  )
}
