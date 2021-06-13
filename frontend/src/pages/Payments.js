import {useEffect, useState} from "react";
import {Button, Col, Drawer, message, Row, Space, Table, Typography} from "antd";
import moment from "moment";

import {formatToBrazilianCurrency} from "../utils/currency-utils";
import {paymentsService} from "../services/paymentsService";
import {PaymentForm} from "./PaymentForm";

const PAGE_SIZE = 10;

export function Payments() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    getPayments(currentPage)
  }, [currentPage])

  const columns = [
    {
      title: "Cliente",
      dataIndex: "customer",
      render: (_, row) => row.customer?.name
    },
    {
      title: "Data de pagamento",
      dataIndex: "paymentDate",
      render: (_, row) => row.start ? moment(row.start).format("DD/MM/YYYY") : null
    },
    {
      title: "Valor do pagamento",
      dataIndex: "paymentDate",
      render: () => formatToBrazilianCurrency(250)
    },
    {
      title: "Início do plano",
      dataIndex: "start",
      render: (_, row) => row.start ? moment(row.start).format("DD/MM/YYYY") : null
    },
    {
      title: "Fim do plano",
      dataIndex: "end",
      render: (_, row) => row.end ? moment(row.end).format("DD/MM/YYYY") : null
    }
  ]

  async function getPayments(page) {
    try {
      setLoading(true)
      const {items, count} = await paymentsService().getAllPaged(page, PAGE_SIZE);
      setPayments(items)
      setCount(count)
    } catch {
      message.error("Falha ao obter lista de pagamentos");
    } finally {
      setLoading(false)
    }
  }

  function handleChange(pagination) {
    setPage(pagination.current);
  }

  function registerPayment() {
    setEditingPayment(null);
    setShowDrawer(true);
  }

  async function onDrawerClose() {
    setEditingPayment(null);
    setShowDrawer(false);
    await getPayments(currentPage);
  }

  return (
    <div>
      <Row align={"top"} justify={"space-between"}>
        <Col>
          <Typography.Title level={2}>Pagamentos</Typography.Title>
        </Col>
        <Col>
          <Button type={"primary"} onClick={() => registerPayment()}>Registrar pagamento</Button>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        rowKey={record => record.id}
        pagination={{current: currentPage, pageSize: PAGE_SIZE, total: count}}
        dataSource={payments}
        onChange={handleChange}
      />

      <Drawer
        width={500}
        title={"Registrar pagamento"}
        placement="right"
        onClose={onDrawerClose}
        visible={showDrawer}
      >
        <PaymentForm payment={editingPayment} onFinish={onDrawerClose} />
      </Drawer>
    </div>
  )
}