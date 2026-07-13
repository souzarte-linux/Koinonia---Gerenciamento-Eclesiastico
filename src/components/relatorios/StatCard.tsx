import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export default function StatCard({ title, value, icon: Icon, description, trend, trendValue }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        
        {(description || trendValue) && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            {trendValue && (
              <span className={`font-medium ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {trend === 'up' && '↑ '}
                {trend === 'down' && '↓ '}
                {trendValue}
              </span>
            )}
            {description && <span className="text-gray-500">{description}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
