import {
  Star,
  MessageSquareText
} from "lucide-react";
import type { Nurse } from "../../../../core/models/nurse.model";

interface Props {
  nurse: Nurse;
}

export default function NurseReviews({
  nurse
}: Props) {

  if (!nurse.reviewList?.length) return null;

  return (

    <div className="bg-white rounded-3xl p-8 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <MessageSquareText className="w-5 h-5 text-teal-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Reseñas de Pacientes
        </h2>

        <span className="text-slate-400">
          ({nurse.reviewList.length})
        </span>

      </div>

      <div className="space-y-8">

        {nurse.reviewList.map((review) => (

          <div
            key={review.id}
            className="border-b border-slate-100 pb-8 last:border-none"
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-4">

              <div className="flex gap-4">

                <img
                  src={review.authorPhoto || `https://i.pravatar.cc/150?u=${review.id}`}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>

                  <h3 className="font-semibold text-slate-900">
                    {review.author}
                  </h3>

                  <div className="flex items-center gap-3 mt-1">

                    <div className="flex">

                      {Array.from({ length: 5 }).map((_, index) => (

                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.round(review.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-200"
                          }`}
                        />

                      ))}

                    </div>

                    <span className="text-sm text-slate-400">
                      {review.date}
                    </span>

                  </div>

                </div>

              </div>

              <div className="px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-500">
                Especializado
              </div>

            </div>

            {/* COMMENT */}
            <p className="mt-5 text-slate-600 leading-8">
              {review.comment}
            </p>

            {/* SCORES */}
            <div className="flex flex-wrap gap-6 mt-5 text-sm">

              <p className="text-slate-500">
                Puntualidad:
                <span className="text-teal-600 font-bold ml-1">
                  {review.punctuality}
                </span>
              </p>

              <p className="text-slate-500">
                Trato:
                <span className="text-teal-600 font-bold ml-1">
                  {review.treatment}
                </span>
              </p>

              <p className="text-slate-500">
                Técnica:
                <span className="text-teal-600 font-bold ml-1">
                  {review.technical}
                </span>
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}