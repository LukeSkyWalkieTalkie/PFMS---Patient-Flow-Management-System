'use client'

import { useState } from 'react'
import { Section, Visit, Bed } from '@/types'
import { SectionLayoutConfig } from '@/types/database'
import { ACTIVE_STATUSES } from '@/lib/constants'
import BedTile from './BedTile'
import BedPatientModal from './BedPatientModal'

export default function SectionGrid({
  section,
  beds,
  activeVisits,
}: {
  section: Section
  beds: Bed[]
  activeVisits: Visit[]
}) {
  const [selectedBed, setSelectedBed] = useState<string | null>(null)

  const config = section.layout_config as SectionLayoutConfig
  if (!config || !config.beds) return null

  // Map beds and visits by bed_number
  const bedsMap: Record<string, Bed> = {}
  beds.forEach((b) => { bedsMap[b.bed_number] = b })

  const visitsByBedId: Record<string, Visit> = {}
  activeVisits.forEach((v) => {
    if (v.current_bed_id && ACTIVE_STATUSES.includes(v.visit_status)) {
      visitsByBedId[v.current_bed_id] = v
    }
  })

  const selectedVisit = selectedBed
    ? visitsByBedId[bedsMap[selectedBed]?.id] || null
    : null

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{section.name}</h3>
      {section.description && (
        <p className="mb-3 text-sm text-gray-500">{section.description}</p>
      )}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${config.columns}, minmax(80px, 1fr))`,
          gridTemplateRows: `repeat(${config.rows}, minmax(80px, 1fr))`,
        }}
      >
        {config.beds.map((bedConfig) => {
          const bed = bedsMap[bedConfig.bed_number]
          const visit = bed ? visitsByBedId[bed.id] || null : null
          return (
            <BedTile
              key={bedConfig.bed_number}
              bedNumber={bedConfig.bed_number}
              visit={visit}
              style={{
                gridColumn: bedConfig.gridColumn,
                gridRow: bedConfig.gridRow,
              }}
              onClick={() => setSelectedBed(bedConfig.bed_number)}
            />
          )
        })}
      </div>

      <BedPatientModal
        visit={selectedVisit}
        bedNumber={selectedBed || ''}
        isOpen={!!selectedBed}
        onClose={() => setSelectedBed(null)}
      />
    </div>
  )
}
