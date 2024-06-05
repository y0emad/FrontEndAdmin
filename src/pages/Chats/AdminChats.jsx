import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

import React, { useEffect, useRef, useState } from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { Chats } from "./Chats";
import { DivChat } from "../../components/DivChat";

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

  const handleClick = (userName, email) => {
    setToggle(true);
    setReceiverEmail(email);
    setReceiverUserName(userName);
  };
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <div className="flex h-[91vh] antialiased text-gray-200">
      <div className="flex flex-row  h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-[#000915] flex-shrink-0">
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

          <div className="flex flex-col mt-8">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">{t("Chat.ActiveConversations")}</span>
            </div>
            {all_Chats.message === "Unique chat users fetched successfully" ||
            all_Chats.message === "Users fetched successfully"
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
              : t("Chat.Nochats")}
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

  const searchParams = new URL(url).searchParams;
  let query = searchParams.get("queryChat") || "";

  if (query) {
    let all_Chats = await fetch(
      `http://localhost:4000/chats/searchUser/${query}`,
      {
        signal: signal,
      }
    ).then((res) => res.json());

    return all_Chats;
  }

  const all_Chats = await fetch(
    `http://localhost:4000/chats/getUniqueChatUsers/${adminId}`,
    {
      signal: signal,
    }
  ).then((res) => res.json());

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
