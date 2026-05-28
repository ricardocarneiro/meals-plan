import { useState } from "react";
import { Plus, Trash2, Save, X, Loader2, Utensils } from "lucide-react";
import { brand } from "../theme/tokens";
import { useMealTemplates, type MealTemplate, type MealTemplateInput } from "../hooks/useMealTemplates";
import { ConfirmModal } from "../components/shared/ConfirmModal";

const COMMON_ICONS = ["🍓", "🥩", "🍞", "🥗", "🥚", "🍎", "🥕", "🍗", "🐟", "🥛", "🧀", "🥑", "🍌", "🥜", "🍝"];

type Props = { userId: string };

export function MealPlanPage({ userId }: Props) {
  const { templates, loading, addTemplate, updateTemplate, deleteTemplate } = useMealTemplates(userId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
               style={{ background: brand.primarySoft }}>
            <Utensils size={24} style={{ color: brand.primary }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: brand.ink }}>Meal Plan</h1>
            <p className="text-sm" style={{ color: brand.inkSoft }}>
              Your daily template. New meals are created from this every morning.
            </p>
          </div>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:shadow-lg shadow-emerald-300/40"
                  style={{ background: brand.primary }}>
            <Plus size={16} /> Add meal
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 overflow-hidden">
        {loading && (
          <div className="py-16 flex items-center justify-center" style={{ color: brand.inkSoft }}>
            <Loader2 size={20} className="animate-spin mr-2" /> Loading template…
          </div>
        )}

        {!loading && templates.length === 0 && !adding && (
          <div className="py-16 text-center">
            <p className="text-sm mb-4" style={{ color: brand.inkSoft }}>
              No meals in your template yet.
            </p>
            <button onClick={() => setAdding(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{ background: brand.primary }}>
              <Plus size={16} /> Add your first meal
            </button>
          </div>
        )}

        {!loading && (templates.length > 0 || adding) && (
          <div className="p-6">
            <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wider pb-3 border-b border-gray-100"
                 style={{ color: brand.inkSoft }}>
              <div className="col-span-3">Category</div>
              <div className="col-span-4">Food</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {templates.map((t) => (
              editingId === t.id
                ? <EditRow key={t.id} template={t}
                           onSave={async (input) => { await updateTemplate(t.id, input); setEditingId(null); }}
                           onCancel={() => setEditingId(null)} />
                : <ReadRow key={t.id} template={t}
                           onEdit={() => setEditingId(t.id)}
                           onDelete={() => setConfirmDelete(t.id)} />
            ))}

            {adding && (
              <EditRow
                onSave={async (input) => { await addTemplate(input); setAdding(false); }}
                onCancel={() => setAdding(false)} />
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmDelete !== null}
        title="Delete meal from template?"
        message="This will be removed from your daily plan. Today's meals (if already created) will stay until you reset them."
        confirmLabel="Delete"
        onConfirm={async () => {
          if (confirmDelete) await deleteTemplate(confirmDelete);
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

// ───────────── Read row ─────────────
function ReadRow({ template, onEdit, onDelete }:
  { template: MealTemplate; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="grid grid-cols-12 items-center py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition rounded-lg -mx-2 px-2">
      <div className="col-span-3 flex items-center gap-2">
        <span className="text-lg">{template.icon ?? "🍽️"}</span>
        <span className="text-sm font-medium" style={{ color: brand.ink }}>{template.category}</span>
      </div>
      <div className="col-span-4 text-sm" style={{ color: brand.ink }}>{template.food}</div>
      <div className="col-span-3 text-sm" style={{ color: brand.inkSoft }}>{template.amount ?? "—"}</div>
      <div className="col-span-2 flex justify-end gap-2">
        <button onClick={onEdit}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50"
                style={{ color: brand.inkSoft }}>Edit</button>
        <button onClick={onDelete}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ───────────── Edit / Add row ─────────────
function EditRow({ template, onSave, onCancel }:
  { template?: MealTemplate; onSave: (input: MealTemplateInput) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<MealTemplateInput>({
    category: template?.category ?? "",
    icon:     template?.icon     ?? "🍽️",
    food:     template?.food     ?? "",
    amount:   template?.amount   ?? "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.category.trim() || !form.food.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-12 items-center gap-2 py-3 border-b border-gray-50 last:border-0">
      <div className="col-span-3 flex items-center gap-2">
        <select value={form.icon ?? "🍽️"} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="px-2 py-2 rounded-lg border border-gray-200 text-base outline-none focus:border-emerald-300">
          {COMMON_ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
               placeholder="Category" required
               className="flex-1 min-w-0 px-2 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" />
      </div>
      <div className="col-span-4">
        <input value={form.food} onChange={(e) => setForm({ ...form, food: e.target.value })}
               placeholder="e.g. Raspberries" required
               className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" />
      </div>
      <div className="col-span-3">
        <input value={form.amount ?? ""} onChange={(e) => setForm({ ...form, amount: e.target.value })}
               placeholder="e.g. 1 Cup"
               className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" />
      </div>
      <div className="col-span-2 flex justify-end gap-1.5">
        <button onClick={onCancel} disabled={saving}
                className="px-2.5 py-2 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-60"
                style={{ color: brand.inkSoft }}>
          <X size={14} />
        </button>
        <button onClick={submit} disabled={saving || !form.category.trim() || !form.food.trim()}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-white text-xs font-semibold hover:shadow-md transition disabled:opacity-60"
                style={{ background: brand.primary }}>
          <Save size={14} /> {saving ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}