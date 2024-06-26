import { NavBarMain } from "../components/NavBarMain";
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigation,
} from "react-router-dom";

import { Loading } from "../pages/Loading/Loading";
import { FooterMain } from "../components/FooterMain";

import { Search } from "../components/Search";
import { SearchChat } from "../components/SearchChat";

export function LayoutMain() {
  const { state } = useNavigation();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isChatPage = location.pathname === "/AdminChats";
  return (
    <>
      <NavBarMain />
      <div
        style={{
          paddingTop: "4rem",
        }}
      >
        {isHomePage && <Search />}
        {isChatPage && (
          <div className=" bg-[#000915]">
            {" "}
            <SearchChat />
          </div>
        )}
      </div>
      {state === "loading" ? (
        <Loading />
      ) : (
        <>
          {isChatPage ? (
            <div
              style={{
                // paddingTop: "4rem",
                minHeight: "calc(100vh - 4rem  )",
              }}
            >
              <Outlet />
            </div>
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
      )}
    </>
  );
}
