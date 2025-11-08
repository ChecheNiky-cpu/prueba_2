export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
}

export const inventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop Dell XPS 15',
    category: 'Electrónica',
    quantity: 15,
    minStock: 5,
  },
  {
    id: '2',
    name: 'Mouse Logitech MX Master 3',
    category: 'Accesorios',
    quantity: 45,
    minStock: 10,
  },
  {
    id: '3',
    name: 'Teclado Mecánico RGB',
    category: 'Accesorios',
    quantity: 8,
    minStock: 10,
  },
  {
    id: '4',
    name: 'Monitor Samsung 27"',
    category: 'Electrónica',
    quantity: 0,
    minStock: 5,
  },
  {
    id: '5',
    name: 'Silla Ergonómica',
    category: 'Mobiliario',
    quantity: 22,
    minStock: 8,
  },
  {
    id: '6',
    name: 'Webcam HD 1080p',
    category: 'Accesorios',
    quantity: 30,
    minStock: 15,
  },
  {
    id: '7',
    name: 'Auriculares Bluetooth',
    category: 'Audio',
    quantity: 5,
    minStock: 10,
  },
  {
    id: '8',
    name: 'Disco Duro Externo 2TB',
    category: 'Almacenamiento',
    quantity: 18,
    minStock: 12,
  },
  {
    id: '9',
    name: 'Cable HDMI 2.1',
    category: 'Cables',
    quantity: 65,
    minStock: 20,
  },
  {
    id: '10',
    name: 'Tablet iPad Air',
    category: 'Electrónica',
    quantity: 12,
    minStock: 8,
  },
  {
    id: '11',
    name: 'Impresora Láser HP',
    category: 'Oficina',
    quantity: 6,
    minStock: 5,
  },
  {
    id: '12',
    name: 'Router WiFi 6',
    category: 'Redes',
    quantity: 3,
    minStock: 8,
  },
  {
    id: '13',
    name: 'Memoria USB 128GB',
    category: 'Almacenamiento',
    quantity: 50,
    minStock: 25,
  },
  {
    id: '14',
    name: 'Micrófono Condensador',
    category: 'Audio',
    quantity: 14,
    minStock: 10,
  },
  {
    id: '15',
    name: 'Base para Laptop',
    category: 'Accesorios',
    quantity: 28,
    minStock: 15,
  },
];
