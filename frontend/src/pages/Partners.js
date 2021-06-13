import {useEffect, useState} from "react";
import {Button, Col, Drawer, message, Row, Space, Table, Typography} from "antd";

import {partnersService} from "../services/partnersService";
import {PartnerForm} from "./PartnerForm";
import {formatToBrazilianCurrency} from "../utils/currency-utils";

const PAGE_SIZE = 10;

export function Partners() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    getPartners(currentPage)
  }, [currentPage])

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Nome", dataIndex: "name" },
    { title: "Desconto", dataIndex: "discount", render: (_, record) => formatToBrazilianCurrency(record.discount) },
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

  async function getPartners(page) {
    try {
      setLoading(true)
      const { items, count } = await partnersService().getAllPaged(page, PAGE_SIZE);
      setPartners(items)
      setCount(count)
    } catch {
      message.error("Falha ao obter lista de convênios");
    } finally {
      setLoading(false)
    }
  }

  function handleChange(pagination) {
    setPage(pagination.current);
  }

  function onCreate() {
    setEditingPartner(null);
    setShowDrawer(true);
  }

  function onEdit(record) {
    setEditingPartner(record);
    setShowDrawer(true);
  }

  async function onDelete(record) {
    try {
      message.info("Excluindo convênio");
      await partnersService().deletePartner(record.id);
      message.success("Cliente excluído com sucesso");
      await getPartners(currentPage);
    } catch {
      message.error("Falha ao excluir convênio");
    }
  }

  async function onDrawerClose() {
    setEditingPartner(null);
    setShowDrawer(false);
    await getPartners(currentPage);
  }

  return (
    <div>
      <Row align={"top"} justify={"space-between"}>
        <Col>
          <Typography.Title level={2}>Convênios</Typography.Title>
        </Col>
        <Col>
          <Button type={"primary"} onClick={() => onCreate()}>Criar convênio</Button>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        rowKey={record => record.id}
        pagination={{ current: currentPage, pageSize: PAGE_SIZE, total: count }}
        dataSource={partners}
        onChange={handleChange}
      />

      <Drawer
        width={500}
        title={editingPartner ? "Editar convênio" : "Criar convênio"}
        placement="right"
        onClose={onDrawerClose}
        visible={showDrawer}
      >
        <PartnerForm partner={editingPartner} onSave={onDrawerClose} />
      </Drawer>
    </div>
  )
}