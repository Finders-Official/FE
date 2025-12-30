const KakaoButton = () => {
  return (
    <button
      type="button"
      className="inline-flex h-[3.125rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] font-semibold text-neutral-900 shadow-sm active:scale-[0.99]"
    >
      <img src="../public/Kakao.svg" alt="Kakao Logo" className="h-6 w-6" />
      <span>카카오 로그인</span>
    </button>
  );
};

export default KakaoButton;
