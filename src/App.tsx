import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import "./App.css";
import Router from "./router/Router";
import { useNavigate } from "react-router";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // 앱이 커스텀 스킴 URL을 통해 켜졌을 때 실행되는 리스너
    const setupAppListener = async () => {
      await CapacitorApp.addListener("appUrlOpen", (data) => {
        // data.url 에는 "kakao{키}://oauth?code=인가코드&state=상태값" 이 들어옴
        const url = new URL(data.url);

        if (url.host === "oauth") {
          const code = url.searchParams.get("code");
          const state = url.searchParams.get("state");

          // 리액트 라우터를 이용해 인가 코드를 들고 웹 콜백 페이지로 강제 이동
          if (code) {
            navigate(`/oauth/callback?code=${code}&state=${state}`);
          }
        }
      });
    };

    setupAppListener();

    // 클린업
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [navigate]);

  return <Router />;
}
