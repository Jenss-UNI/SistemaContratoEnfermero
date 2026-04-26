export interface StepProProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onNext: () => void;
    errors?: Record<string, string>;
}