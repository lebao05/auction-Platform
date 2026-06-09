import React, { useState, useMemo, Fragment } from "react";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Circle, Target } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useAdmin } from "../../../contexts/AdminContext";

export function AdminCategories() {
    const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: "", parentId: null });
    const [expandedRows, setExpandedRows] = useState(new Set());

    const hierarchy = useMemo(() => {
        const parents = categories.filter(c => !c.parent);
        return parents.map(parent => ({
            ...parent,
            children: categories.filter(c => c.parent?.id === parent.id)
        }));
    }, [categories]);

    const toggleRow = (id) => {
        const newExpanded = new Set(expandedRows);
        expandedRows.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
        setExpandedRows(newExpanded);
    };

    const openAddDialog = (parentId = null) => {
        setEditingId(null);
        setFormData({ name: "", parentId: parentId });
        setDialogOpen(true);
    };

    const openEditDialog = (category) => {
        setEditingId(category.id);
        setFormData({ name: category.name, parentId: category.parent?.id || null });
        setDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) return;
        editingId ? updateCategory({ id: editingId, ...formData }) : addCategory(formData);
        setDialogOpen(false);
    };

    return (
        <div className="p-8 bg-white min-h-screen text-slate-800">
            {/* Header hiện đại */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900">DANH MỤC</h2>
                    <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full"></div>
                </div>
                <Button 
                    className="bg-slate-900 hover:bg-blue-600 text-white rounded-full px-6 transition-all duration-300 shadow-xl shadow-slate-200"
                    onClick={() => openAddDialog()}
                >
                    <Plus className="mr-2 h-4 w-4" /> Thêm cấp cao nhất
                </Button>
            </div>

            <div className="max-w-5xl">
                {hierarchy.map((parent) => (
                    <div key={parent.id} className="mb-4">
                        {/* Parent Row - Thiết kế dạng Capsule */}
                        <div className={`
                            group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
                            ${expandedRows.has(parent.id) ? 'border-blue-100 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-blue-200'}
                        `}>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => toggleRow(parent.id)}
                                    className={`p-2 rounded-xl transition-all ${expandedRows.has(parent.id) ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {expandedRows.has(parent.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                                
                                <div>
                                    <span className="text-lg font-bold tracking-tight text-slate-700">{parent.name}</span>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{parent.children.length} danh mục con</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button onClick={() => openAddDialog(parent.id)} className="p-2.5 bg-white text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                    <Plus className="h-4 w-4" />
                                </button>
                                <button onClick={() => openEditDialog(parent)} className="p-2.5 bg-white text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteCategory(parent.id)} className="p-2.5 bg-white text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Children Container với đường dẫn (Connector) */}
                        {expandedRows.has(parent.id) && (
                            <div className="ml-8 mt-2 space-y-2 relative border-l-2 border-dashed border-blue-100 pl-8 py-2">
                                {parent.children.map((child, index) => (
                                    <div key={child.id} className="relative group/child flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all">
                                        {/* Cành nối ngang */}
                                        <div className="absolute -left-[32px] w-[32px] h-[2px] bg-blue-100"></div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-blue-400 ring-4 ring-blue-50"></div>
                                            <span className="font-medium text-slate-600">{child.name}</span>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover/child:opacity-100 transition-all">
                                            <button onClick={() => openEditDialog(child)} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit className="h-3.5 w-3.5" /></button>
                                            <button onClick={() => deleteCategory(child.id)} className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                                        </div>
                                    </div>
                                ))}
                                {parent.children.length === 0 && (
                                    <p className="text-sm text-slate-400 italic">Chưa có danh mục con</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal tối giản */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full p-8 animate-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-xl font-black mb-6 text-slate-900 uppercase tracking-tighter">
                            {editingId ? "Cập nhật" : "Tạo mới"}
                        </h3>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tên danh mục</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 px-0 py-3 border-b-2 border-slate-100 focus:border-blue-600 outline-none transition-all text-lg font-bold placeholder:text-slate-200"
                                    placeholder="Ví dụ: Điện thoại..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vị trí phân cấp</label>
                                <select
                                    className="w-full mt-1 py-2 bg-transparent border-none font-bold text-blue-600 outline-none cursor-pointer"
                                    value={formData.parentId || ""}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                                >
                                    <option value="">DANH MỤC GỐC</option>
                                    {categories.filter(c => !c.parent && c.id !== editingId).map(c => (
                                        <option key={c.id} value={c.id}>Thuộc {c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-10">
                            <button onClick={() => setDialogOpen(false)} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Đóng</button>
                            <Button onClick={handleSubmit} className="flex-[2] bg-blue-600 hover:bg-slate-900 text-white rounded-2xl py-6 font-bold transition-all shadow-lg shadow-blue-100">
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}