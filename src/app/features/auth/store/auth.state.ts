export interface AuthState {
    user: any | null;
    loading: boolean;
    error: string | null;
}

export const initialState: AuthState = {
    user: null,
    loading: false,
    error: null
};