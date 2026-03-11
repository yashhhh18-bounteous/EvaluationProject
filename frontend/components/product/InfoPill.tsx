export default function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#e8e3dd]">
      <div className="mt-0.5 text-[#c8622a] flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a7f78]">{label}</p>
        <p className="text-[13px] font-light text-[#0a0a0f] mt-0.5">{value}</p>
      </div>
    </div>
  )
}
