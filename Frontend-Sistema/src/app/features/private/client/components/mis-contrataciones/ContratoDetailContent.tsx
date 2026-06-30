import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ContractDetailView } from "../../../../../shared/components/client/mis-contrataciones";
import { CLIENT_PANEL_BASE } from "../../clientNav";

export default function ContratoDetailContent() {
  const { contratoId } = useParams<{ contratoId: string }>();
  const navigate = useNavigate();

  if (!contratoId) {
    return <Navigate to={`${CLIENT_PANEL_BASE}/mis-contrataciones`} replace />;
  }

  return (
    <ContractDetailView
      serviceId={contratoId}
      onBack={() => navigate(`${CLIENT_PANEL_BASE}/mis-contrataciones`)}
      onFirmado={() => navigate(`${CLIENT_PANEL_BASE}/mis-contrataciones`)}
    />
  );
}
