import {useEffect, useState} from "react";
import {Button, Col, Drawer, message, Row, Space, Table, Typography} from "antd";
import {usersService} from "../services/usersService";
import {UserForm} from "./UserForm";
import {UserTypes} from "../enums/user-types";

const PAGE_SIZE = 10;

const userTypeDescriptions = {
  [UserTypes.Administrativo]: "Administrativo",
  [UserTypes.Financeiro]: "Financeiro",
  [UserTypes.Operacional]: "Operacional",
}

export function Users() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    getUsers(currentPage)
  }, [currentPage])

  const columns = [
    { title: "Nome", dataIndex: "name" },
    { title: "E-mail", dataIndex: "email" },
    {
      title: "Tipo",
      dataIndex: "type",
      render: (_, record) => userTypeDescriptions[record.type]
    },
    {
      title: "Ações",
      dataIndex: "",
      render: (_, record) => (
        <Space>
          <a onClick={() => onEdit(record)}>Editar</a>
          <a onClick={() => onDelete(record)}>Excluir</a>
        </Space>
      )
    }
  ]

  async function getUsers(page) {
    try {
      setLoading(true)
      const { items, count } = await usersService().getAllPaged(page, PAGE_SIZE);
      setUsers(items)
      setCount(count)
    } catch {
      message.error("Falha ao obter lista de usuários");
    } finally {
      setLoading(false)
    }
  }

  function handleChange(pagination) {
    setPage(pagination.current);
  }

  function onCreate() {
    setEditingUser(null);
    setShowDrawer(true);
  }

  function onEdit(record) {
    setEditingUser(record);
    setShowDrawer(true);
  }

  async function onDelete(record) {
    try {
      message.info("Excluindo usuário");
      await usersService().deleteUser(record.id);
      message.success("Usuário excluído com sucesso");
      await getUsers(currentPage);
    } catch {
      message.error("Falha ao excluir usuário");
    }
  }

  async function onDrawerClose() {
    setEditingUser(null);
    setShowDrawer(false);
    await getUsers(currentPage);
  }

  return (
    <div>
      <Row align={"top"} justify={"space-between"}>
        <Col>
          <Typography.Title level={2}>Usuários</Typography.Title>
        </Col>
        <Col>
          <Button type={"primary"} onClick={() => onCreate()}>Criar usuário</Button>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        rowKey={record => record.id}
        pagination={{ current: currentPage, pageSize: PAGE_SIZE, total: count }}
        dataSource={users}
        onChange={handleChange}
      />

      <Drawer
        width={500}
        title={editingUser ? "Editar Usuário" : "Criar Usuário"}
        placement="right"
        onClose={onDrawerClose}
        visible={showDrawer}
      >
        <UserForm user={editingUser} />
      </Drawer>
    </div>
  )
}