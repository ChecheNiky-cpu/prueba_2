import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { InventoryList } from './InventoryList';
import { ReportsSection } from './ReportsSection';
import { Button } from './ui/button';
import { Package, FileText, LogOut } from 'lucide-react';

interface InventoryDashboardProps {
  onLogout: () => void;
  username: string;
  accessToken: string;
}

export function InventoryDashboard({ onLogout, username, accessToken }: InventoryDashboardProps) {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            <div>
              <h1>Inventario</h1>
              <p className="text-xs text-blue-100">{username}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Informes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-0">
            <InventoryList accessToken={accessToken} />
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <ReportsSection username={username} accessToken={accessToken} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
