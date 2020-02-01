
// Application States
export interface IRootState {
  items: IItemsState;
  tags: ITagsState;
  auth: IAuthState;
  error: IErrorState;
}

export interface IItemsState {
  loadingItems: boolean;
  loadingItem: boolean;
  loadingItemInsert: boolean;
  loadingItemUpdate: boolean;
  loadingItemDelete: boolean;
  items: IItem[];
  item?: IItem;
  itemsError: boolean;
  itemError: boolean;
  itemInsertError: boolean;
  itemUpdateError: boolean;
  itemDeleteError: boolean;
  editingItem: boolean;
  managingItem: boolean;
}

export interface ITagsState {
  loading: boolean;
  tags: ITag[];
  error: boolean;
}

export interface IErrorState {
  globalError?: IError;
}

export interface IError {
  title?: string;
  message: string;
  errorCode?: number;
}

export interface IAuthState {
  loginError: boolean;
  loginLoading: boolean;
  logoutError: boolean;
  logoutLoading: boolean;
  loggedIn: boolean;
  user?: IUser;
}

export interface IPayloadAction<T> {
  type: string;
  payload: T;
}

export type GetItemsPayload = IItem[];
export type GetItemPayload = IItem;
export type InsertItemPayload = IItem;
export type UpdateItemPayload = IItem;
export type DeleteItemPayload = IItem;
export type GetTagsPayload = ITag[];

export interface IAsyncChainOptions {
  loading: string;
  success: string;
  error: string;
  complete: string;
}

// requests
export interface ILoginRequest {
  username: string;
  password: string;
}

// API interfaces
export interface IUser {
  id: string;
  name: string;
  email: string;
  created: Date;
}

export interface IItem {
  id: number;
  type: string;
  title: string;
  description: string;
  content: string;
  created: Date;
  modified?: Date;
  authorId: number;
  authorName: string;
  tags: ITag[];
}

export interface IItemInsertRequest {
  type: string;
  title: string;
  description: string;
  content: string;
  tags: number[];
}

export interface IItemUpdateRequest {
  id: number;
  type: string;
  title: string;
  description: string;
  content: string;
  tags: number[];
}

export interface ITag {
  id: number;
  name: string;
}