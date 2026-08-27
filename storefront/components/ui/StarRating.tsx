import { starArray } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export function StarRating({ rating, size = 14 }: StarRatingProps) {
  const stars = starArray(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {stars.map((v, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 14 14" fill="none">
          <defs>
            <linearGradient id={`star-${i}-${rating}`}>
              <stop offset={`${v * 100}%`} stopColor="#C77B2C" />
              <stop offset={`${v * 100}%`} stopColor="#E3D5B8" />
            </linearGradient>
          </defs>
          <path
            d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885 3.91 10.51l.59-3.44L2 4.632l3.455-.502z"
            fill={`url(#star-${i}-${rating})`}
          />
        </svg>
      ))}
    </span>
  );
}
