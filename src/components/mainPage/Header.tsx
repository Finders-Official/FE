import { Link } from "react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-black/80 px-5 backdrop-blur-md">
      <div>
        <Link
          to="/"
          className="font-ydestreet text-[26px] leading-[132%] font-bold text-neutral-100"
        >
          Finders
        </Link>
      </div>
    </header>
  );
}
