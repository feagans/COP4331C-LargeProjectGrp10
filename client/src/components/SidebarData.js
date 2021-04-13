import React, { PureComponent } from "react";
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as CgIcons from "react-icons/cg";

export const SidebarData = [
  {
    title: "ChangePassword",
    path: "/password",
    icon: <CgIcons.CgPassword />,
    cName: "nav-text",
  },
  {
    title: "UpdateEmail",
    path: "/email",
    icon: <AiIcons.AiOutlineMail />,
    cName: "nav-text",
  },
  {
    title: "UpdateName",
    path: "/name",
    icon: <IoIcons.IoMdPerson />,
    cName: "nav-text",
  },
  {
    title: "Deactivate",
    path: "/deactivate",
    icon: <AiIcons.AiFillDelete />,
    cName: "nav-text",
  },
];
