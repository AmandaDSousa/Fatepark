import {useEffect, useState} from "react";
import {Button, Col, Drawer, message, Row, Space, Table, Typography} from "antd";
import {customersService} from "../services/customersService";
import {CustomerForm} from "./CustomerForm";

const PAGE_SIZE = 10;

export function Customers() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    getCustomers(currentPage)
  }, [currentPage])

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Nome", dataIndex: "name" },
    { title: "CPF", dataIndex: "cpf" },
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

  async function getCustomers(page) {
    try {
      setLoading(true)
      const { items, count } = await customersService().getAllPaged(page, PAGE_SIZE);
      setCustomers(items)
      setCount(count)
    } catch {
      message.error("Falha ao obter lista de clientes");
    } finally {
      setLoading(false)
    }
  }

  function handleChange(pagination) {
    setPage(pagination.current);
  }

  function onCreate() {
    setEditingCustomer(null);
    setShowDrawer(true);
  }

  function onEdit(record) {
    setEditingCustomer(record);
    setShowDrawer(true);
  }

  async function onDelete(record) {
    try {
      message.info("Excluindo cliente");
      await customersService().deleteCustomer(record.id);
      message.success("Cliente excluído com sucesso");
      await getCustomers(currentPage);
    } catch {
      message.error("Falha ao excluir cliente");
    }
  }

  async function onDrawerClose() {
    setEditingCustomer(null);
    setShowDrawer(false);
    await getCustomers(currentPage);
  }

  return (
    <div>
      <Row align={"top"} justify={"space-between"}>
        <Col>
          <Typography.Title level={2}>Clientes</Typography.Title>
        </Col>
        <Col>
          <Button type={"primary"} onClick={() => onCreate()}>Criar cliente</Button>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        rowKey={record => record.id}
        pagination={{ current: currentPage, pageSize: PAGE_SIZE, total: count }}
        dataSource={customers}
        onChange={handleChange}
      />

      <Drawer
        width={500}
        title={editingCustomer ? "Editar cliente" : "Criar cliente"}
        placement="right"
        onClose={onDrawerClose}
        visible={showDrawer}
      >
        <CustomerForm customer={editingCustomer} onSave={onDrawerClose} />
      </Drawer>
    </div>
  )
}