import {useState} from "react";
import {Button, Form, message, Select, Typography} from "antd";

import {paymentsService} from "../services/paymentsService";
import {customerssService} from "../services/customersService";
import moment from "moment";

export function PaymentForm({payment, onFinish}) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchingCustomers, setSearchingCustomers] = useState(false);

  const start = moment()
  const end = moment().add(30, "day")

  async function onSubmit(values) {
    setSaving(true);

    await createPayment(values);

    setSaving(false);

    onFinish()
  }

  async function createPayment(values) {
    try {
      await paymentsService().create({ ...values, start: start.toDate(), end: end.toDate() });
      message.success("Pagamento registrado com sucesso")
    } catch(e) {
      message.error(e.response?.data?.message ?? "Falha ao registrar pagamento");
    }
  }

  async function searchCustomerWithCpf(cpf) {
    try {
      setSearchingCustomers(true)
      const customers = await customerssService().getAllWithCpf(cpf)
      setCustomers(customers)
    } catch {
      message.error("Falha ao obter lista de clientes")
    } finally {
      setSearchingCustomers(true)
    }
  }

  const customersOptions = customers.map(customer => <Select.Option key={customer.id} value={customer.id}>{customer.name} - {customer.cpf}</Select.Option>);

  return (
    <Form name="payment-form" form={form} onFinish={onSubmit}>
      <Form.Item
        label="Nome"
        name="customerId"
        rules={[{required: true, message: 'Cliente é obrigatório'}]}
      >
        <Select
          showSearch
          placeholder={"Buscar cliente pelo CPF"}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          loading={searchingCustomers}
          onSearch={searchCustomerWithCpf}
          notFoundContent={null}
        >
          {customersOptions}
        </Select>
      </Form.Item>

      <Typography.Paragraph>Data de início da assinatura: {start.format("DD/MM/YYYY")}</Typography.Paragraph>
      <Typography.Paragraph>Data de fim da assinatura: {end.format("DD/MM/YYYY")}</Typography.Paragraph>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>Salvar</Button>
      </Form.Item>
    </Form>
  )
}