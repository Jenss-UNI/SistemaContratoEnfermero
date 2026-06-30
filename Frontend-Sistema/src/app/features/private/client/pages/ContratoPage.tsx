import { useNavigate, useParams } from "react-router-dom";
import ContractDetailView from "../../../../shared/components/client/mis-contrataciones/ContractDetailView";

export default function ContratoPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="w-full">
      {id ? (
        <ContractDetailView
          serviceId={id}
          onBack={() => navigate(-1)} 
        />
      ) : (
        <div className="text-center py-10 text-slate-500">ID de contrato no especificado.</div>
      )}
    </div>
  );
}