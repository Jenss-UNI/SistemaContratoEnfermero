export interface StepProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onNext: () => void;
    errors?: Record<string, string>;
}