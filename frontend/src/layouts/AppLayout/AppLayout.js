import {useHistory, useLocation} from "react-router-dom";
import {Menu, Layout} from "antd";
import {
  CarOutlined,
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  ShopOutlined
} from "@ant-design/icons";

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
  partners: {
    key: "partners",
    route: "partners"
  },
  customers: {
    key: "customers",
    route: "customers"
  },
  payments: {
    key: "payments",
    route: "payments"
  },
  users: {
    key: "users",
    route: "users"
  }
}

export function AppLayout({ children }) {
  const history = useHistory();
  const auth = useAuth();

  function handleClick(menu) {
    history.replace(menu.route);
  }

  function handleLogout() {
    auth.logout(() => history.replace("login"));
  }

  const location = useLocation()
  const currentMenu = Object.entries(menus)
    .map(([_, menu]) => menu)
    .find(menu => menu.route === location.pathname.replace("/", ""))
  const selectedKey = currentMenu.key

  return (
    <Layout>
      <Menu defaultSelectedKeys={[selectedKey]} mode="horizontal">
        <Menu.Item onClick={() => handleClick(menus.parkingPlaces)} key={menus.parkingPlaces.key} icon={<CarOutlined />}>
          Vagas
        </Menu.Item>
        <Menu.Item onClick={() => handleClick(menus.parkingLogs)} key={menus.parkingLogs.key} icon={<FileTextOutlined />}>
          Relatório de vagas
        </Menu.Item>
        <Menu.Item onClick={() => handleClick(menus.partners)} key={menus.partners.key} icon={<ShopOutlined />}>
          Convênios
        </Menu.Item>
        <Menu.Item onClick={() => handleClick(menus.customers)} key={menus.customers.key} icon={<TeamOutlined />}>
          Clientes
        </Menu.Item>
        <Menu.Item onClick={() => handleClick(menus.payments)} key={menus.payments.key} icon={<DollarOutlined />}>
          Pagamentos
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