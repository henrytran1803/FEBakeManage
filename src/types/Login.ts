export interface LoginProps {
    onSubmit: (email: string, password: string) => void;
    isLoading?: boolean;
}
