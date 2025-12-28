export const AppleButton = () => {
  return (
    <button
      type="button"
      className="bg-neutral-875 inline-flex h-[3.125rem] w-full items-center justify-center gap-2 rounded-2xl font-semibold text-white shadow-sm ring-1 ring-white/10 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none active:scale-[0.99]"
    >
      <img src="../public/Apple.svg" alt="Apple Logo" className="h-6 w-6" />
      <span>애플로 로그인</span>
    </button>
  );
};

export default AppleButton;
