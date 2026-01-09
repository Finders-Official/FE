import { useState } from "react";
import { Header, Icon, SearchBar, SearchItem } from "@/components/common";
import { MagnifyingGlassIcon } from "@/assets/icon";

export default function TestPage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <Header
        title="테스트 페이지"
        showBack
        onBack={() => console.log("back")}
        rightAction={{
          type: "icon",
          icon: (
            <Icon className="text-neutral-200">
              <MagnifyingGlassIcon />
            </Icon>
          ),
          onClick: () => console.log("search"),
        }}
      />

      <div className="px-5 py-4">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="검색어를 입력하세요"
        />
      </div>

      {searchValue && (
        <div className="flex flex-col gap-3 px-5">
          <SearchItem
            type="recent"
            text={searchValue}
            onClick={() => console.log("click:", searchValue)}
            onDelete={() => console.log("delete:", searchValue)}
          />
          <SearchItem
            type="recent"
            text={`${searchValue} 1`}
            onClick={() => console.log("click:", `${searchValue} 1`)}
            onDelete={() => console.log("delete:", `${searchValue} 1`)}
          />
          <SearchItem
            type="search"
            text={searchValue}
            onClick={() => console.log("click:", searchValue)}
          />
          <SearchItem
            type="search"
            text={`${searchValue} 2`}
            onClick={() => console.log("click:", `${searchValue} 2`)}
          />
        </div>
      )}
    </div>
  );
}
