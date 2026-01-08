export const TabBar = () => {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 mx-auto h-[5.5625rem] w-full -translate-x-1/2 bg-neutral-900 p-[1.25rem]">
      {/*1.홈버튼
      2. 현상소 보기 버튼
      3.사진 수다 버튼
      4.현상 관리 버튼
      5. 마이페이지 버튼*/}
      <nav className="grid grid-cols-5">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
      </nav>
    </div>
  );
};

// 해당 버튼에 해당하는 페이지로 이동했을 때 버튼색 orange-500으로 설정해 해당 페이지에 있다는 것을 인지시켜주기
// TabBar 는 FooterLayout 에서 사용됨
