import {useEffect, useState} from "react";
import {Col, message, Row, Space, Table, Typography} from "antd";
import moment from "moment";

import {formatToBrazilianCurrency} from "../utils/currency-utils";
import {paymentsService} from "../services/paymentsService";

const PAGE_SIZE = 10;

export function Payments() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [payments, setPayments] = useState([]);

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
      title: "Início do plano",
      dataIndex: "start",
      render: (_, row) => row.start ? moment(row.start).format("DD/MM/YYYY") : null
    },
    {
      title: "Fim do plano",
      dataIndex: "end",
      render: (_, row) => row.end ? moment(row.end).format("DD/MM/YYYY") : null
    },
    {
      title: "Ações",
      dataIndex: "",
      render: (_, record) => (
        <a onClick={() =>onEdit(record)}>Editar</a>
      )
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

  function onEdit(payment) {

  }

  return (
    <div>
      <Row align={"top"} justify={"space-between"}>
        <Col>
          <Typography.Title level={2}>Pagamentos</Typography.Title>
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
    </div>
  )
}