import React, { PureComponent } from "react";
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as CgIcons from "react-icons/cg";

export const SidebarData = [
  {
    title: "Update Password",
    path: "/password",
    icon: <CgIcons.CgPassword />,
    cName: "nav-text",
  },
  {
    title: "Update Email",
    path: "/email",
    icon: <AiIcons.AiOutlineMail />,
    cName: "nav-text",
  },
  {
    title: "Update Name",
    path: "/name",
    icon: <IoIcons.IoMdPerson />,
    cName: "nav-text",
  },
];
