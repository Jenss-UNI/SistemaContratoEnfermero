export interface StepDniProps {
    dni: string;
    nombres: string;
    apellidos: string;
    onNext: () => void;
    onBack: () => void;
}