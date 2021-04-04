import React, { PureComponent } from "react";
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as CgIcons from "react-icons/cg";

export const SidebarData = [
  {
    title: "ChangePassword",
    path: "/",
    icon: <CgIcons.CgPassword />,
    cName: "nav-text",
  },
  {
    title: "UpdateEmail",
    path: "/",
    icon: <AiIcons.AiOutlineMail />,
    cName: "nav-text",
  },
  {
    title: "UpdateName",
    path: "/",
    icon: <IoIcons.IoMdPerson />,
    cName: "nav-text",
  },
  {
    title: "Deactivate",
    path: "/",
    icon: <AiIcons.AiFillDelete />,
    cName: "nav-text",
  },
];
