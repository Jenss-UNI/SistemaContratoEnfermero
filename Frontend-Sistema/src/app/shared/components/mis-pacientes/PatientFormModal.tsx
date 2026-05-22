import type { PatientFormData } from "../../../core/models/patient.model";
import Modal from "./Modal";
import PatientForm from "./PatientForm";

type PatientFormModalProps = {
  title: string;
  initialForm: PatientFormData;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => void;
};

export default function PatientFormModal({
  title,
  initialForm,
  submitLabel,
  onClose,
  onSubmit,
}: PatientFormModalProps) {
  return (
    <Modal title={title} onClose={onClose} maxWidthClass="max-w-3xl">
      <PatientForm
        initialForm={initialForm}
        submitLabel={submitLabel}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
