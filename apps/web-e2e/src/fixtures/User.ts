export interface User {
  id: number;
  name: string;
  role: 'read' | 'write' | 'admin'
}
