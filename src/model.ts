export interface IHttpResult {
  ok: boolean;
  error?: string;
  rows?: any;
  customer?: ICustomer;
  token?: string;
  latLng?: IMapCoord;
  status?: string;
}

export interface ICustomer {
  id?: number;
  first_name?: string;
  last_name?: string;
  sex?: string;
  customer_type_id?: number;
  telephone?: string;
  email?: string;
  image?: string;
}

export interface IGroup {
  id: number;
  name: string;
}

export interface IMapCoord {
  lat: number;
  lng: number;
}

export interface IMapEvent {
	coords: IMapCoord
}

export interface IContact {
  id?: number;
  first_name?: string;
  last_name?: string;
  sex?: string;
  telephone?: string;
  email?: string;
}