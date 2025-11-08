import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Package, Plus, Minus, Trash2, PlusCircle, RefreshCw } from 'lucide-react';
import { InventoryItem } from './data/inventoryData';
import { AddProductDialog } from './AddProductDialog';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';

export function InventoryList({ accessToken }: { accessToken: string }) {
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = inventory.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const fetchProducts = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    try {
      const data = await api.products.getAll(accessToken);
      setInventory(data.products || []);
    } catch (error: any) {
      toast.error('Error al cargar productos', { description: error.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const getStatus = (qty: number, min: number) => {
    if (qty === 0) return { label: 'Sin stock', variant: 'destructive' as const };
    if (qty <= min) return { label: 'Stock bajo', variant: 'secondary' as const };
    return { label: 'En stock', variant: 'default' as const };
  };

  const getBorder = (qty: number, min: number) => {
    if (qty === 0 || qty <= Math.ceil(min / 2)) return 'border-red-500 border-2';
    if (qty <= min) return 'border-yellow-500 border-2';
    return '';
  };

  const updateQty = async (id: string, change: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + change);
    setInventory(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    try {
      await api.products.update(accessToken, id, { quantity: newQty });
      toast.success('Cantidad actualizada');
    } catch (error) {
      toast.error('Error al actualizar');
      fetchProducts();
    }
  };

  const deleteItem = async (id: string) => {
    const original = [...inventory];
    setInventory(prev => prev.filter(i => i.id !== id));
    try {
      await api.products.delete(accessToken, id);
      toast.success('Producto eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
      setInventory(original);
    }
  };

  const addItem = async (product: Omit<InventoryItem, 'id'>) => {
    try {
      const data = await api.products.create(accessToken, product);
      setInventory(prev => [...prev, data.product]);
      setShowDialog(false);
      toast.success('Producto añadido');
    } catch (error: any) {
      toast.error('Error al añadir', { description: error.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  const stats = {
    products: inventory.length,
    units: inventory.reduce((s, i) => s + i.quantity, 0),
    alerts: inventory.filter(i => i.quantity <= i.minStock).length
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button onClick={() => fetchProducts(true)} size="icon" variant="outline" disabled={refreshing}>
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
        <Button onClick={() => setShowDialog(true)} size="icon">
          <PlusCircle className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { value: stats.products, label: 'Productos', color: 'text-blue-600' },
          { value: stats.units, label: 'Unidades', color: 'text-green-600' },
          { value: stats.alerts, label: 'Alertas', color: 'text-orange-600' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-3 text-center">
              <div className={stat.color}>{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? filtered.map(item => {
          const status = getStatus(item.quantity, item.minStock);
          return (
            <Card key={item.id} className={getBorder(item.quantity, item.minStock)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="text-gray-500">Cantidad:</div>
                  <div>{item.quantity} unidades</div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => updateQty(item.id, -1)} disabled={item.quantity === 0} className="flex-1">
                    <Minus className="w-4 h-4 mr-1" />Quitar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => updateQty(item.id, 1)} className="flex-1">
                    <Plus className="w-4 h-4 mr-1" />Añadir
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">{search ? 'No se encontraron productos' : 'No hay productos en el inventario'}</p>
              {!search && <Button className="mt-4" onClick={() => setShowDialog(true)}><PlusCircle className="w-4 h-4 mr-2" />Añadir primer producto</Button>}
            </CardContent>
          </Card>
        )}
      </div>

      <AddProductDialog open={showDialog} onOpenChange={setShowDialog} onAddProduct={addItem} />
    </div>
  );
}
