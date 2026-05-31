import { useNavigate, useParams } from "react-router-dom";
import ContractDetailView from "../../../../shared/components/client/mis-contrataciones/ContractDetailView";

export default function ContratoPage() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  
  const isConfirmado = id === "CON-000041" || id === "CS-30727";

  
  const contratoMock = isConfirmado 
    ? {
        codigo: id,
        estado: "Confirmado - Pendiente de firma",
        emitidoEl: "20 de mayo de 2026",
        tipoServicio: "Especializado",
        profesionalNombre: "Carlos Sanchez Martinez",
        profesionalIniciales: "CM",
        especialidad: "Geriatría y Cuidado del Adulto Mayor",
        profesionalRol: "Enfermero Especializado",
        profesionalUbicacion: "Lince",
        paciente: "Elena Rodriguez",
        pacienteEdad: "12 años",
        pacienteDireccion: "Av. Canto Grande, Miraflores",
        fechaInicio: "19 de mayo de 2026",
        fechaFin: "19 de mayo de 2026",
        horario: "19:00 - 20:00",
        duracionDias: 1,
        duracionHoras: 6,
        jornadas: [{ fecha: "mar, 19 may.", horario: "19:00 - 20:00" }],
        terminos: [
          "El profesional se compromete a brindar atención de calidad según su nivel de certificación.",
          "El cliente se compromete a proporcionar un ambiente seguro y adecuado para la atención.",
          "El pago permanece en custodia hasta la confirmación satisfactoria del servicio.",
          "Cualquier cancelación con menos de 24 horas de anticipación genera un cargo del 20%.",
          "La plataforma actúa como intermediario y no es responsable de actos fuera del contrato.",
          "Ambas partes aceptan el sistema de resolución de disputas de Cuidame.",
          "El contrato puede renovarse automáticamente con acuerdo de ambas partes."
        ],
        historial: [
          { titulo: "Contrato generado", fecha: "20/5/2026 · 04:46 p. m." },
          { titulo: "Enfermero aceptó la solicitud", fecha: "20/5/2026 · --:--" }
        ],
        horasTarifa: 6,
        tarifaHora: 53,
        montoTotal: 318,
        comisionPorcentaje: 10,
        clienteNombre: "Jens Jeremies Luna Levita",
        clientePlan: "Premium",
        pinServicio: "RBDC49"
      }
    : {
       
        codigo: id || "CON-000069",
        estado: "Pendiente",
        emitidoEl: "31 de mayo de 2026",
        tipoServicio: "Asistencial",
        profesionalNombre: "Carlos Sanchez Martinez",
        profesionalIniciales: "CM",
        especialidad: "Geriatría y Cuidado del Adulto Mayor",
        profesionalRol: "Enfermero Especializado",
        profesionalUbicacion: "Lince",
        paciente: "Elena Rodriguez",
        pacienteEdad: "12 años",
        pacienteDireccion: "Av. Canto Grande, Miraflores",
        fechaInicio: "03 de junio de 2026",
        fechaFin: "03 de junio de 2026",
        horario: "0:00 - 6:00",
        duracionDias: 1,
        duracionHoras: 6,
        jornadas: [{ fecha: "mié, 3 jun.", horario: "0:00 - 6:00" }],
        terminos: [
          "El profesional se compromete a brindar atención de calidad según su nivel de certificación.",
          "El cliente se compromete a proporcionar un ambiente seguro y adecuado para la atención.",
          "El pago permanece en custodia hasta la confirmación satisfactoria del servicio.",
          "Cualquier cancelación con menos de 24 horas de anticipación genera un cargo del 20%.",
          "La plataforma actúa como intermediario y no es responsable de actos fuera del contrato."
        ],
        historial: [
          { titulo: "Contrato generado", fecha: "31/5/2026 · 02:47 a. m." }
        ],
        horasTarifa: 6,
        tarifaHora: 20,
        montoTotal: 120,
        comisionPorcentaje: 10,
        clienteNombre: "Jens Jeremies Luna Levita",
        clientePlan: "Premium",
        pinServicio: "GM4JV"
      };

  return (
    <div className="w-full">
      <ContractDetailView
        contrato={contratoMock as any}
        onBack={() => navigate(-1)} 
      />
    </div>
  );
}