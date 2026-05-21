'use client'

import { useState } from "react"
import { updateDescriptionAndLearn } from "@/app/actions"
import { Check, Pencil, X } from "lucide-react"
import { toast } from "sonner"

export default function EditableDescription({ id, initialValue }: { id: string, initialValue: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (value === initialValue) return setIsEditing(false)
    setLoading(true)
    try {
      await updateDescriptionAndLearn(id, value)
      toast.success("Nome atualizado e regra de aprendizado criada!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Erro ao atualizar.")
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in duration-200">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          className="bg-zinc-950 border border-primary/50 text-sm font-bold text-zinc-200 px-2 py-1 rounded-lg outline-none w-full"
        />
        <button onClick={handleSave} disabled={loading} className="text-emerald-500 hover:text-emerald-400">
          <Check className="w-4 h-4" />
        </button>
        <button onClick={() => setIsEditing(false)} className="text-zinc-500">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
      <span className="font-bold text-zinc-200 truncate max-w-[180px] md:max-w-none">
        {value}
      </span>
      <Pencil className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}