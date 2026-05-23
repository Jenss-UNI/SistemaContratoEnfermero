type ClientSectionEmptyProps = {
  title: string;
};

/** Plantilla vacía por sección; el contenido se implementará después. */
export default function ClientSectionEmpty({ title }: ClientSectionEmptyProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center sm:p-12">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">Contenido en construcción.</p>
    </div>
  );
}
