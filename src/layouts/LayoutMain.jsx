import { NavBarMain } from "../components/NavBarMain";
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigation,
} from "react-router-dom";

import { Loading } from "../pages/Loading/Loading";
import { FooterMain } from "../components/FooterMain";
import { calc } from "antd/es/theme/internal";
import { Search } from "../components/Search";

export function LayoutMain() {
  const { state } = useNavigation();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <NavBarMain />
      <div
        style={{
          paddingTop: "4rem",
        }}
      >
        {isHomePage && <Search />}
      </div>
      {state === "loading" ? (
        <Loading />
      ) : (
        <>
          <ScrollRestoration />
          <div
            style={{
              // paddingTop: "4rem",
              minHeight: "calc(100vh - 4rem - 138px)",
            }}
          >
            <Outlet />
          </div>
          <div style={{ paddingTop: "4rem" }}>
            <FooterMain />
          </div>
        </>
      )}
    </>
  );
}
