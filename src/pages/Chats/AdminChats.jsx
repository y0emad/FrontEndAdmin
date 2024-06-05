import { useTranslation } from "react-i18next";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

import React, { useEffect, useRef, useState } from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { Chats } from "./Chats";
import { DivChat } from "../../components/DivChat";

// const debounce = (fn, ms = 300) => {
//   let timeoutId;
//   return function (...args) {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => fn.apply(this, args), ms);
//   };
// };

const Helper = {
  getInitials: (name) => {
    if (!name) return "";
    const namesArray = name.split(" ");
    let initials = namesArray.map((n) => n[0]).join("");
    return initials.toUpperCase();
  },
};

function AdminChats() {
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const all_Chats = useLoaderData();
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverUserName, setReceiverUserName] = useState("");
  const [toggle, setToggle] = useState(false);
  //   const query = useRef(null);
  //   const navigate = useNavigate();
  const handleClick = (userName, email) => {
    setToggle(true);
    setReceiverEmail(email);
    setReceiverUserName(userName);
  };
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  //   const handleSearch = debounce((event) => {
  //     const newSearchParams = new URLSearchParams(window.location.search);
  //     newSearchParams.set("query", event.target.value);
  //     navigate(`?${newSearchParams}`, { replace: true });
  //   });

  //   useEffect(() => {
  //     const newSearchParams = new URLSearchParams(window.location.search);
  //     query.current.focus();
  //     query.current.value = newSearchParams.get("query");
  //   }, []);
  return (
    <div className="flex h-[91vh] antialiased text-gray-200">
      <div className="flex flex-row  h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-[#000015] flex-shrink-0">
          <div className="flex flex-row items-center justify-center h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-[#000015] bg-gray-200 h-10 w-10">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <div className="ms-2 font-bold text-2xl">{t("Chat.QuickChat")}</div>
          </div>
          {toggle && (
            <DivChat
              receiverUserName={receiverUserName}
              receiverEmail={receiverEmail}
              key={receiverId}
            />
          )}
          <div className="border-b-2 py-4 px-2">
            {/* <Form>
              <div className="relative  my-2">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  name="query"
                  id="query"
                  ref={query}
                  onChange={handleSearch}
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:border-gray-200 dark:placeholder-[#3b3c3c] dark:text-[#000915] dark:focus:ring-[#000915] dark:focus:border-[#000915]"
                  placeholder={t("Home.Searforprod")}
                  required
                />
              </div>
            </Form> */}
            {/* <input
              type="text"
              placeholder="search chatting"
              class="py-2 px-2 border-2 text-[#000915] border-gray-200 rounded-2xl w-full"
            /> */}
          </div>

          <div className="flex flex-col mt-8">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">{t("Chat.ActiveConversations")}</span>
            </div>
            {all_Chats.message === "Unique chat users fetched successfully"
              ? all_Chats?.data?.map((chat) => (
                  <div
                    key={chat._id}
                    className="flex flex-col space-y-1 mt-4 -mx-2 h-fit overflow-y-auto"
                  >
                    <button
                      onClick={() =>
                        setReceiverId(chat._id) &
                        setReceiverName(Helper.getInitials(chat.username)) &
                        handleClick(chat.username, chat.email)
                      }
                      className="flex flex-row items-center hover:bg-[#7f6727] rounded-xl p-2"
                    >
                      <div className="flex items-center justify-center h-8 w-8 bg-gray-200 font-bold text-[#000915] rounded-full">
                        {Helper.getInitials(chat.username)}
                      </div>
                      <div className="mx-2 text-sm font-semibold">
                        {chat.username}
                      </div>
                    </button>
                  </div>
                ))
              : "No chats found"}
          </div>
        </div>
        {receiverId ? (
          <Chats
            receiverId={receiverId}
            key={receiverId}
            receiverName={receiverName}
          />
        ) : (
          <div className="area">
            <ul className="circles">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
const loader = async ({ request: { signal, url } }) => {
  const adminId = jwtDecode(localStorage.getItem("tkn")).userId;

  //   const searchParams = new URL(url).searchParams;
  //   let query = searchParams.get("query") || "";

  //   if (query) {
  //     let all_Chats = await fetch(
  //       `http://localhost:4000/chats/searchUser/${query}`,
  //       {
  //         signal: signal,
  //         // headers: { Authorization: `Bearer ${localStorage.getItem("tkn")}` },
  //       }
  //     ).then((res) => res.json());

  //     return all_Chats;
  //   }

  const all_Chats = await fetch(
    `http://localhost:4000/chats/getUniqueChatUsers/${adminId}`,
    {
      signal: signal,
    }
  ).then((res) => res.json());
  // console.log(all_Chats);
  return all_Chats;
};

export const AdminChatsFunc = {
  element: (
    <ProtectedRoute>
      <AdminChats />
    </ProtectedRoute>
  ),
  loader,
};
