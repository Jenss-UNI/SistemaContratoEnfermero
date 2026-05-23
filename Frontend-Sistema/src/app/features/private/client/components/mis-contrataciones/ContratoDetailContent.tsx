import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ContractDetailView } from "../../../../../shared/components/client/mis-contrataciones";
import { CLIENT_PANEL_BASE } from "../../clientNav";
import { getContratoDetalle } from "../../data/mockContrataciones";

export default function ContratoDetailContent() {
  const { contratoId } = useParams<{ contratoId: string }>();
  const navigate = useNavigate();
  const contrato = contratoId ? getContratoDetalle(contratoId) : undefined;

  if (!contrato) {
    return <Navigate to={`${CLIENT_PANEL_BASE}/mis-contrataciones`} replace />;
  }

  return (
    <ContractDetailView
      contrato={contrato}
      onBack={() => navigate(`${CLIENT_PANEL_BASE}/mis-contrataciones`)}
      onFirmado={() => navigate(`${CLIENT_PANEL_BASE}/mis-contrataciones`)}
    />
  );
}
