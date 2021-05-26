import {useEffect, useState} from "react";
import {Button, Col, Drawer, message, Row, Table, Typography} from "antd";
import {usersService} from "../services/usersService";
import {UserForm} from "./UserForm";

const PAGE_SIZE = 10;

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
      title: "Ações",
      dataIndex: "",
      render: (_, record) => (
        <div>
          <a onClick={() => onEdit(record)}>Editar</a>
        </div>
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