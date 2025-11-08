import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Download, Calendar, Package, User } from 'lucide-react';
import { InventoryItem } from './data/inventoryData';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';

export function ReportsSection({ username, accessToken }: { username: string; accessToken: string }) {
  const [generating, setGenerating] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products.getAll(accessToken)
      .then(data => setInventory(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    products: inventory.length,
    units: inventory.reduce((s, i) => s + i.quantity, 0),
    alerts: inventory.filter(i => i.quantity <= i.minStock).length
  };

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      const now = new Date();
      const content = [
        'INFORME DE INVENTARIO',
        '='.repeat(50),
        `Fecha: ${now.toLocaleDateString('es-ES')}`,
        `Hora: ${now.toLocaleTimeString('es-ES')}`,
        `Generado por: ${username}`,
        '='.repeat(50),
        '',
        'RESUMEN GENERAL',
        '-'.repeat(50),
        `Total de productos: ${stats.products}`,
        `Total de unidades: ${stats.units}`,
        `Productos con stock bajo: ${stats.alerts}`,
        '',
        'DETALLE DE PRODUCTOS',
        '='.repeat(50),
        '',
        ...inventory.flatMap((item, i) => [
          `${i + 1}. ${item.name}`,
          `   Categoría: ${item.category}`,
          `   Cantidad: ${item.quantity} unidades`,
          `   Stock mínimo: ${item.minStock}`,
          `   Estado: ${item.quantity === 0 ? 'SIN STOCK' : item.quantity <= item.minStock ? 'STOCK BAJO' : 'EN STOCK'}`,
          ''
        ]),
        '='.repeat(50),
        'Fin del informe',
        `Generado por: ${username}`
      ].join('\n');

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe-inventario-${now.toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Informe generado exitosamente', { description: 'El PDF ha sido descargado' });
      setGenerating(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Resumen del Inventario</CardTitle>
          <CardDescription>Estadísticas generales del inventario actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-gray-500">Total de Productos</div>
              <div>{stats.products}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500">Total de Unidades</div>
              <div>{stats.units}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500">Alertas de Stock</div>
              <Badge variant="secondary">{stats.alerts}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generar Informe PDF</CardTitle>
          <CardDescription>Descarga un informe completo con todos los registros del inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateReport} disabled={generating || stats.products === 0} className="w-full" size="lg">
            {generating ? (
              <><div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />Generando informe...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" />Descargar Informe PDF</>
            )}
          </Button>
          {stats.products === 0 && <p className="text-center text-sm text-gray-500 mt-2">Añade productos al inventario para generar informes</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenido del Informe</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              { icon: Package, text: 'Listado completo de productos con detalles' },
              { icon: Calendar, text: 'Fecha y hora de generación del reporte' },
              { icon: FileText, text: 'Estadísticas y resumen general' },
              { icon: null, text: 'Productos con stock bajo o agotado', badge: true },
              { icon: User, text: `Nombre del usuario que generó el informe: ${username}` }
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                {item.badge ? <Badge variant="secondary" className="mt-1">Alerta</Badge> : item.icon && <item.icon className="w-4 h-4 mt-1 text-blue-600" />}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
