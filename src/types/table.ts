// types/Table.ts
export interface Table {
  id?: number;
  name: string;
  areaId: number;
  active: boolean;
  qrCodeUrl: string;
}
  
  export interface TableRequest {
    name: string;
    areaId: number;
    active: boolean;
  }