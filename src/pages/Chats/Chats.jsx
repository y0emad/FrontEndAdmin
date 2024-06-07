import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

import {
  connect,
  disconnect,
  sendMessage,
  subscribeToMessages,
} from "./WebSocketService";
import { ThreeCircles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import useLocalStorage from "../../hooks/useLocalStorage";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const Helper = {
  getInitials: (name) => {
    if (!name) return "";
    const namesArray = name.split(" ");
    let initials = namesArray.map((n) => n[0]).join("");
    return initials.toUpperCase();
  },
};

export function Chats({ receiverId, receiverName }) {
  const [t, i18n] = useTranslation("global");
  const [lang, setLang] = useLocalStorage("lang", "ar");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const AddEmoji = (e) => {
    const sym = e.unified.split("_");
    const codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setNewMessage((prev) => prev + emoji);
  };
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const getDateOnly = (isoString) => {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const extractTimeFromISOString = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("tkn");
  const tokenDecode = jwtDecode(token);
  const adminName = tokenDecode.username;
  const adminId = tokenDecode.userId;
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!receiverId) return;

    setLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(`http://localhost:4000/chats/getChatByReceiverOrSenderID`, {
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userID1: adminId, userID2: receiverId }),
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setMessages(data.data);
        setError(null);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      abortController.abort();
    };
  }, [receiverId, adminId, token]);
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    connect(tokenDecode.userId);
    subscribeToMessages((message) => {
      setMessages((prevMessages) => {
        // console.log("msg", message);
        const allPrevData = prevMessages.filter(
          (mes) => mes._id !== message._id
        );

        // console.log("prevmsg", all);
        return [...allPrevData, message];
      });
    });

    return () => {
      disconnect();
    };
  }, [adminId]);

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    setShowEmojiPicker(false);
    if (!trimmedMessage) {
      return;
    }

    const currentTime = new Date().toISOString();
    const message = {
      senderId: adminId,
      receiverId: receiverId,
      content: trimmedMessage,
      createdAt: currentTime,
      _id: uuidv4(),
    };

    try {
      sendMessage(message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = getDateOnly(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  return loading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ThreeCircles
        height="100"
        width="100"
        color="#7f6727"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
        outerCircleColor=""
        innerCircleColor=""
        middleCircleColor=""
      />
    </div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className="flex flex-col flex-auto h-full p-6 pb-0">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-[#000915] h-full p-4">
        <div
          className="flex flex-col h-full overflow-x-auto scrollbar-hide mb-4"
          ref={chatEndRef}
        >
          <div className="flex flex-col h-full">
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                <div className="text-center text-gray-500 text-xs my-2">
                  <div className="inline-block  border-gray-500 md:w-[42%]  w-[20%] me-1 border-2 bg-gray-500 "></div>
                  {date}
                  <div className="inline-block  border-gray-500 md:w-[42%] w-[20%] ms-1 border-2 bg-gray-500 "></div>
                </div>
                {messages?.map((message) => (
                  <div key={message._id} className="grid grid-cols-12 gap-y-2">
                    {message.sender === adminId ||
                    message.senderId === adminId ? (
                      <div className="col-start-6 col-end-13 p-3 rounded-lg">
                        <div className="flex items-center justify-start flex-row-reverse">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-[#000915] font-bold flex-shrink-0">
                            {Helper.getInitials(adminName)}
                          </div>
                          <div className="relative mx-3 text-sm text-[#000915] bg-indigo-100 py-2 px-4 shadow rounded-xl">
                            <div>{message.content}</div>
                            <div className="absolute text-nowrap text-xs bottom-0 ltr:right-0 rtl:left-0 -mb-5 mr-2 text-gray-500">
                              <span className="text-nowrap">
                                {extractTimeFromISOString(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="col-start-1 col-end-8 p-3 rounded-lg">
                        <div className="flex flex-row items-center">
                          <div className="flex items-center font-bold justify-center h-10 w-10 rounded-full bg-[#7f6727] flex-shrink-0">
                            {receiverName}
                          </div>
                          <div className="relative mx-3 text-sm text-[#000915] bg-white py-2 px-4 shadow rounded-xl">
                            <div>{message.content}</div>
                            <div className="absolute text-nowrap text-xs bottom-0 ltr:right-0 rtl:left-0 -mb-5 mr-2 text-gray-500">
                              <span className="text-nowrap">
                                {extractTimeFromISOString(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
        >
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                placeholder={t("Chat.Msg")}
                onFocus={() => setShowEmojiPicker(false)}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex w-full border rounded-xl focus:outline-none text-[#000915] focus:border-indigo-300 px-4 h-10"
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute flex items-center justify-center h-full w-12 ltr:right-0 rtl:left-0 top-0 text-gray-400 hover:text-gray-600"
              >
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
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              {showEmojiPicker && (
                <div className="absolute text-nowrap text-xs bottom-20 ltr:right-0 rtl:left-0 -mb-5 mr-2 text-gray-500">
                  <Picker
                    data={data}
                    onEmojiSelect={AddEmoji}
                    locale={lang === "en" ? "en" : "ar"}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="ml-4">
            <button
              type="submit"
              onClick={handleSendMessage}
              className="flex items-center justify-center duration-150 bg-[#90752c] hover:bg-[#000015] rounded-xl text-white px-4 py-1 flex-shrink-0"
            >
              <span>{t("Chat.Send")}</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
