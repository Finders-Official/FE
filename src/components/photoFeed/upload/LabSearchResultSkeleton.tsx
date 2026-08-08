export default function LabSearchResultSkeleton() {
  return (
    <ul className="flex flex-col gap-4 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className="list-none">
          <div className="t-skel-sheen flex flex-col gap-2 py-4">
            <div className="h-5 w-52 rounded-md bg-neutral-800/60" />
            <div className="h-4 w-72 rounded-md bg-neutral-800/40" />
          </div>
        </li>
      ))}
    </ul>
  );
}
