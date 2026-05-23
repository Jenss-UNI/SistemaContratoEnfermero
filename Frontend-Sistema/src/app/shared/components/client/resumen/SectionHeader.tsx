import { Link } from "react-router-dom";

type SectionHeaderProps = {
  title: string;
  linkTo?: string;
  linkLabel?: string;
};

export default function SectionHeader({ title, linkTo, linkLabel = "Ver todos" }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {linkTo && (
        <Link to={linkTo} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          {linkLabel} &gt;
        </Link>
      )}
    </div>
  );
}
