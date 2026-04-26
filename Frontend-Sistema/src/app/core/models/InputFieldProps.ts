import type { LucideIcon } from "lucide-react";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
    label: string;
    icon: LucideIcon;
    error?: string;
    helperText?: string;
    as?: "input" | "select" | "textarea";
    options?: string[];
    children?: React.ReactNode;
}