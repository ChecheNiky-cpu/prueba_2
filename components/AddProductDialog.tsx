import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { InventoryItem } from './data/inventoryData';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: Omit<InventoryItem, 'id'>) => void;
}

export function AddProductDialog({ open, onOpenChange, onAddProduct }: AddProductDialogProps) {
  const [form, setForm] = useState({ name: '', category: '', quantity: '', minStock: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      name: form.name,
      category: form.category,
      quantity: parseInt(form.quantity) || 0,
      minStock: parseInt(form.minStock) || 0,
    });
    setForm({ name: '', category: '', quantity: '', minStock: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Producto</DialogTitle>
          <DialogDescription>Completa la información del producto para agregarlo al inventario.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre del Producto</Label>
            <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Laptop HP" required />
          </div>
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Input value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Electrónica" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input type="number" min="0" value={form.quantity} onChange={(e) => setForm(p => ({ ...p, quantity: e.target.value }))} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label>Stock Mínimo</Label>
              <Input type="number" min="0" value={form.minStock} onChange={(e) => setForm(p => ({ ...p, minStock: e.target.value }))} placeholder="5" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Añadir Producto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
