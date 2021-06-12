import {useState} from "react";
import {useHistory} from "react-router-dom";
import {Menu, Layout} from "antd";
import {CarOutlined, FileTextOutlined, UserOutlined} from "@ant-design/icons";

import "./AppLayout.css";
import {useAuth} from "../../hooks/useAuth";

const menus = {
  parkingPlaces: {
    key: "parking-places",
    route: ""
  },
  parkingLogs: {
    key: "parking-logs",
    route: "parking-logs"
  },
  users: {
    key: "users",
    route: "users"
  }
}

export function AppLayout({ children }) {
  const [currentMenu, setCurrentMenu] = useState(menus.parkingLogs.key);
  const history = useHistory();
  const auth = useAuth();

  function handleClick(menu) {
    setCurrentMenu(menu.key);
    history.replace(menu.route);
  }

  function handleLogout() {
    auth.logout(() => history.replace("login"));
  }

  return (
    <Layout>
      <Menu selectedKeys={[currentMenu]} mode="horizontal">
        <Menu.Item onClick={() => handleClick(menus.parkingPlaces)} key={menus.parkingPlaces.key} icon={<CarOutlined />}>
          Vagas
        </Menu.Item>
        <Menu.Item onClick={() => handleClick(menus.parkingLogs)} key={menus.parkingLogs.key} icon={<FileTextOutlined />}>
          Relatório de vagas
        </Menu.Item>
        <Menu.Item onClick={() => handleClick(menus.users)} key={menus.users.key} icon={<UserOutlined />}>
          Usuários
        </Menu.Item>
        <Menu.Item onClick={() => handleLogout()} key={"logout"}>
          Sair
        </Menu.Item>
      </Menu>

      <Layout.Content className={"app-layout-content"}>
        {children}
      </Layout.Content>
    </Layout>
  )
}